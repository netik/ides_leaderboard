use dc25;

drop table badges;
drop table badge_history;

create table badges (
       id     integer not null auto_increment,
       created_at timestamp DEFAULT '0000-00-00 00:00:00',
       updated_at timestamp default now() on update now(),
       name   varchar(255) not null,
       badgeid  varchar(10) not null,
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
       created_at timestamp DEFAULT '0000-00-00 00:00:00',
       updated_at timestamp default now() on update now(),
       name   varchar(255) not null,
       badgeid  varchar(10) not null,
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

ALTER TABLE `badges` ADD UNIQUE `unique_key` ( `id` );

ALTER TABLE `badges` ADD UNIQUE `unique_key_badgeid` ( `badgeid` );
