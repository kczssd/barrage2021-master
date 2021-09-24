#!/bin/bash

rm -rf dist
yarn build:send
mv dist barrage2019
scp -r -P 2023 ./barrage2019 root@wx.redrock.team:~/www/

rm -rf dist
yarn build:screen
mv dist barrage2019-screen
scp -r -P 2023 ./barrage2019-screen root@wx.redrock.team:~/www/

rm -rf barrage2019
rm -rf barrage2019-screen
