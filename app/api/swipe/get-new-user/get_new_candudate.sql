-- อัปเกรด Function ให้รับ parameter 'buffer_ids'
create or replace function get_new_candidates(
  viewer_id uuid,
  limit_count int,
  buffer_ids uuid[] DEFAULT '{}' -- รับ array ของ uuid ที่ Client ถืออยู่ (Default คือ array ว่าง)
)
returns setof user_detail
language sql
security definer
as $$
  select *
  from user_detail
  where id != viewer_id
  -- 1. กรองคนที่มีอยู่ในมือ Client ออก (Buffer Zone)
  and not (id = any(buffer_ids))
  -- 2. กรองคนที่เคย Interact ใน DB ออก (History) จากตาราง card_swipe 
  and not exists (
    select 1
    from card_swipe
    where card_swipes.owner_id = viewer_id
    and card_swipes.target_id = users.id
  )
  order by random()
  limit limit_count;
$$;