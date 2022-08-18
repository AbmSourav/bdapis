 FROM node:latest

 RUN mkdir -p /app
 WORKDIR /app
 #/usr/src/app
 COPY package.json /app
 RUN npm install

 COPY . /app

 EXPOSE 3000

 ENTRYPOINT ["node"]

 CMD ["app.js"]

 FROM nginx
COPY ./default.conf /etc/nginx/conf.d/