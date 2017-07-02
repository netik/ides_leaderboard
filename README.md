# Ides of DEF CON: Leaderboard

This is the server for the leaderboard of the Ides of DEF CON game.

Client code for the leaderboard is here:
https://github.com/netik/chibios-orchard/blob/orchard-r2/badge/leaderboard_agent.py

You can enable pingdumps in the Makefile of the badge code with ``-DLEADERBOARD_AGENT``
The pingdump code is not enabled in the standard badge codebase.

That client polls a serial port for JSON ping data from our badge.
When the badge receives a ping, it dumps out the ping data as JSON over it's console port.

The data is read, and then forwarded via HTTPS POST to this code, which will store it into the database.

The leaderboard page makes XHR requests, and when the page next polls, it will display data from all seen badges.

