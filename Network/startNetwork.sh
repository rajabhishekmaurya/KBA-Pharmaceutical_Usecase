#!/bin/sh

echo "Start the network"
minifab netup -s couchdb -e true -o producer.pharma.com

sleep 5

echo "Create the channel"
minifab create -c pharmachannel

sleep 2

echo "Join the peers to channel"
minifab join -c pharmachannel

sleep 2

echo "Anchor update"
minifab anchorupdate

sleep 2

echo "Generate the required profiles"
minifab profilegen -c pharmachannel


