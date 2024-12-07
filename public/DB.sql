-- Create requests table
create table requests (
  id uuid default uuid_generate_v4() primary key,
  request_number text,
  requested_for text,
  access_start_date timestamp with time zone,
  access_end_date timestamp with time zone,
  short_description text,
  description text,
  work_notes text,
  state text,
  user_id uuid references auth.users(id),
  created_at timestamp with time zone default now(),
  file_url text
);

-- Create check_ins table
create table check_ins (
  id uuid default uuid_generate_v4() primary key,
  request_id uuid references requests(id),
  visitor_name text,
  visitor_id text,
  check_in_time timestamp with time zone default now(),
  checked_by uuid references auth.users(id)
);

-- Set up RLS (Row Level Security)
alter table requests enable row level security;
alter table check_ins enable row level security;

-- Create policies
create policy "Users can view their own requests"
  on requests for select
  using (auth.uid() = user_id);

create policy "Users can insert their own requests"
  on requests for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own requests"
  on requests for update
  using (auth.uid() = user_id);




-- Create users table
create table user_profiles (
  id uuid references auth.users primary key,
  email text,
  name text,
  role text check (role in ('admin', 'user', 'security')),
  department text,
  created_at timestamp with time zone default now(),
  last_login timestamp with time zone
);

-- RLS Policies for user_profiles
alter table user_profiles enable row level security;

-- Admins can view all profiles
create policy "Admins can view all profiles"
  on user_profiles for select
  using (
    exists (
      select 1 from user_profiles up 
      where up.id = auth.uid() and up.role = 'admin'
    )
  );

-- Users can view their own profile
create policy "Users can view own profile"
  on user_profiles for select
  using (auth.uid() = id);

-- Only admins can insert/update profiles
create policy "Admins can insert profiles"
  on user_profiles for insert
  with check (
    exists (
      select 1 from user_profiles up 
      where up.id = auth.uid() and up.role = 'admin'
    )
  );
