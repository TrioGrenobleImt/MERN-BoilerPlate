# MERN-APP BOILERPLATE README

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
NEXT_PUBLIC_API_URL=
```

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

Placez vous dans le répertoire server et lancez la commande suivante:

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

- **CRUD Utilisateurs** : Créez, lisez, mettez à jour et supprimez des utilisateurs.
- **Authentification sécurisée avec JWT** : Connexion et déconnexion avec JWT pour garantir la sécurité des données.
- **Gestion des rôles** : Accès différencié aux utilisateurs selon leur rôle (Admin, User).
- **Routes protégées** : Accès conditionnel à certaines pages selon les droits d'accès (Dashboard Admin, etc.).
- **Routage conditionnel** : Possibilité de bloquer certaines routes selon l'état de connexion.
- **Traduction avec I18n** : Support multilingue avec des fichiers de traduction JSON (`client/src/locales/**.json`).
- **Interface moderne** : Utilisation de **ShadCN** et **TailwindCSS** pour un design réactif et élégant.
- **Tests unitaires** : Tests unitaires mis en place pour assurer la stabilité de l'application.

## Technologies utilisées

- [MongoDB](https://www.mongodb.com/)
- [Express.js](https://expressjs.com/)
- [React.js](https://reactjs.org/)
- [Node.js](https://nodejs.org/en/)

## Auteur

- [Téo Villet](https://teovlt.github.io) - Développeur Web
