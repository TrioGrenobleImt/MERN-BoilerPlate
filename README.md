# Auth-app README

## Backend

Placez vous dans le répertoire server.
Vous devez d'abord créer un fichier **.env** contenant les variables d'environnements du backend.

Exemple ci-dessous:

```env
PORT=
MONG_URI=
SECRET_ACCESS_TOKEN=
```

PORT -> Quel est le port que votre serveur va utiliser.  
MONG_URI -> Adresse de connection à une base de données MongoDB (N'oubliez pas de mettre votre adresse IP dans **Network Access**).  
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
