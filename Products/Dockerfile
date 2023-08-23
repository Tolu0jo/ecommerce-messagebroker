FROM node:18-alpine

WORKDIR /app/products

COPY package.json .

RUN yarn

COPY . .

EXPOSE 8002

CMD ["yarn","start:prod"]


 