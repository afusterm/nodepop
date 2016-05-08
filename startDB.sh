#!/bin/ksh

if [ ! -d ./db ]
then
    mkdir -p db
fi

mongod --dbpath ./db &
