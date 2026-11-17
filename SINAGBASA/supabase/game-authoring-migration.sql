-- Run once in the Supabase SQL Editor for an existing SINAGBASA database.

begin;

alter table public.content_items
  add column if not exists game_config jsonb;

alter table public.content_items
  drop constraint if exists content_items_story_game_config_check;

alter table public.content_items
  add constraint content_items_story_game_config_check
  check (kind <> 'story' or game_config is null or jsonb_typeof(game_config) = 'object');

commit;
