
-- 1. Create a function to automatically create a profile for new users
create or replace function public.handle_new_user_profile()
returns trigger as $$
begin
  -- Only insert if profile does not exist
  if not exists (select 1 from public.profiles where id = new.id) then
    insert into public.profiles (id, name, email, user_type, profile_image_url, is_verified)
    values (
      new.id,
      coalesce(new.raw_user_meta_data->>'name', ''),
      coalesce(new.email, ''),
      coalesce(new.raw_user_meta_data->>'user_type', 'customer'),  -- fallback to 'customer'
      coalesce(new.raw_user_meta_data->>'profile_image_url', ''),
      false
    );
  end if;
  return new;
end;
$$ language plpgsql security definer;

-- 2. Add trigger on auth.users for after insert
drop trigger if exists handle_new_user_profile on auth.users;
create trigger handle_new_user_profile
  after insert on auth.users
  for each row
  execute procedure public.handle_new_user_profile();
