# Guide de Configuration et Migration Supabase

## 📋 Vue d'ensemble

Ce guide vous aide à configurer votre base de données Supabase et à migrer depuis le stockage local vers Supabase.

## 🚀 Étapes de Configuration

### 1. Créer un Projet Supabase

1. Allez sur [supabase.com](https://supabase.com)
2. Créez un compte ou connectez-vous
3. Créez un nouveau projet
4. Notez votre **API URL** et votre **anon/public key**

### 2. Exécuter le Schéma SQL

1. Dans le dashboard Supabase, allez dans **SQL Editor**
2. Créez une nouvelle requête
3. Copiez le contenu complet du fichier `supabase-schema.sql`
4. Exécutez la requête
5. Vérifiez que toutes les tables ont été créées dans **Table Editor**

### 3. Configuration des Variables d'Environnement

Créez ou mettez à jour votre fichier `.env` :

```env
EXPO_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=votre-anon-key
```

### 4. Installation des Dépendances

```bash
bun add @supabase/supabase-js
```

## 📊 Structure de la Base de Données

### Tables Principales

1. **users** - Utilisateurs et GPs
   - Gère les profils utilisateurs
   - Champ `is_gp` pour distinguer les Grands Porteurs
   - Mot de passe inclus pour l'authentification

2. **gp_subscriptions** - Abonnements GP
   - Lié à la table users
   - Gère les périodes d'abonnement actives

3. **travel_announcements** - Annonces de Voyage
   - Publiées par les GPs
   - Champ `is_active` pour gérer la visibilité
   - Ne sont supprimées que manuellement par le GP

4. **request_announcements** - Demandes d'Envoi
   - Publiées par les utilisateurs
   - Visibles par tous les GPs

5. **shipments** - Envois/Colis
   - Lien entre demande, utilisateur et GP
   - Suivi du statut en temps réel

6. **tracking_history** - Historique de Suivi
   - Permet aux GPs de mettre à jour le statut des colis
   - Historique complet visible par les utilisateurs

7. **conversations** & **messages** - Messagerie
   - Communication entre utilisateurs et GPs

8. **app_statistics** - Statistiques Marketing
   - Données agrégées pour le marketing
   - Mise à jour automatique quotidienne

## 🔐 Sécurité (Row Level Security)

La base de données utilise RLS (Row Level Security) avec les règles suivantes :

### Users
- ✅ Lecture : Tous
- ✅ Création : Tous
- ✅ Modification : Soi-même uniquement

### Travel Announcements
- ✅ Lecture : Tous (annonces actives uniquement)
- ✅ Création/Modification/Suppression : GP propriétaire uniquement

### Request Announcements
- ✅ Lecture : Tous
- ✅ Création : Tous
- ✅ Suppression : Utilisateur propriétaire uniquement

### Shipments
- ✅ Lecture : Utilisateur concerné ou GP concerné
- ✅ Création/Modification : GP assigné uniquement

### Messages
- ✅ Lecture/Écriture : Participants de la conversation uniquement

## 📝 Fonctionnalités Implémentées

### ✅ Fonctionnalités Demandées

1. **Authentification avec Mot de Passe** ✅
   - Champ `password` dans la table users
   - Validation lors de la connexion

2. **Statistiques Marketing** ✅
   - Table `app_statistics` avec fonction de mise à jour automatique
   - Métriques : utilisateurs totaux, GPs actifs, envois, livraisons réussies

3. **Filtrage des Voyages pour GPs** ✅
   - Structure de table permettant le filtrage par pays, date, etc.

4. **Suivi des Colis en Temps Réel** ✅
   - Table `tracking_history` pour l'historique complet
   - GPs peuvent mettre à jour à chaque étape
   - Utilisateurs peuvent suivre en temps réel

5. **Persistance des Annonces de Voyage** ✅
   - Champ `is_active` pour gérer la visibilité
   - Suppression manuelle uniquement

6. **Envois Réels (pas d'exemples)** ✅
   - Structure de données réelle
   - Pas de données fictives par défaut

## 🔄 Migration des Données Existantes

Si vous avez des données dans votre stockage local (fichiers JSON), voici comment les migrer :

### Script de Migration (à créer)

```typescript
// scripts/migrate-to-supabase.ts
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!
);

async function migrateUsers() {
  const data = JSON.parse(fs.readFileSync('data/users.json', 'utf-8'));
  const users = Object.values(data);
  
  for (const user of users) {
    const { error } = await supabase.from('users').insert({
      id: user.id,
      first_name: user.firstName,
      last_name: user.lastName,
      country: user.country,
      contact: user.contact,
      password: user.password,
      is_verified: user.isVerified,
      is_gp: user.isGP,
      created_at: user.createdAt,
    });
    
    if (error) console.error('Erreur migration user:', error);
  }
}

// Répétez pour chaque table...
```

## 🎯 Prochaines Étapes

1. ✅ Créer le projet Supabase
2. ✅ Exécuter le schéma SQL
3. ⬜ Installer `@supabase/supabase-js`
4. ⬜ Mettre à jour les fichiers backend pour utiliser Supabase au lieu du stockage local
5. ⬜ Migrer les données existantes (si nécessaire)
6. ⬜ Tester toutes les fonctionnalités

## 📚 Requêtes SQL Utiles

### Obtenir les statistiques actuelles
```sql
SELECT * FROM app_statistics 
ORDER BY date DESC 
LIMIT 1;
```

### Mettre à jour les statistiques
```sql
SELECT update_app_statistics();
```

### Voir tous les GPs actifs
```sql
SELECT u.*, gs.* 
FROM users u
JOIN gp_subscriptions gs ON u.id = gs.user_id
WHERE gs.is_active = true 
AND gs.end_date > NOW();
```

### Voir les envois en cours
```sql
SELECT * FROM shipment_details
WHERE status NOT IN ('delivered', 'cancelled')
ORDER BY created_at DESC;
```

## 🆘 Support

Pour toute question sur la configuration Supabase :
- Documentation : https://supabase.com/docs
- Dashboard : https://app.supabase.com

## 📋 Checklist de Vérification

Après la migration, vérifiez que :

- [ ] Toutes les tables sont créées
- [ ] Les index sont en place
- [ ] Les politiques RLS fonctionnent
- [ ] Les triggers sont actifs
- [ ] Les vues sont accessibles
- [ ] Les fonctions s'exécutent correctement
- [ ] Les données sont migrées (si applicable)
- [ ] L'application se connecte correctement
- [ ] Les opérations CRUD fonctionnent
- [ ] Les statistiques se mettent à jour
