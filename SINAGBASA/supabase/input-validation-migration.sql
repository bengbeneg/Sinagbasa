-- Apply after the assessment and content migrations. Validates future writes.
begin;
create or replace function public.validate_platform_input()
returns trigger language plpgsql set search_path = '' as $$
declare item record; scene jsonb; choice jsonb; field text; number_value numeric;
begin
  if tg_table_name='profiles' then
    if char_length(new.display_name)>100 or new.display_name ~ '[[:cntrl:]]' then
      raise exception 'Display name must be at most 100 characters without control characters' using errcode='22023';
    end if;
  elsif tg_table_name='exam_attempts' then
    if jsonb_typeof(new.answers)<>'object' or octet_length(new.answers::text)>4096 then
      raise exception 'Invalid answers object' using errcode='22023';
    end if;
    for item in select key,value from jsonb_each(new.answers) loop
      if item.key !~ '^(0|[1-9][0-9]?)$' then
        raise exception 'Invalid answer index' using errcode='22023';
      end if;
      if item.key::integer>=30 or jsonb_typeof(item.value)<>'number' then
        raise exception 'Invalid answer index or choice' using errcode='22023';
      end if;
      number_value=item.value::text::numeric;
      if number_value<0 or number_value>4 or trunc(number_value)<>number_value then
        raise exception 'Invalid answer choice' using errcode='22023';
      end if;
    end loop;
  elsif tg_table_name='content_items' then
    if char_length(trim(new.title_en)) not between 1 and 160
      or char_length(trim(new.title_fil)) not between 1 and 160
      or char_length(trim(new.body_en)) not between 1 and 50000
      or char_length(trim(new.body_fil)) not between 1 and 50000 then
      raise exception 'Titles require 1–160 characters and content requires 1–50000 characters' using errcode='22023';
    end if;
    if new.resource_url is not null and (char_length(new.resource_url)>2048
      or new.resource_url !~* '^https?://[^[:space:]/?#]+([/?#][^[:space:]]*)?$') then
      raise exception 'Resource link must be an HTTP or HTTPS URL of at most 2048 characters' using errcode='22023';
    end if;
    if char_length(coalesce(new.file_name,''))>255 or char_length(coalesce(new.file_path,''))>1024
      or char_length(coalesce(new.file_type,''))>160 then
      raise exception 'Attachment metadata is too long' using errcode='22023';
    end if;
    if new.game_config is not null then
      if jsonb_typeof(new.game_config)<>'object' or octet_length(new.game_config::text)>131072 then
        raise exception 'Invalid game configuration' using errcode='22023';
      end if;
      foreach field in array array['timer','points'] loop
        if jsonb_typeof(new.game_config->field) is distinct from 'number' then
          raise exception 'Game timer and points must be numbers' using errcode='22023';
        end if;
        number_value=(new.game_config->>field)::numeric;
        if trunc(number_value)<>number_value
          or (field='timer' and number_value not between 0 and 300)
          or (field='points' and number_value not between 1 and 1000) then
          raise exception 'Invalid game timer or points' using errcode='22023';
        end if;
      end loop;
      if jsonb_typeof(new.game_config->'scenes') is distinct from 'array' then
        raise exception 'Game scenes must be an array' using errcode='22023';
      end if;
      if jsonb_array_length(new.game_config->'scenes') not between 1 and 32 then
        raise exception 'Games require 1–32 scenes' using errcode='22023';
      end if;
      for scene in select value from jsonb_array_elements(new.game_config->'scenes') loop
        if jsonb_typeof(scene)<>'object' then raise exception 'Invalid scene' using errcode='22023'; end if;
        foreach field in array array['narrative_en','narrative_fil','question_en','question_fil'] loop
          if jsonb_typeof(scene->field) is distinct from 'string' or char_length(scene->>field)>10000 then
            raise exception 'Invalid scene text' using errcode='22023';
          end if;
        end loop;
        if jsonb_typeof(scene->'choices') is distinct from 'array' then
          raise exception 'Choices must be an array' using errcode='22023';
        end if;
        if jsonb_array_length(scene->'choices') not between 2 and 4 then
          raise exception 'Scenes require 2–4 choices' using errcode='22023';
        end if;
        for choice in select value from jsonb_array_elements(scene->'choices') loop
          if jsonb_typeof(choice)<>'object' or coalesce(choice->>'outcome','') not in ('continue','success','fail') then
            raise exception 'Invalid choice outcome' using errcode='22023';
          end if;
          foreach field in array array['label_en','label_fil','feedback_en','feedback_fil'] loop
            if jsonb_typeof(choice->field) is distinct from 'string' or char_length(choice->>field)>10000 then
              raise exception 'Invalid choice text' using errcode='22023';
            end if;
          end loop;
        end loop;
      end loop;
    end if;
  end if;
  return new;
end $$;
revoke all on function public.validate_platform_input() from public,anon,authenticated;
drop trigger if exists profiles_validate_input on public.profiles;
create trigger profiles_validate_input before insert or update on public.profiles
for each row execute function public.validate_platform_input();
drop trigger if exists content_validate_input on public.content_items;
create trigger content_validate_input before insert or update on public.content_items
for each row execute function public.validate_platform_input();
drop trigger if exists attempts_validate_input on public.exam_attempts;
create trigger attempts_validate_input before insert or update on public.exam_attempts
for each row execute function public.validate_platform_input();
commit;
notify pgrst, 'reload schema';
