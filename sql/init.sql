; The current badge state table

create table badges {
       id     integer,
       name   varchar(255),
       badgeid  integer,
       ptype  integer,
       hp     integer,
       xp     integer,
       plevel integer,
       won    integer,
       lost   integer,
       agl    integer,
       might  integer,
       luck   integer,
       firstseen datetime,
       lastseen datetime
}

; the historical badge record
create table badge_history {
       id     integer,
       created_at  timestamp,
       name   varchar(255),
       badgeid  integer,
       ptype  integer,
       hp     integer,
       xp     integer,
       plevel integer,
       won    integer,
       lost   integer,
       agl    integer,
       might  integer,
       luck   integer,
}

