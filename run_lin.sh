#!/bin/bash

APP_PATH="/home/filip/Documents/github/Pick_to_light_app"

mkdir -p "$APP_PATH/logs"

cleanup() {
  echo "$(date): Stopping the server and client..." >> "$APP_PATH/logs/startup.log"
  kill $SERVER_PID
  kill $CLIENT_PID
  wait $SERVER_PID 2>/dev/null
  wait $CLIENT_PID 2>/dev/null
}
trap cleanup SIGINT

is_wifi_connected() {
    ip addr show wlan0 | grep "inet\b" > /dev/null 2>&1
    return $?
}


while ! is_wifi_connected; do
    echo "Waiting for Wi-Fi connection..."
    sleep 5
done

echo "$(date): Downloading data and setting database..." >> "$APP_PATH/logs/startup.log"
node url-to-file.js > "$APP_PATH/logs/server.log" 2>&1
node setup.js >> "$APP_PATH/logs/server.log" 2>&1

echo "$(date): Starting the client..." >> "$APP_PATH/logs/startup.log"
cd "$APP_PATH/client/"
npm run start > "$APP_PATH/logs/client.log" 2>&1 &
CLIENT_PID=$!
echo "$(date): Client started with PID $CLIENT_PID" >> "$APP_PATH/logs/startup.log"

sleep 20

echo "$(date): Starting the server..." >> "$APP_PATH/logs/startup.log"
cd "$APP_PATH/server/"
node index.js >> "$APP_PATH/logs/server.log" 2>&1 &
SERVER_PID=$!
echo "$(date): Server started with PID $SERVER_PID" >> "$APP_PATH/logs/startup.log"


wait $SERVER_PID
wait $CLIENT_PID

