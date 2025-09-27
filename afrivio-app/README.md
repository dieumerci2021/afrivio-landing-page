# Afrivio - Prototype d'Application Web

![Afrivio](https://user-images.githubusercontent.com/12345/67890.png) <!-- Placeholder : Remplacer par un vrai logo/screenshot -->

Afrivio est une application web dédiée au tourisme, aux loisirs et aux expériences locales en Afrique. Ce prototype a été développé pour valider les fonctionnalités clés du projet, de la gestion des utilisateurs à l'intégration de modules d'IA.

## 🎯 Objectif du Prototype

Ce projet constitue un prototype fonctionnel prêt à être testé, comprenant :
-   Une UI/UX moderne et fluide.
-   Un backend fonctionnel avec Supabase.
-   La gestion des comptes utilisateurs et des réservations.
-   Un système de paiement temporaire (simulation).
-   Des modules d'IA (chatbot et modération de contenu).

---

## ⚙️ Technologies Utilisées

-   **Front-end** : [Next.js](https://nextjs.org/) / [React](https://reactjs.org/)
-   **Langage** : [TypeScript](https://www.typescriptlang.org/)
-   **Styling** : [TailwindCSS](https://tailwindcss.com/)
-   **Backend & Base de Données** : [Supabase](https://supabase.io/) (PostgreSQL, Auth, Edge Functions)
-   **Déploiement (suggéré)** : [Vercel](https://vercel.com/) pour le front-end, Supabase pour le backend.

---

## 🚀 Guide d'Installation et de Lancement

Suivez ces étapes pour lancer le projet sur votre machine locale.

### 1. Prérequis

-   [Node.js](https://nodejs.org/) (version 18 ou supérieure)
-   `npm` (généralement inclus avec Node.js)
-   Un compte [Supabase](https://supabase.com/dashboard) pour créer votre projet backend.

### 2. Cloner le Projet

```bash
git clone <URL_DU_REPOSITORY>
cd afrivio-app
```

### 3. Installer les Dépendances

```bash
npm install
```

### 4. Configurer Supabase

1.  **Créer un projet Supabase** :
    -   Allez sur votre [tableau de bord Supabase](https://supabase.com/dashboard) et créez un nouveau projet.
    -   Notez bien votre mot de passe de base de données.

2.  **Initialiser la Base de Données** :
    -   Dans votre projet Supabase, allez dans `SQL Editor`.
    -   Cliquez sur `+ New query`.
    -   Copiez l'intégralité du contenu du fichier `schema.sql` (présent à la racine de ce projet) et collez-le dans l'éditeur.
    -   Cliquez sur `RUN`. Les tables (`profiles`, `offers`, `bookings`) et les politiques de sécurité seront créées.

3.  **Récupérer les Clés d'API** :
    -   Allez dans `Project Settings` > `API`.
    -   Copiez l'**URL du projet** (`Project URL`).
    -   Copiez la clé **anon (public)** (`Project API Keys`).

### 5. Configurer les Variables d'Environnement

1.  À la racine du projet `afrivio-app`, créez un fichier `.env.local` en copiant le modèle `.env.local.example`.

2.  Remplissez le fichier `.env.local` avec les informations de votre projet Supabase :

    ```
    NEXT_PUBLIC_SUPABASE_URL="VOTRE_URL_SUPABASE"
    NEXT_PUBLIC_SUPABASE_ANON_KEY="VOTRE_CLÉ_ANON_SUPABASE"
    ```

### 6. Lancer l'Application

Vous êtes prêt ! Lancez le serveur de développement :

```bash
npm run dev
```

Ouvrez votre navigateur à l'adresse [http://localhost:3000](http://localhost:3000) pour voir l'application.

---

## 🤖 Configuration des Fonctionnalités d'IA

### Modération de Contenu (Edge Function)

Pour activer la modération automatique des offres, vous devez déployer la fonction Supabase.

1.  **Installer la CLI Supabase** (si ce n'est pas déjà fait) :
    ```bash
    npm install supabase --save-dev
    ```

2.  **Lier votre projet local à Supabase** :
    ```bash
    npx supabase login
    npx supabase link --project-ref VOTRE_ID_PROJET
    ```
    *(`VOTRE_ID_PROJET` se trouve dans l'URL de votre tableau de bord Supabase)*

3.  **Déployer la fonction** :
    ```bash
    npx supabase functions deploy moderate-offer --no-verify-jwt
    ```

4.  **Configurer les secrets de la fonction** :
    -   Dans votre tableau de bord Supabase, allez dans `Edge Functions` > `moderate-offer` > `Secrets`.
    -   Ajoutez `SUPABASE_URL` (l'URL de votre projet Supabase).
    -   Ajoutez `SUPABASE_SERVICE_ROLE_KEY` (la clé `service_role` de votre projet, trouvable dans `Project Settings` > `API`).

5.  **Créer le déclencheur (Webhook)** :
    -   Allez dans `Database` > `Triggers`.
    -   Créez un nouveau webhook :
        -   **Nom** : `trigger_offer_moderation`
        -   **Table** : `offers`
        -   **Événement** : `Insert`
        -   **HTTP Request** : Sélectionnez votre fonction `moderate-offer`.
    -   Sauvegardez. Désormais, chaque nouvelle offre sera automatiquement modérée.

---

## ✨ Prochaines Étapes Suggérées

-   Implémenter un système de paiement réel (Stripe, PayPal).
-   Développer l'interface d'administration pour gérer les utilisateurs et les offres.
-   Connecter le chatbot à un service d'IA (comme GPT-4).
-   Ajouter des tests unitaires et d'intégration.