# Configuration SQL pour Supabase

## 1. Créer la table `profiles`

```sql
-- Créer la table profiles
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT,
    last_seen_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activer RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre aux utilisateurs de voir leur propre profil
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

-- Politique pour permettre aux utilisateurs de mettre à jour leur propre profil
CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Politique pour permettre l'insertion automatique lors de l'inscription
CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);
```

## 2. Créer la table `page_views`

```sql
-- Créer la table page_views
CREATE TABLE IF NOT EXISTS public.page_views (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    path TEXT NOT NULL,
    user_agent TEXT,
    referrer TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activer RLS
ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre aux utilisateurs de voir leurs propres page views
CREATE POLICY "Users can view own page views" ON public.page_views
    FOR SELECT USING (auth.uid() = user_id);

-- Politique pour permettre l'insertion de page views
CREATE POLICY "Users can insert page views" ON public.page_views
    FOR INSERT WITH CHECK (auth.uid() = user_id);
```

## 3. Créer les triggers

```sql
-- Fonction pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour profiles
CREATE TRIGGER set_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();

-- Fonction pour mettre à jour last_seen_at
CREATE OR REPLACE FUNCTION public.bump_last_seen()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.profiles 
    SET last_seen_at = NOW() 
    WHERE id = NEW.user_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour page_views
CREATE TRIGGER bump_user_last_seen
    AFTER INSERT ON public.page_views
    FOR EACH ROW
    EXECUTE FUNCTION public.bump_last_seen();
```

## 4. Fonction pour créer automatiquement un profil lors de l'inscription

```sql
-- Fonction pour créer automatiquement un profil
-- ⚠️ MISE À JOUR : inclut maintenant la colonne role
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, role)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        'user'::user_role
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger pour créer automatiquement un profil
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();
```

## 5. Système de rôles admin

```sql
-- Supprimer les policies qui dépendent de la colonne role
DROP POLICY IF EXISTS "users_update_own_profile_except_role" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- Supprimer l'ancienne contrainte si elle existe
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'profiles_role_check' 
        AND table_name = 'profiles'
    ) THEN
        ALTER TABLE public.profiles DROP CONSTRAINT profiles_role_check;
    END IF;
END $$;

-- Supprimer l'ancienne colonne role si elle existe (pour repartir à zéro)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' 
        AND column_name = 'role'
    ) THEN
        ALTER TABLE public.profiles DROP COLUMN role CASCADE;
    END IF;
END $$;

-- Créer un type enum pour les rôles
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('user', 'admin', 'super_admin');
    END IF;
END $$;

-- Ajouter la colonne role avec le type enum
ALTER TABLE public.profiles 
ADD COLUMN role user_role DEFAULT 'user'::user_role NOT NULL;

-- Fonction pour vérifier si un utilisateur est admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = user_id 
        AND role IN ('admin', 'super_admin')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Note: Les policies de base (voir/insérer/modifier son propre profil) 
-- ont déjà été créées dans le bloc #1
-- On ne les recrée pas ici pour éviter les conflits
```

## 6. Table pour contenu mensuel de la homepage

```sql
-- Créer la table monthly_content
CREATE TABLE IF NOT EXISTS public.monthly_content (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
    year INTEGER NOT NULL CHECK (year >= 2026),
    actu_flash_title TEXT,
    actu_flash_description TEXT,
    success_items JSONB DEFAULT '[]'::jsonb,
    digital_info_title TEXT,
    digital_info_description TEXT,
    digital_info_tags JSONB DEFAULT '[]'::jsonb,
    new_clients JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    UNIQUE(month, year)
);

-- Activer RLS
ALTER TABLE public.monthly_content ENABLE ROW LEVEL SECURITY;

-- Politique: Tout le monde peut lire
CREATE POLICY "Anyone can view monthly content" ON public.monthly_content
    FOR SELECT USING (true);

-- Politique: Seuls les admins peuvent insérer
CREATE POLICY "Admins can insert monthly content" ON public.monthly_content
    FOR INSERT WITH CHECK (public.is_admin(auth.uid()));

-- Politique: Seuls les admins peuvent mettre à jour
CREATE POLICY "Admins can update monthly content" ON public.monthly_content
    FOR UPDATE USING (public.is_admin(auth.uid()));

-- Politique: Seuls les admins peuvent supprimer
CREATE POLICY "Admins can delete monthly content" ON public.monthly_content
    FOR DELETE USING (public.is_admin(auth.uid()));

-- Trigger pour updated_at
CREATE TRIGGER set_monthly_content_updated_at
    BEFORE UPDATE ON public.monthly_content
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();
```

