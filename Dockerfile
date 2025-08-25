FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install
RUN npm install --global nodemon

EXPOSE 6061

CMD ["npm", "start"]