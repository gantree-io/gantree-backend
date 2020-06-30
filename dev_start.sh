#!/bin/bash
# pushd ../telemetry-action-server/bin/grafana-6.7.3/bin && pm2 start grafana-server && popd
pm2 start ./process.json
echo "run this too:"
echo "--> sudo systemctl start mongod"
