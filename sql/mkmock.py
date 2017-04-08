#!/usr/local/bin/python
import random

bmax=255

i=0

def randint(m):
  rng = random.SystemRandom()
  return rng.randint(0, m)

def badgeid():
  rng = random.SystemRandom()
  return rng.randint(0, 2**32)

# load in the names
with open("names.txt") as f:
    content = f.readlines()
names = [x.strip() for x in content]

while (i<bmax):
  fakename = names[i]

  print "INSERT INTO BADGES (created_at,updated_at,name,badgeid, ptype, hp, xp, plevel, won, lost, agl, might, luck) values (now(),     now(),     \'%s\'  ,%d,      %d,    %d, %d, %d,     %d,  %d,   %d,  %d, 20);" %  (fakename, badgeid(), randint(3), randint(100), randint(2000), randint(10), randint(100), randint(100), randint(20), randint(20))

  i = i + 1



