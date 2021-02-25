#!/bin/bash
chmod +x cache.sh
php artisan down
./cache.sh
git pull
php artisan snapshot:create
php artisan migrate
npm run prod
php artisan db:seed --class=PermissionTableSeeder
./cache.sh
php artisan up
