FROM node:20

LABEL author="mouhanned"

WORKDIR /app

COPY ./package*.json .

RUN npm install

COPY . .

EXPOSE 3000

ENTRYPOINT [ "npm","start" ]