## 7. Donner le rôle admin à un utilisateur

```sql
-- Pour donner le rôle admin à un utilisateur spécifique
-- Remplacer 'email@example.com' par l'email de l'utilisateur
UPDATE public.profiles 
SET role = 'admin'::user_role
WHERE id = (
    SELECT id FROM auth.users 
    WHERE email = 'email@example.com'
);

-- Exemple pour plusieurs utilisateurs à la fois
UPDATE public.profiles 
SET role = 'admin'::user_role
WHERE id IN (
    SELECT id FROM auth.users 
    WHERE email IN ('admin1@example.com', 'admin2@example.com')
);

-- Pour voir tous les admins actuels
SELECT p.id, u.email, p.full_name, p.role 
FROM public.profiles p
JOIN auth.users u ON u.id = p.id
WHERE p.role IN ('admin'::user_role, 'super_admin'::user_role);
```

## 8. 🚨 DÉBLOCAGE COMPLET - Retour à l'état stable

```sql
-- ⚠️ EXÉCUTE CE SCRIPT MAINTENANT POUR DÉBLOQUER LA CONNEXION
-- On supprime temporairement tout ce qui touche au système de rôles

-- 1. Supprimer les policies de monthly_content (qui dépendent de is_admin)
DROP POLICY IF EXISTS "Anyone can view monthly content" ON public.monthly_content;
DROP POLICY IF EXISTS "Admins can insert monthly content" ON public.monthly_content;
DROP POLICY IF EXISTS "Admins can update monthly content" ON public.monthly_content;
DROP POLICY IF EXISTS "Admins can delete monthly content" ON public.monthly_content;

-- 2. Désactiver RLS sur monthly_content (pour permettre les modifications temporaires)
ALTER TABLE public.monthly_content DISABLE ROW LEVEL SECURITY;

-- 3. Supprimer la fonction is_admin (maintenant qu'elle n'a plus de dépendances)
DROP FUNCTION IF EXISTS public.is_admin(UUID) CASCADE;

-- 4. Supprimer TOUTES les policies de profiles
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "users_update_own_profile_except_role" ON public.profiles;

-- 5. Supprimer la colonne role (temporairement)
ALTER TABLE public.profiles DROP COLUMN IF EXISTS role CASCADE;

-- 6. Supprimer le type enum
DROP TYPE IF EXISTS user_role CASCADE;

-- 7. Désactiver RLS sur profiles temporairement
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- ✅ Maintenant tu devrais pouvoir te connecter normalement
-- Une fois connecté, on réactivera RLS avec les policies de base
```

## 9. Script de réactivation RLS (une fois la connexion OK)

```sql
-- Une fois que tu arrives à te connecter, exécute ce script pour réactiver la sécurité

-- Supprimer TOUTES les anciennes policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "users_update_own_profile_except_role" ON public.profiles;

-- Réactiver RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Recréer les policies de base (simples et sûres)
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);
```

## Instructions d'exécution

1. Aller dans le dashboard Supabase de votre projet
2. Aller dans l'onglet "SQL Editor"
3. **Si tu es bloqué** : Exécuter d'abord le bloc #8 (script de déblocage)
4. Sinon : Exécuter chaque bloc SQL dans l'ordre (1 → 7)
5. Vérifier que les tables et politiques sont créées dans l'onglet "Table Editor"
6. Utiliser le bloc 7 pour définir les administrateurs

