#!/usr/bin/python
#
# leaderboard_agent.py
#
# This agent will pick up peers from our DC27 badge
#
# Configuration
# -------------
# In the file "leaderboard_agent_config.py",
# set the variables APIURL, APIKEY, and DEBUG.
#
#
# John Adams <jna@retina.net> 8/5/2019

import re
import os
import sys
import serial
import time
import datetime
import requests
import json
from leaderboard_agent_config import APIKEY,APIURL,DEBUG
from math import floor

def build_rfc3339_phrase(datetime_obj):
    datetime_phrase = datetime_obj.strftime('%Y-%m-%dT%H:%M:%S')
    us = datetime_obj.strftime('%f')
    seconds = None
    try:
        seconds = datetime_obj.utcoffset().total_seconds()
    except AttributeError:
        pass

    if seconds is None:
        datetime_phrase += 'Z'
    else:
        # Append: decimal, 6-digit uS, -/+, hours, minutes
        datetime_phrase += ('.%.6s%s%02d:%02d' % (
            us,
            ('-' if seconds < 0 else '+'),
            abs(int(floor(seconds / 3600))),
            abs(seconds % 3600)
        ))

    return datetime_phrase

ser = serial.Serial(timeout=1,
                    xonxoff=False,
                    dsrdtr=True,
                    rtscts=True)
ser.baudrate = 115200
ser.port = '/dev/cu.SLAB_USBtoUART'

ser.open()
if not ser.is_open:
    print "failed to open port."
    sys.exit(1)

ser.flush()
# [c9:b7:d4:2b:d4:b6] [bbbbbb....] [-81] [16] Badge: X/Y: 162/209 SHIPTYPE: 0 XP: 160 RANK: 0 INCOMBAT: 0
rex = re.compile(r'\[([0-9a-fA-F:]+)\] \[([^\]]+)\] \[([^\]])*\] \[([^\]])*\] Badge: X/Y: (\d+)/(\d+) SHIPTYPE: (\d+) XP: (\d+) RANK: (\d+) INCOMBAT: (\d+)')

while 1 == 1:
    dt = datetime.datetime.now()
    ser.write("radio peerlist\r\n");
    ser.flush() # it is buffering. required to get the data out *now*

    b=""

    payload = None
    while not b.startswith("boom>"):
        b = ser.readline()
        m = rex.match(b)
        if m:
            payload = {}
            payload['badgeid'] = m.group(1)
            payload['name'] = m.group(2)
            payload['xp'] = m.group(8)
            payload['hp'] = 0
            payload['level'] = m.group(9)

    if payload:
        payload["apikey"] = APIKEY

        if DEBUG:
            print payload

        r = requests.post(APIURL, json=payload
        )
        if DEBUG:
            print r.status_code
            print r.json()

        if r.status_code == 200:
            print "[%s] Update OK: %s (netid %s)" % (build_rfc3339_phrase(dt), payload[u'name'], payload[u'badgeid'])
        else:
            print "[%s] Update FAILED: %s (netid %s)" % (build_rfc3339_phrase(dt), payload[u'name'], payload[u'badgeid'])

            
    time.sleep(3);
