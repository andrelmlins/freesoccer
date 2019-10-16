---
id: getting-started
title: Getting Started
sidebar_label: Getting Started
---

![FreeSoccer](https://raw.githubusercontent.com/andrelmlins/freesoccer/master/public/logo.png)

[Free API](https://www.apifreesoccer.com/) with results from national football competitions

## Build Setup

```
# install dependencies
yarn install

# run the API
yarn start

# run scraping
yarn scraping [-c or --competition <code_competition>] [-ly or --last-year] [-t or --table]
```

## Docker

[![dockeri.co](https://dockeri.co/image/andrelmlins1/freesoccer)](https://hub.docker.com/r/andrelmlins1/freesoccer)

There's an official docker image available on [Dockerhub](https://hub.docker.com/r/andrelmlins1/freesoccer):

```
$ docker pull andrelmlins1/freesoccer
$ docker run -d -p 80:8080 --name andrelmlins1/freesoccer
```
