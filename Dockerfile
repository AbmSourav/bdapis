FROM node:latest

RUN mkdir -p /app
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN chmod -R 777 ./

EXPOSE 3000

CMD ["npm", "start"]