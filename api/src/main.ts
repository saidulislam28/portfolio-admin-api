/* eslint-disable */
import { config } from 'dotenv';
config();
import { join } from 'path';

import "./instrument";

import { HttpAdapterHost, NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { json } from 'body-parser';

import { AppModule } from './app.module';
import { PrismaClientExceptionFilter } from "./prisma-client-exception/prisma-client-exception.filter";
import { PrismaClientValidationExceptionFilter } from "./prisma-client-exception/prisma-client-validation-exception.filter";
import { NestExpressApplication } from "@nestjs/platform-express";
import { ValidationPipe } from '@nestjs/common';
import { Response } from 'express';

const cloneBuffer = require('clone-buffer');

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    rawBody: true,
  });
  // app.useStaticAssets(join(__dirname, '..', 'public'));
  const options = {
    origin: [
      'http://82.29.161.73:3200',
      'http://82.29.161.73:3202',
      'http://82.29.161.73:3201',
      'http://localhost:3001',
      'http://localhost:3002',
      'http://localhost:3000',
      'http://localhost:5173',
      'http://localhost:3002',
      'http://www.speakingmate.org',
      'https://portfolio-admin-xi-three.vercel.app',
      'https://saidul-portfolio.netlify.app'
    ],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true
  };
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
  }));
  app.enableCors(options);
  app.setGlobalPrefix('api/v1');

  app.enableShutdownHooks();
  const config = new DocumentBuilder()
    .setTitle('SpeakingMate API')
    .setDescription('description')
    .setVersion('1.0.0')
    .addTag('starter')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'access-token',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-doc', app, document);

  // Serve OpenAPI spec as JSON
  app.getHttpAdapter().get('/openapi.json', (req, res: Response) => {
    res.json(document);
  });

  // Serve Scalar UI
  app.getHttpAdapter().get('/docs', (req, res: Response) => {
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <title>SpeakingMate API Docs - Scalar</title>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>
          html, body {
            margin: 0;
            padding: 0;
            height: 100%;
            font-family: Arial, sans-serif;
          }
        </style>
      </head>
      <body>
        <script
          id="api-reference"
          data-url="/openapi.json"
          data-layout="modern"
          data-theme="purple">
        </script>
        <script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"></script>
      </body>
      </html>
    `);
  });



  // const { httpAdapter } = app.get(HttpAdapterHost);
  // app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));
  // app.useGlobalFilters(new PrismaClientValidationExceptionFilter(httpAdapter));

  /* to make stripe webhook raw body parsing work*/
  //https://yanndanthu.github.io/2019/07/04/Checking-Stripe-Webhook-Signatures-from-NestJS.html
  app.use(json({
    verify: (req: any, res, buf, encoding) => {
      // important to store rawBody for Stripe signature verification
      if (req.headers['stripe-signature'] && Buffer.isBuffer(buf)) {
        req.rawBody = cloneBuffer(buf);
      }
      return true;
    },
  }));
  /*end*/

  const PORT = process.env.PORT || 80;
  await app.listen(PORT);
}
bootstrap();
