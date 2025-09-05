FROM node:18-alpine as build

WORKDIR /usr/app

COPY . /usr/app

RUN npm install

RUN npm run build

# RUN npm run preview

# FROM nginx:1.23.1-alpine
# EXPOSE 80
# COPY ./docker/nginx.conf /etc/nginx/conf.d/default.conf
# COPY --from=build /usr/app/dist /usr/share/nginx/html
