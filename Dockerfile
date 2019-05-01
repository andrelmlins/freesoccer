FROM finizco/nginx-node:latest

RUN apk update && apk --no-cache add --virtual builds-deps build-base python
RUN yarn global add pm2
RUN echo 'http://dl-cdn.alpinelinux.org/alpine/v3.6/main' >> /etc/apk/repositories
RUN echo 'http://dl-cdn.alpinelinux.org/alpine/v3.6/community' >> /etc/apk/repositories
RUN apk update
RUN apk add mongodb=3.4.4-r0

#Website
RUN mkdir -p /app
WORKDIR /app

COPY website /app
RUN yarn install --production
RUN yarn build

#API
RUN mkdir -p /api
WORKDIR /api

COPY package.json /api
RUN yarn install --production

COPY . /api
RUN yarn build

#Bootstrap
COPY bootstrap.sh /api
RUN chmod +x /api/bootstrap.sh

#Nginx
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["./bootstrap.sh"]  