-- ══════════════════════════════════════════════
--  Renoï // City Barber — Schéma Supabase
-- ══════════════════════════════════════════════

-- Extensions
create extension if not exists "uuid-ossp";

-- ── Salons ────────────────────────────────────
create table salons (
  id          text primary key,  -- 'zad' | 'saaba'
  nom         text not null,
  adresse     text not null,
  quartier    text not null,
  telephone   text not null,
  whatsapp    text not null,
  horaires    text not null,
  actif       boolean default true,
  created_at  timestamptz default now()
);

-- ── Barbiers ──────────────────────────────────
create table barbiers (
  id          uuid primary key default uuid_generate_v4(),
  salon_id    text references salons(id) on delete cascade,
  prenom      text not null,
  nom         text not null,
  photo_url   text,
  specialites text[],
  actif       boolean default true,
  created_at  timestamptz default now()
);

-- ── Prestations ───────────────────────────────
create table prestations (
  id          uuid primary key default uuid_generate_v4(),
  nom         text not null,
  description text,
  categorie   text not null check (categorie in ('coupe','barbe','enfant','combo','soins')),
  prix_fcfa   integer not null,
  duree_min   integer not null,
  badge       text check (badge in ('populaire','nouveau','bestseller')),
  photo_url   text,
  actif       boolean default true,
  ordre       integer default 0,
  created_at  timestamptz default now()
);

-- ── Clients ───────────────────────────────────
create table clients (
  id                uuid primary key default uuid_generate_v4(),
  auth_user_id      uuid references auth.users(id) on delete set null,
  prenom            text not null,
  nom               text,
  telephone         text not null unique,
  email             text,
  points_fidelite   integer default 0,
  coupes_total      integer default 0,
  tampons_actuels   integer default 0,
  created_at        timestamptz default now()
);

-- ── Réservations ──────────────────────────────
create table reservations (
  id              uuid primary key default uuid_generate_v4(),
  client_id       uuid references clients(id) on delete cascade,
  salon_id        text references salons(id),
  barbier_id      uuid references barbiers(id) on delete set null,
  prestation_id   uuid references prestations(id),
  datetime_rdv    timestamptz not null,
  statut          text default 'confirme' check (statut in ('confirme','en_attente','annule','termine','no_show')),
  mode_paiement   text check (mode_paiement in ('orange_money','moov_money','carte','sur_place')),
  montant_fcfa    integer,
  paiement_statut text default 'en_attente' check (paiement_statut in ('en_attente','paye','rembourse')),
  notes_client    text,
  created_at      timestamptz default now()
);

-- ── Liste d'attente ───────────────────────────
create table liste_attente (
  id            uuid primary key default uuid_generate_v4(),
  client_id     uuid references clients(id) on delete cascade,
  salon_id      text references salons(id),
  prestation_id uuid references prestations(id),
  date_souhaitee date not null,
  notifie       boolean default false,
  created_at    timestamptz default now()
);

-- ── Notes barbier sur client ───────────────────
create table notes_client (
  id          uuid primary key default uuid_generate_v4(),
  client_id   uuid references clients(id) on delete cascade,
  barbier_id  uuid references barbiers(id) on delete set null,
  contenu     text not null,
  created_at  timestamptz default now()
);

-- ── Avis clients ──────────────────────────────
create table avis (
  id              uuid primary key default uuid_generate_v4(),
  client_id       uuid references clients(id) on delete cascade,
  reservation_id  uuid references reservations(id) on delete cascade unique,
  note            integer not null check (note between 1 and 5),
  commentaire     text,
  visible         boolean default true,
  created_at      timestamptz default now()
);

-- ── Dépenses ──────────────────────────────────
create table depenses (
  id          uuid primary key default uuid_generate_v4(),
  salon_id    text references salons(id),
  categorie   text not null check (categorie in ('produits','loyer','salaires','materiel','divers')),
  montant_fcfa integer not null,
  description text,
  date_depense date not null,
  created_at  timestamptz default now()
);

-- ── Cartes cadeaux ────────────────────────────
create table cartes_cadeaux (
  id              uuid primary key default uuid_generate_v4(),
  code            text not null unique,
  montant_fcfa    integer not null,
  acheteur_id     uuid references clients(id) on delete set null,
  beneficiaire    text,
  utilise         boolean default false,
  utilise_par     uuid references clients(id) on delete set null,
  utilise_le      timestamptz,
  expire_le       date,
  created_at      timestamptz default now()
);

-- ── Promotions ────────────────────────────────
create table promotions (
  id          uuid primary key default uuid_generate_v4(),
  code        text unique,
  titre       text not null,
  type        text not null check (type in ('pourcentage','montant_fixe')),
  valeur      integer not null,
  date_debut  date not null,
  date_fin    date not null,
  usage_max   integer,
  usage_count integer default 0,
  actif       boolean default true,
  created_at  timestamptz default now()
);

-- ── Données initiales ─────────────────────────
insert into salons (id, nom, adresse, quartier, telephone, whatsapp, horaires) values
  ('zad',   'Renoï ZAD',   'En face du Black Diamond & station ACCESS OIL', 'ZAD, Ouagadougou',   '+226 67 91 22 22', '+22667912222', '7j/7 · 9h00 – 21h00'),
  ('saaba', 'Renoï SAABA', 'Route USTA, en face de la station SHELL',        'SAABA, Ouagadougou', '+226 07 95 24 34', '+22607952434', '7j/7 · 9h00 – 21h00');

-- ── Row Level Security ────────────────────────
alter table clients       enable row level security;
alter table reservations  enable row level security;
alter table avis          enable row level security;
alter table notes_client  enable row level security;
alter table cartes_cadeaux enable row level security;

-- Clients : lecture/modif de son propre profil uniquement
create policy "client_own" on clients
  for all using (auth.uid() = auth_user_id);

-- Réservations : client voit les siennes
create policy "reservations_own" on reservations
  for all using (
    client_id = (select id from clients where auth_user_id = auth.uid())
  );

-- Avis : client voit les siens et les avis visibles
create policy "avis_visible" on avis
  for select using (visible = true);

create policy "avis_own" on avis
  for all using (
    client_id = (select id from clients where auth_user_id = auth.uid())
  );
