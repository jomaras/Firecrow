#!/bin/bash

lsof -i tcp@0.0.0.0:9000 #list anything bound to port 9000
if [ $? -eq 0 ] #if something was listed
    then
        killall 'phantomjs'
fi

/usr/local/Cellar/phantomjs/1.8.1/bin/phantomjs --remote-debugger-port=9000 $1 &
# --remote-debugger-autorun=yes <- use if you have added 'debugger;' break points
# replace $1 with full path if you don't pass it as a variable.

sleep 2; #give phantomJS time to get started

open -a /Applications/Google\ Chrome.app http://localhost:9000 & #linux has a different 'open' command
# alt URL if you want to skip the page listing
# http://localhost:9000/webkit/inspector/inspector.html?page=1

#see also
#github.com/ariya/phantomjs/wiki/Troubleshooting