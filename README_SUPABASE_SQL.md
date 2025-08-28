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
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', '')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger pour créer automatiquement un profil
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();
```

## Instructions d'exécution

1. Aller dans le dashboard Supabase de votre projet
2. Aller dans l'onglet "SQL Editor"
3. Exécuter chaque bloc SQL dans l'ordre
4. Vérifier que les tables et politiques sont créées dans l'onglet "Table Editor"

