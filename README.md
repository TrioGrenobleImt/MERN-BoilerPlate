# MERN-APP BOILERPLATE README

Bienvenue dans le boilerplate MERN-APP, une solution complète pour démarrer rapidement avec une application full-stack moderne et sécurisée. Ce projet est conçu pour vous aider à créer des applications robustes avec une authentification sécurisée, une gestion des rôles, et bien plus encore.

## Table des matières

- [Backend](#backend)
- [Frontend](#frontend)
- [Tests unitaires](#tests-unitaires)
- [Fonctionnalités](#fonctionnalités)
- [Technologies utilisées](#technologies-utilisées)
- [Auteur](#auteur)

## Backend

Placez vous dans le répertoire server.
Vous devez d'abord créer un fichier **.env** contenant les variables d'environnements du backend.

Exemple ci-dessous:

```env
PORT=
MONG_URI=
MONG_URI_TEST=
SECRET_ACCESS_TOKEN=
```

PORT -> Quel est le port que votre serveur va utiliser.  
MONG_URI -> Adresse de connection à une base de données MongoDB (N'oubliez pas de mettre votre adresse IP dans **Network Access**).  
MONG_URI_TEST -> Adresse de connection à une base de données pour les tests unitaires (Il est possible d'utiliser la meme que celle de l'appli mais les données seront vidées pendant les tests, **très peu conseillé**).  
SECRET_ACCESS_TOKEN -> Token **secret** utilisé pour générer des tokens d'accès aux utilisateurs.

Ensuite, installez les **packages** requis pour faire tourner votre serveur

```shell
$ npm i
```

Lancez maintenant le serveur avec la commande ci-dessous

```shell
$ npm run dev
```

Une fois cela fait, vous devriez voir un message dans votre console affichant que le server et lancé et est connecté à la base de données.

## Frontend

Pour le Frontend, rien de plus simple, placez vous dans le dossier client et suivez la procédure ci dessous:

Créez un fichier **.env** contenant les variables d'environnements du frontend.

Exemple ci-dessous:

```env
VITE_API_URL=
```

VITE_API_URL -> Adresse de connection à votre serveur backend

Exemple: `http://localhost:5000/api`

**(Le `/api` est important pour que les requêtes soient bien dirigées vers le serveur)**

Installez les **packages** requis pour faire tourner votre client.

```shell
$ npm i
```

Lancez maintenant le frontend avec la commande suivante

```shell
$ npm run dev
```

Rendez vous sur l'URL écrite dans votre console.
Et voila vous possédez une application d'authentification sécurisée.

## Tests unitaires

Placez vous dans le répertoire server, vérifiez que votre serveur est éteint et lancez la commande suivante:

```shell
$ npm run test
```

Les tests unitaires devraient se lancer un par un.
Si vous souhaitez avoir le coverage totale lancez la commande suivante :

```shell
$ npm run coverage
```

Et votre coverage devrait se trouver dans le répertoire `coverage` du server.
N'oubliez pas de relancer votre backend apèrs utilisation.

## Fonctionnalités

- 📜 **Gestion des logs** : Suivi de l'utilisation de l'application pour une meilleure maintenance et analyse.
- 👥 **CRUD Utilisateurs** : Gérez les utilisateurs avec des opérations de création, lecture, mise à jour et suppression.
- 🔒 **Authentification sécurisée avec JWT** : Connexion et déconnexion sécurisées avec des tokens JWT pour protéger les données.
- 🏢 **Gestion des rôles** : Accès différencié selon les rôles des utilisateurs (Admin, User).
- ✅ **Tests unitaires** : Tests unitaires pour assurer la stabilité de l'application.
- 📝 **Backend commenté** : Tout le code backend est commenté pour une meilleure compréhension et maintenance.
- 🔗 **Axios pour les requêtes API** : Utilisation d'Axios pour des requêtes HTTP simplifiées et efficaces.
- 📊 **Dashboard Admin** : Interface dédiée pour la gestion des utilisateurs et le suivi des logs d'utilisation de l'application.
- 🔐 **Routes protégées** : Accès conditionnel à certaines pages en fonction des droits d'accès (Dashboard Admin, etc.).
- 🚧 **Routage conditionnel** : Bloquez certaines routes en fonction de l'état de connexion.
- 🌙 **Gestion du thème** : Possibilité de basculer entre les thèmes "light" et "dark" pour une expérience utilisateur personnalisée.
- 🌍 **Traduction avec I18n** : Support multilingue avec des fichiers de traduction JSON (`client/src/locales/**.json`).
- 🎨 **Interface moderne** : Utilisation de **TailwindCSS** et **ShadCN** pour un design réactif et élégant.
- 📋 **Formulaire de connexion** : Formulaire de connexion préconfiguré pour une intégration rapide.
- 🔄 **Configuration Prettier** : Formattage du code intégré avec Prettier pour un style cohérent.

## Technologies utilisées

- [MongoDB](https://www.mongodb.com/)
- [Express.js](https://expressjs.com/)
- [React.js](https://reactjs.org/)
- [Node.js](https://nodejs.org/en/)

## Auteur

- [Téo Villet](https://teovlt.github.io) - Développeur Web
