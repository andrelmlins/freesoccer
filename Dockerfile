FROM finizco/nginx-node:latest

RUN apk update && apk --no-cache add --virtual builds-deps build-base python

#Website
RUN mkdir -p /app
WORKDIR /app

COPY website /app
RUN yarn install --production
RUN yarn build

#API
RUN mkdir -p /api
WORKDIR /api

COPY bootstrap.sh /api
COPY package.json /api
RUN yarn install --production

COPY . /api
RUN yarn build

#Nginx
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD [ "yarn", "start-dev" ]
CMD ["nginx", "-g", "daemon off;"]