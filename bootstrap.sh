#!/bin/sh

pm2-runtime dist/index.js --no-daemon
nginx -g 'daemon off;'