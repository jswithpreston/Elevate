-- Create tables for Elevate App

-- 1. Profiles Table
create table public.profiles (
  id uuid references auth.users not null primary key,
  full_name text,
  avatar_url text,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);
-- Enable RLS
alter table public.profiles enable row level security;
-- Create Policies
create policy "Public profiles are viewable by everyone." on profiles for select using (true);
create policy "Users can insert their own profile." on profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile." on profiles for update using (auth.uid() = id);

-- Trigger for new user to create profile automatically
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 2. Tasks Table
create table public.tasks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  title text not null,
  completed boolean default false,
  start_date date,
  deadline date,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.tasks enable row level security;
create policy "Users can view own tasks" on tasks for select using (auth.uid() = user_id);
create policy "Users can insert own tasks" on tasks for insert with check (auth.uid() = user_id);
create policy "Users can update own tasks" on tasks for update using (auth.uid() = user_id);
create policy "Users can delete own tasks" on tasks for delete using (auth.uid() = user_id);

-- 3. Habits Table
create table public.habits (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  title text not null,
  streak integer default 0,
  start_date date,
  last_completed_date date,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.habits enable row level security;
create policy "Users can view own habits" on habits for select using (auth.uid() = user_id);
create policy "Users can insert own habits" on habits for insert with check (auth.uid() = user_id);
create policy "Users can update own habits" on habits for update using (auth.uid() = user_id);
create policy "Users can delete own habits" on habits for delete using (auth.uid() = user_id);

-- 4. Goals Table
create table public.goals (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  title text not null,
  description text,
  category text,
  priority text default 'medium' check (priority in ('low', 'medium', 'high')),
  progress integer default 0,
  start_date date,
  target_date date,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.goals enable row level security;
create policy "Users can view own goals" on goals for select using (auth.uid() = user_id);
create policy "Users can insert own goals" on goals for insert with check (auth.uid() = user_id);
create policy "Users can update own goals" on goals for update using (auth.uid() = user_id);
create policy "Users can delete own goals" on goals for delete using (auth.uid() = user_id);

-- Setup Realtime
alter publication supabase_realtime add table tasks;
alter publication supabase_realtime add table habits;
alter publication supabase_realtime add table goals;

----------------------------------------------------------
-- MIGRATION: Add new columns to existing tables
-- Run these ALTER statements if tables already exist
----------------------------------------------------------

-- Add columns to tasks table (if not exist)
DO $$ BEGIN
  ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS start_date date;
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS deadline date;
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

-- Add columns to habits table (if not exist)
DO $$ BEGIN
  ALTER TABLE public.habits ADD COLUMN IF NOT EXISTS start_date date;
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

-- Add columns to goals table (if not exist)
DO $$ BEGIN
  ALTER TABLE public.goals ADD COLUMN IF NOT EXISTS description text;
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public.goals ADD COLUMN IF NOT EXISTS category text;
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public.goals ADD COLUMN IF NOT EXISTS priority text default 'medium' CHECK (priority IN ('low', 'medium', 'high'));
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public.goals ADD COLUMN IF NOT EXISTS start_date date;
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

-- Add avatar_url to profiles (if not exist)
DO $$ BEGIN
  ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url text;
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;
-- 5. Notifications Table
create table public.notifications (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  type text not null,
  title text not null,
  message text not null,
  read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.notifications enable row level security;
create policy "Users can view own notifications" on notifications for select using (auth.uid() = user_id);
create policy "Users can insert own notifications" on notifications for insert with check (auth.uid() = user_id);
create policy "Users can update own notifications" on notifications for update using (auth.uid() = user_id);
create policy "Users can delete own notifications" on notifications for delete using (auth.uid() = user_id);

