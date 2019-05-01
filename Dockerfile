FROM smebberson/alpine-nginx-nodejs

#Website
RUN mkdir -p /app
WORKDIR /app

COPY website /app
RUN yarn install --production
RUN yarn build

#API
RUN apt-get update && apt-get install -y build-essential && apt-get install -y python
RUN mkdir -p /api
WORKDIR /api

COPY package.json /api
RUN yarn install --production
RUN yarn global add pm2

COPY . /api
RUN yarn build

#Nginx
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD [ "yarn", "start-dev" ]
CMD ["nginx", "-g", "daemon off;"]