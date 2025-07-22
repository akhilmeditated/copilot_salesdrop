# SalesDrops Admin

Admin panel built with React + Supabase for managing SalesDrops tools, drops, sponsors, and makers.

## Setup

1. **Clone the repo:**  
   `git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git`

2. **Install dependencies:**  
   `npm install`

3. **Configure Supabase:**  
   - Go to `src/lib/supabase.ts`
   - Replace `YOUR_SUPABASE_URL` and `YOUR_SUPABASE_ANON_KEY` with your Supabase project credentials.

4. **Supabase Tables Required:**  
   You should have the following tables in your Supabase project:
   - `tools`
   - `drops`
   - `sponsors`
   - `makers`

   Each table should have reasonable columns (see below for suggestions).

## Table Structure Suggestions

### tools
- id (uuid, primary key)
- drop_id (uuid, foreign key to drops)
- name (text)
- description (text)
- category (text)
- logo_text (text)
- image_url (text, optional)
- maker_name (text)
- maker_company (text)
- website_url (text)
- is_premium (boolean)
- order_index (integer)
- notes (text, optional)
- created_at (timestamp)

### drops
- id (uuid, primary key)
- title (text)
- description (text)
- is_active (boolean)
- week_date (date)
- created_at (timestamp)

### sponsors
- id (uuid, primary key)
- name (text)
- logo_url (text)
- url (text)
- description (text)
- is_active (boolean)
- created_at (timestamp)

### makers
- id (uuid, primary key)
- name (text)
- company (text)
- bio (text)
- website_url (text)
- is_active (boolean)
- created_at (timestamp)

## Running the App

```bash
npm start
```

## License

MIT
