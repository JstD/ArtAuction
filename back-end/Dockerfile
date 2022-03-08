FROM node:14-alpine

WORKDIR /auction/back-end

COPY . .

RUN npm install

EXPOSE 5000

CMD ["npm", "start"]