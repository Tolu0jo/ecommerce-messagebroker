FROM node:18-alpine

WORKDIR /app/shopping

COPY package.json ./

RUN yarn

COPY . .

EXPOSE 8003

CMD ["yarn","start:prod"]


 