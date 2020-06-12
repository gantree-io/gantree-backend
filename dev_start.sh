#!/bin/bash
pushd ../telemetry-action-server/bin/grafana-6.7.3/bin && pm2 start grafana-server && popd
pm2 start ./server.js --name "gantree-server" --watch
echo "run this too:"
echo "--> sudo systemctl start mongod"
