FROM node:14-alpine

WORKDIR /auction/front-end

COPY . .

RUN apk add git

RUN npm install

EXPOSE 3000

CMD ["npm", "start"]