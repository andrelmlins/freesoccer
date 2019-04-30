FROM node

RUN apt-get update && apt-get install -y build-essential && apt-get install -y python
RUN mkdir -p /home/api
WORKDIR /home/api

COPY package.json /home/api
RUN yarn install --production
RUN yarn global add pm2

COPY . /home/api
RUN yarn build

CMD [ "yarn", "start-dev" ]

FROM node:alpine

RUN mkdir -p /home/app
WORKDIR /home/app

COPY website /home/app
RUN yarn install --production
RUN yarn build

FROM nginx:1.13.9-alpine

COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]