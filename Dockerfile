FROM node

RUN yarn global add pm2

RUN mkdir -p /api
WORKDIR /api

COPY package.json /api
COPY yarn.lock /api
RUN yarn install --frozen-lockfile --production
RUN yarn build

COPY . /api

EXPOSE 80

CMD ["pm2", "start", "dist/index.js", "--no-daemon"]