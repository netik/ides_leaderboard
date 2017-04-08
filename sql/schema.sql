use dc25;


create table badges (
       id     integer not null auto_increment,
       created_at datetime not null,
       updated_at datetime not null,
       name   varchar(255) not null,
       badgeid  bigint not null,
       ptype  integer not null,
       hp     integer not null,
       xp     integer not null,
       plevel integer not null,
       won    integer not null,
       lost   integer not null,
       agl    integer not null,
       might  integer not null,
       luck   integer not null,
       primary key(id)

);

create table badge_history (
       id     integer not null auto_increment,
       created_at datetime not null,
       updated_at datetime not null,
       name   varchar(255) not null,
       badgeid  bigint not null,
       ptype  integer not null,
       hp     integer not null,
       xp     integer not null,
       plevel integer not null,
       won    integer not null,
       lost   integer not null,
       agl    integer not null,
       might  integer not null,
       luck   integer not null,
       primary key(id)
);

