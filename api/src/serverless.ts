import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from '../src/app.module';
import express from 'express';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const expressApp = express();
let cachedApp;

async function createNestServer(expressInstance) {
  if (!cachedApp) {
    const app = await NestFactory.create(
      AppModule,
      new ExpressAdapter(expressInstance),
      { rawBody: true }
    );

    // Your CORS config
    app.enableCors({
      origin: [
        'http://localhost:3000',
        'http://localhost:5173',
        'https://portfolio-admin-xi-three.vercel.app',
        'https://saidul-portfolio.netlify.app'
      ],
      credentials: true,
    });

    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    app.setGlobalPrefix('api/v1');

    // Swagger config (optional for production)
    const config = new DocumentBuilder()
      .setTitle('Portfolio API')
      .setVersion('1.0.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api-doc', app, document);

    await app.init();
    cachedApp = app;
  }
  return cachedApp;
}

export default async (req, res) => {
  await createNestServer(expressApp);
  return expressApp(req, res);
};