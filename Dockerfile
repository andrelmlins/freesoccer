FROM node

RUN yarn global add pm2

RUN mkdir -p /api
WORKDIR /api

COPY package.json /api
RUN yarn install --production

COPY . /api
RUN yarn build

EXPOSE 80

CMD ["pm2", "start", "dist/index.js", "--no-daemon"]