use dc29;

drop table badges;
drop table badge_history;

create table badges (
       id     integer not null auto_increment,
       created_at timestamp DEFAULT CURRENT_TIMESTAMP,
       updated_at timestamp default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP,
       name     varchar(255) not null,
       badgeid  varchar(255) not null,
       xp     integer not null,
       level  integer not null,
       won    integer null,
       lost   integer null,
       primary key(id)
);

create table badge_history (
       id     integer not null auto_increment,
       created_at timestamp DEFAULT CURRENT_TIMESTAMP,
       updated_at timestamp default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP,
       name   varchar(255) not null,
       badgeid  varchar(255) not null,
       xp     integer not null,
       level integer not null,
       won    integer null,
       lost   integer null,
       primary key(id)
);

ALTER TABLE `badges` ADD UNIQUE `unique_key` ( `id` );

ALTER TABLE `badges` ADD UNIQUE `unique_key_badgeid` ( `badgeid` );
