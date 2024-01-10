# B1-Vision 

## Description

Ce service permet aux utilisateurs d'uploader une image, laquelle est ensuite analysée par un moteur d'intelligence artificielle pour générer des labels précis et pertinents.

### Features
- Upload d'Image : Interface utilisateur conviviale pour uploader facilement des images.
- Reconnaissance IA : Utilisation d'AWS Rekognition pour une analyse d'image fiable et avancée. La flexibilité du système permet une intégration future avec d'autres API de reconnaissance d'image.
- Technologies Utilisées : Développé avec Node.js et React.js, garantissant une expérience utilisateur fluide et une intégration backend robuste.
- Enregistre vos images sur le cloud et votre analyse dans une base de données

## Getting Started

### Prerequisites

Retrouvez la liste de tout les pré-requis pour lancer le projet.

* Base de donnée : RethinkDB rethinkdb 2.4.3 (arm64-apple-darwin22.4.0) (CLANG 14.0.3 (clang-1403.0.22.14.1)), Darwin 23.1.0 arm64
* IDE utilisé : Visual Studio Code 1.85.1
* Gestionnaire de package : npm 10.1.0
* OS supported : MacOS, Linux, Windows
* Environmment Node.js : v20.7.0
* AWS-CLI : 2.0.0 (pour les tests)
* AWS Rekognition

### Configuration

#### Clone the repository
Récupérer le projet sur votre machine en utilisant la commande suivante :
```bash
git clone https://github.com/YannickPerret/BI1-Vision.git bi1-vision
```

#### Installation de RethinkDB

##### macOS

1. **Avec Homebrew :**
   - Ouvrez un terminal.
   - Exécutez la commande suivante pour installer Homebrew si ce n'est pas déjà fait :
     ```bash
     /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
     ```
   - Installez RethinkDB avec Homebrew :
     ```bash
     brew update
     brew install rethinkdb
     ```

2. **Démarrage de RethinkDB :**
   - Après l'installation, accédez au dossier du projet et démarrez RethinkDB en exécutant :
     ```bash
     rethinkdb
     ```
   - Par défaut, le serveur RethinkDB démarre sur le port `8080`. Accédez à `http://localhost:8080` dans votre navigateur pour ouvrir le tableau de bord RethinkDB.

#### Windows

1. **Téléchargement :**
   - Rendez-vous sur la page de téléchargements de RethinkDB : [RethinkDB Downloads](https://rethinkdb.com/docs/install/windows/).
   - Téléchargez la dernière version de RethinkDB pour Windows.

2. **Installation :**
   - Ouvrez le fichier `.exe` téléchargé et suivez les instructions d'installation.

3. **Démarrage de RethinkDB :**
   - Une fois installé, exécutez RethinkDB à partir de l'invite de commande.
   ```bash
    rethinkdb
    ```
   - Le serveur RethinkDB démarre généralement sur le port `8080`. Accédez à `http://localhost:8080` pour visualiser le tableau de bord.

#### Environment variables
Il faut ensuite copie le .env.example en .env et remplir les informations de connexion au SDK d'aws.

```bash
cp .env.example .env
```

> :warning: **La suite de la procédure est executée pour un environnement MacOs** Les commandes peuvent différer selon votre environnement.


## Deployment

### On dev environment
Une fois le projet cloné et les prérequis installé, il faut installer les dépendances du projet avec la commande suivante :
```bash
npm install
```
resultat attendu : 
```bash
up to date, audited 305 packages in 738ms

102 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
```

Pour lancer le projet en local, utilisez la commande raccourcis suivante : 
```bash
npm run dev:all
```
resultat attendu : 
```bash
[1] 
[1] > bi-frontend@0.0.0 dev:labelDetector
[1] > cd labelDetector && node index.js
[1] 
[2] 
[2] > bi-frontend@0.0.0 dev:current
[2] > vite
[2] 
[0] 
[0] > bi-frontend@0.0.0 dev:dataObject
[0] > cd dataObject && node index.js
[0] 
[2] 
[2]   VITE v5.0.10  ready in 122 ms
[2] 
[2]   ➜  Local:   http://localhost:5173/
[2]   ➜  Network: use --host to expose
[1] (node:11283) NOTE: We are formalizing our plans to enter AWS SDK for JavaScript (v2) into maintenance mode in 2023.
[1] 
[1] Please migrate your code to use AWS SDK for JavaScript (v3).
[1] For more information, check the migration guide at https://a.co/7PzMCcy
[1] (Use `node --trace-warnings ...` to show where the warning was created)
[1] {"level":30,"time":1704876379080,"pid":11283,"hostname":"yannicks-MacBook-Pro.local","msg":"Server listening at http://[::1]:28469"}
[1] {"level":30,"time":1704876379082,"pid":11283,"hostname":"yannicks-MacBook-Pro.local","msg":"Server listening at http://127.0.0.1:28469"}
[1] [LABELDETECTOR] : server listening on 28469
[0] {"level":30,"time":1704876379132,"pid":11284,"hostname":"yannicks-MacBook-Pro.local","msg":"Server listening at http://127.0.0.1:28468"}
[0] server listening on http://localhost:28468
[0] (node:11284) NOTE: We are formalizing our plans to enter AWS SDK for JavaScript (v2) into maintenance mode in 2023.
[0] 
[0] Please migrate your code to use AWS SDK for JavaScript (v3).
[0] For more information, check the migration guide at https://a.co/7PzMCcy
[0] (Use `node --trace-warnings ...` to show where the warning was created)
[0] Bucket exists. js.aws.cld.education
```

Accédez ensuite à l'application via l'url suivante : http://localhost:5173/

#### Tests
Pour lancer les tests, utilisez la commande suivante : 
```bash
npm run test
```
resultat attendu : 
```bash

```

### On integration environment

Commençons par build l'interface web avec la commande suivante : 
```bash
npm run build
```
resultat attendu : 
```bash
tchoune@yannicks-MacBook-Pro Bi1 % npm run build     

> bi-frontend@0.0.0 build
> vite build

vite v5.0.10 building for production...
✓ 32 modules transformed.
dist/index.html                   0.45 kB │ gzip:  0.30 kB
dist/assets/index-4sK4E3Wk.css    1.39 kB │ gzip:  0.72 kB
dist/assets/index-XPzPoTB7.js   144.75 kB │ gzip: 46.60 kB
✓ built in 406ms
```




How to deploy the application outside the dev environment.

## Directory structure

* Tip: try the tree bash command

```shell
.
├── dataObject    // Nodejs server
│   ├── libs
│   └── uploads
├── dist          // Builded Reactjs web app
│   └── assets
├── labelDetector   // Nodejs server
│   └── lib
│       └── providers
├── public
├── rethinkdb_data   // RethinkDB data
│   └── tmp
├── src             // Reactjs web app
│   ├── assets
│   ├── components
│   └── styles
└── tests           // Tests
    └── images
        └── tests
```

## Collaborate

* Take time to read some readme and find the way you would like to help other developers collaborate with you.

* They need to know:
  * How to propose a new feature (issue, pull request)
  * [How to commit](https://www.conventionalcommits.org/en/v1.0.0/)
  * [How to use your workflow](https://nvie.com/posts/a-successful-git-branching-model/)

## License

Le projet est sous licence MIT

## Contact

Yannick Perret - support par email exclusivement :  dev[at]yannickperret.com