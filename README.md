# Ides of DEF CON: Leaderboard

This repo listens to the serial port for JSON ping data from the badge
(see: dc25spqr.com). When the badge hears a ping, it spits out JSON over it's console port.

The data will be read, stored into the long-term database. When the
page next polls, it will display the results in the right order.

You can enable this in the Makefile with XXXXX. Standard badge code has this commented out.

