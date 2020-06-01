#!/bin/bash
pm2 start ./server.js --name "gantree-server" --watch
echo "run this too:"
echo "--> sudo systemctl start mongod"
