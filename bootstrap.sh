#!/bin/sh

yarn start-dev
nginx -g 'daemon off;'