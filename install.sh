#!/usr/bin/env bash

echo 'Setting up api...'

cd api

npm install

npx prisma migrate deploy

npx prisma generate

cd ../admin

npm install

cd ../website

npm install

cd ../vendor

npm install

echo 'Setup done. To run all projects at once: npm run start'
