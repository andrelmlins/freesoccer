FROM node

RUN mkdir -p /api
WORKDIR /api

COPY package.json /api
RUN yarn install

COPY . /api
RUN yarn build

EXPOSE 80
CMD [ "yarn", "start-dev" ]

FROM nginx:1.13.9-alpine

RUN mkdir -p /app

WORKDIR /app

COPY ./nginx.conf /etc/nginx/nginx.conf
RUN cd ./website
RUN yarn build
COPY ./build /app

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]