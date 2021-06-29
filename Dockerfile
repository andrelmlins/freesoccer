FROM node:14-stretch-slim

RUN yarn global add pm2

RUN mkdir -p /api
WORKDIR /api

COPY . /api

RUN yarn install --frozen-lockfile
RUN yarn build

EXPOSE 80

CMD ["pm2", "start", "dist/index.js", "--no-daemon"]