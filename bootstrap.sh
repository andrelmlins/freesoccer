#!/bin/sh

pm2 start dist/index.js --no-daemon
nginx -g 'daemon off;'