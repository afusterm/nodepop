#!/bin/bash

if [ ! -d ./db ]
then
    mkdir -p db
fi

if [ ! -d ./dblogs ]
then
    mkdir -p dblogs
fi

mongod --dbpath ./db 2> dblogs/mongod.err > dblogs/mongod.log &