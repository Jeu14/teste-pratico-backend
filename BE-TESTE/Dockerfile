FROM node:20

WORKDIR /usr/src/app

COPY . .

RUN npm install

EXPOSE 3333

CMD ["node", "ace", "serve", "--watch"]