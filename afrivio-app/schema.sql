-- #############################################################################
-- # 1. Table des Profils Utilisateurs
-- #    Cette table stocke les données publiques des utilisateurs.
-- #    Elle est liée à la table `auth.users` de Supabase.
-- #############################################################################

-- Création d'un type ENUM pour les plans d'abonnement
CREATE TYPE public.subscription_plan_enum AS ENUM ('free', 'basic', 'premium');
-- Création d'un type ENUM pour les rôles utilisateurs
CREATE TYPE public.user_role_enum AS ENUM ('user', 'admin');

-- Création de la table des profils
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  updated_at TIMESTAMPTZ,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  subscription_plan public.subscription_plan_enum DEFAULT 'free'::public.subscription_plan_enum,
  role public.user_role_enum DEFAULT 'user'::public.user_role_enum,

  CONSTRAINT username_length CHECK (char_length(username) >= 3)
);

-- Politique de sécurité pour la table des profils
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Les utilisateurs peuvent voir tous les profils
CREATE POLICY "Public profiles are viewable by everyone."
  ON public.profiles FOR SELECT
  USING ( true );

-- Les utilisateurs ne peuvent insérer que leur propre profil
CREATE POLICY "Users can insert their own profile."
  ON public.profiles FOR INSERT
  WITH CHECK ( auth.uid() = id );

-- Les utilisateurs ne peuvent mettre à jour que leur propre profil
CREATE POLICY "Users can update own profile."
  ON public.profiles FOR UPDATE
  USING ( auth.uid() = id );


-- #############################################################################
-- # 2. Table des Offres
-- #    Cette table stocke toutes les offres (hôtels, activités, etc.).
-- #############################################################################

-- Création de la table des offres
CREATE TABLE public.offers (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  title TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL,
  location TEXT,
  type TEXT, -- ex: 'hotel', 'restaurant', 'event'
  is_available BOOLEAN DEFAULT TRUE,
  moderation_status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  -- L'ID de l'entreprise ou de l'utilisateur qui a posté l'offre
  author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE
);

-- Politique de sécurité pour la table des offres
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;

-- Tout le monde peut voir les offres
CREATE POLICY "Offers are viewable by everyone."
  ON public.offers FOR SELECT
  USING ( true );

-- Seuls les utilisateurs authentifiés peuvent créer des offres
CREATE POLICY "Authenticated users can create offers."
  ON public.offers FOR INSERT
  WITH CHECK ( auth.role() = 'authenticated' );

-- Seul l'auteur peut mettre à jour son offre
CREATE POLICY "Owners can update their own offers."
  ON public.offers FOR UPDATE
  USING ( auth.uid() = author_id );

-- Seul l'auteur peut supprimer son offre
CREATE POLICY "Owners can delete their own offers."
  ON public.offers FOR DELETE
  USING ( auth.uid() = author_id );


-- #############################################################################
-- # 3. Table des Réservations
-- #    Cette table stocke les réservations faites par les utilisateurs.
-- #############################################################################

-- Création de la table des réservations
CREATE TABLE public.bookings (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  offer_id BIGINT REFERENCES public.offers(id) ON DELETE CASCADE,
  booking_date TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'pending' -- ex: 'pending', 'confirmed', 'cancelled'
);

-- Politique de sécurité pour la table des réservations
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Les utilisateurs ne peuvent voir que leurs propres réservations
CREATE POLICY "Users can view their own bookings."
  ON public.bookings FOR SELECT
  USING ( auth.uid() = user_id );

-- Les utilisateurs ne peuvent créer que des réservations pour eux-mêmes
CREATE POLICY "Users can create bookings for themselves."
  ON public.bookings FOR INSERT
  WITH CHECK ( auth.uid() = user_id );

-- Les utilisateurs ne peuvent mettre à jour que leurs propres réservations (ex: annuler)
CREATE POLICY "Users can update their own bookings."
  ON public.bookings FOR UPDATE
  USING ( auth.uid() = user_id );