<div align="center">

![FreeSoccer](https://raw.githubusercontent.com/andrelmlins/freesoccer/master/public/logo.png)

[Free API](https://www.apifreesoccer.com/) with results from national football competitions

[![Build Status](https://travis-ci.com/andrelmlins/freesoccer.svg?branch=master)](https://travis-ci.com/andrelmlins/freesoccer)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/andrelmlins/freesoccer/blob/master/LICENSE)
[![Known Vulnerabilities](https://snyk.io/test/github/andrelmlins/freesoccer/badge.svg)](https://snyk.io/test/github/andrelmlins/freesoccer)
[![Dependencies](https://david-dm.org/andrelmlins/freesoccer.svg)](https://david-dm.org/andrelmlins/freesoccer)
[![Badge Docker](https://images.microbadger.com/badges/image/andrelmlins1/freesoccer.svg)](https://microbadger.com/images/andrelmlins1/freesoccer 'Get your own image badge on microbadger.com')
[![Docker Pulls](https://img.shields.io/docker/pulls/andrelmlins1/freesoccer.svg)](https://hub.docker.com/r/andrelmlins1/freesoccer)
[![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/andrelmlins/freesoccer.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/andrelmlins/freesoccer/context:javascript)

</div>

## Features

- 🕒 Scraping with CronJob
- 👨🏾‍💻 Exec scraping in Line Command
- 🔐 Login in API
- 🐋 Docker Image with environment variables in Dockerhub
- 💻 Scraping in ServerSide and ClientSide

## Build Setup

```
# install dependencies
yarn install

# run the API
yarn start

# run scraping
yarn scraping [-c or --competition <code_competition>] [-ly or --last-year] [-t or --table]
```

## Federations

- CBF
- RFEF
- FFF
- FIGC
- DFB
- FPF
- FA

## Competitions

| Name                      | Country  | Sex | Year                  | Results | Table | Statistics | Flags |
| ------------------------- | -------- | --- | --------------------- | ------- | ----- | ---------- | ----- |
| Brasileirão Série A       | Brazil   | M   | 2012 - 2018           | ✔️      | ✔️    | ❌         | ✔️    |
| Brasileirão Série B       | Brazil   | M   | 2012 - 2018           | ✔️      | ✔️    | ❌         | ✔️    |
| Copa do Brasil            | Brazil   | M   | 2012 - 2018           | ✔️      | ➖    | ❌         | ✔️    |
| Copa do Brasil Sub-20     | Brazil   | M   | 2012 - 2018           | ✔️      | ➖    | ❌         | ✔️    |
| Copa do Brasil Sub-17     | Brazil   | M   | 2013 - 2018           | ✔️      | ➖    | ❌         | ✔️    |
| Copa Verde                | Brazil   | M   | 2014 - 2018           | ✔️      | ➖    | ❌         | ✔️    |
| La Liga                   | Spain    | M   | 2013/2014 - 2018/2019 | ✔️      | ✔️    | ❌         | ❌    |
| La Liga Segunda División  | Spain    | M   | 2013/2014 - 2018/2019 | ✔️      | ✔️    | ❌         | ❌    |
| Primera División Femenina | Spain    | F   | 2013/2014 - 2018/2019 | ✔️      | ✔️    | ❌         | ❌    |
| Premier League            | England  | F   | 2000/2001 - 2018/2019 | ✔️      | ❌    | ❌         | ❌    |
| Ligue 1                   | France   | M   | 2000/2001 - 2018/2019 | ✔️      | ✔️    | ❌         | ✔️    |
| Ligue 2                   | France   | M   | 2000/2001 - 2018/2019 | ✔️      | ✔️    | ❌         | ✔️    |
| Coupe Ligue               | France   | M   | 2000/2001 - 2018/2019 | ✔️      | ➖    | ❌         | ✔️    |
| Serie A                   | Italy    | M   | 2004/2005 - 2018/2019 | ✔️      | ✔️    | ❌         | ✔️    |
| Bundesliga                | Germany  | M   | 2000/2001 - 2018/2019 | ✔️      | ✔️    | ❌         | ✔️    |
| 2 Bundesliga              | Germany  | M   | 2000/2001 - 2018/2019 | ✔️      | ✔️    | ❌         | ✔️    |
| 3 Liga                    | Germany  | M   | 2008/2009 - 2018/2019 | ✔️      | ✔️    | ❌         | ✔️    |
| Allianz Frauen-Bundesliga | Germany  | F   | 2000/2001 - 2018/2019 | ✔️      | ✔️    | ❌         | ✔️    |
| 2 Frauen-Bundesliga       | Germany  | F   | 2018/2019             | ✔️      | ✔️    | ❌         | ✔️    |
| Liga NOS                  | Portugal | M   | 2009/2010 - 2018/2019 | ✔️      | ✔️    | ❌         | ❌    |
| Ledman LigaPro            | Portugal | M   | 2009/2010 - 2018/2019 | ✔️      | ✔️    | ❌         | ❌    |

## Data Sources

- [CBF](http://cbf.com.br/)
- [RFEF](http://www.rfef.es/)
- [Ligue 1](https://www.ligue1.com/)
- [Serie A](http://www.legaseriea.it/)
- [DFB](https://www.dfb.de/)
- [Liga Portugal](http://ligaportugal.pt/)
- [Premier League](https://www.premierleague.com/)

## Docker

[![dockeri.co](https://dockeri.co/image/andrelmlins1/freesoccer)](https://hub.docker.com/r/andrelmlins1/freesoccer)

There's an official docker image available on [Dockerhub](https://hub.docker.com/r/andrelmlins1/freesoccer):

```
$ docker pull andrelmlins1/freesoccer
$ docker run -d -p 80:8080 --name andrelmlins1/freesoccer
```

## Used libraries

- Typescript
- Pupeteer
- Axios
- Cheerio
- Express
- Mongoose
- Bcrypt
- Cron
- Jsonwebtoken
