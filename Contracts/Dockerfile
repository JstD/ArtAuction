FROM node:14-alpine

WORKDIR /auction/Contracts

COPY . .

WORKDIR /auction/Contracts/listener

RUN apk add git

RUN npm install

EXPOSE 12345

CMD ["npm", "start"]