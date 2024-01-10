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
* Environmment Node.js : minimum v21.0.0 
* AWS-CLI : 2.0.0 (pour les tests)
* AWS Rekognition SDK V2 !

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
Il faut ensuite copie le .env.example en .env et remplir les informations de connexion au SDK d'aws et pour la base de donnée RethinkDB

```bash
cp .env.example .env
```

## Deployment
> :warning: **La suite de la procédure est executée pour un environnement MacOs** Les commandes peuvent différer selon votre environnement.

### On dev environment
Une fois le projet cloné et les prérequis installé, il faut installer les dépendances du projet avec la commande suivante :
```bash
npm install
git submodule foreach --recursive 'npm install'
```
resultat attendu : 
```bash
tchoune@yannicks-MacBook-Pro Bi1 % npm install                            

added 302 packages, and audited 303 packages in 3s

103 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
tchoune@yannicks-MacBook-Pro Bi1 % git submodule foreach --recursive 'npm install'

Entering 'dataObject'
npm WARN deprecated querystring@0.2.0: The querystring API is considered Legacy. new code should use the URLSearchParams API instead.

added 129 packages, and audited 130 packages in 898ms

26 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
Entering 'labelDetector'
npm WARN deprecated querystring@0.2.0: The querystring API is considered Legacy. new code should use the URLSearchParams API instead.

added 105 packages, and audited 106 packages in 811ms

20 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
```

Pour lancer le projet en local, utilisez la commande raccourcis suivante : 
```bash
npm run dev:all
```
resultat attendu : 
```bash
> bi-frontend@0.0.0 dev:all
> concurrently "npm run dev:db" "npm run dev:dataObject" "npm run dev:labelDetector" "npm run dev:current"

[2] 
[2] > bi-frontend@0.0.0 dev:labelDetector
[2] > cd labelDetector && node index.js
[2] 
[3] 
[3] > bi-frontend@0.0.0 dev:current
[3] > vite
[3] 
[1] 
[1] > bi-frontend@0.0.0 dev:dataObject
[1] > cd dataObject && node index.js
[1] 
[0] 
[0] > bi-frontend@0.0.0 dev:db
[0] > cd labelDetector && rethinkdb
[0] 
[0] Running rethinkdb 2.4.3 (arm64-apple-darwin22.4.0) (CLANG 14.0.3 (clang-1403.0.22.14.1))...
[0] Running on Darwin 23.1.0 arm64
[0] Loading data from directory /Users/tchoune/Documents/dev/js/Bi1/labelDetector/rethinkdb_data
[0] Listening for intracluster connections on port 29015
[0] Listening for client driver connections on port 28015
[0] Listening for administrative HTTP connections on port 8080
[0] Listening on cluster addresses: 127.0.0.1, ::1
[0] Listening on driver addresses: 127.0.0.1, ::1
[0] Listening on http addresses: 127.0.0.1, ::1
[0] To fully expose RethinkDB on the network, bind to all addresses by running rethinkdb with the `--bind all` command line option.
[0] Server ready, "yannicks_MacBook_Pro_local_khy" a9ebc96e-e255-48e9-a70d-e5049d2e0d52
[2] (node:69486) NOTE: We are formalizing our plans to enter AWS SDK for JavaScript (v2) into maintenance mode in 2023.
[2] 
[2] Please migrate your code to use AWS SDK for JavaScript (v3).
[2] For more information, check the migration guide at https://a.co/7PzMCcy
[2] (Use `node --trace-warnings ...` to show where the warning was created)
[2] {"level":30,"time":1704915981303,"pid":69486,"hostname":"yannicks-MBP.sunrise.box","msg":"Server listening at http://[::1]:28469"}
[1] {"level":30,"time":1704915981303,"pid":69487,"hostname":"yannicks-MBP.sunrise.box","msg":"Server listening at http://127.0.0.1:28468"}
[1] [DataObject] server listening on http://localhost:28468
[2] {"level":30,"time":1704915981305,"pid":69486,"hostname":"yannicks-MBP.sunrise.box","msg":"Server listening at http://127.0.0.1:28469"}
[2] [LABELDETECTOR] : server listening on 28469
[1] (node:69487) NOTE: We are formalizing our plans to enter AWS SDK for JavaScript (v2) into maintenance mode in 2023.
[1] 
[1] Please migrate your code to use AWS SDK for JavaScript (v3).
[1] For more information, check the migration guide at https://a.co/7PzMCcy
[1] (Use `node --trace-warnings ...` to show where the warning was created)
[2] La base de données existe déjà
[2] La table existe déjà
[2] [LABELDETECTOR] : database bilizer and table images created
[3] 
[3]   VITE v5.0.11  ready in 271 ms
[3] 
[3]   ➜  Local:   http://localhost:5173/
[3]   ➜  Network: use --host to expose
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

Chaque service peut être lancer indépendamment des autres. Pour cela, il faut se rendre dans le dossier du service et lancer la commande suivante : 
```bash
npm run dev
```



### Routes API
Le sous-module `dataObject` est utilisé pour envoyer et récupérer des images depuis un bucket Amazon S3.
#### POST `/upload`
Permet de upload une image dans le bucket Amazon S3.
- **Paramètres** : 
  - `image` : Fichier image à télécharger.
- **Réponse** : 
  - Succès : `{ message: 'Image téléchargée avec succès.', url: [url de l'image] }`
  - Erreur : `{ error: 'message d'erreur' }`


  Le sous-module `LabelDetector` permet d'analyser une image et de recevoir les éléments reconnus sur l'image grâce à AWS Rekognition.
#### POST `/analyze`
Analyse une image et renvoie les labels détectés.
- **Paramètres** :
  - `url` : URL de l'image à analyser.
  - `maxLabel` : Nombre maximal de labels à retourner.
  - `minConfidence` : Seuil minimal de confiance pour les labels.
- **Réponse** : 
  - Succès : `{ message: 'Image analyzed with success', data: [données de l'analyse] }`
  - Erreur : `{ error: 'message d'erreur' }`

#### POST `/download`
Télécharge un fichier SQL contenant les informations des images analysées.
- **Paramètres** :
  - `url` : URL de l'image pour laquelle les données sont requises.
- **Réponse** : 
  - Succès : Fichier SQL pour insertion dans une base de données.
  - Erreur : `{ error: 'message d'erreur' }`

## Directory structure

```shell
.
├── dataObject    //nodejs Bucket AWS
│   ├── libs
│   ├── tests
│   │   ├── download
│   │   └── images
│   └── uploads
├── dist
│   └── assets
├── labelDetector //nodejs AWS Rekognition et RethinkDB
│   ├── lib
│   │   ├── database
│   │   └── providers
│   └── rethinkdb_data
│       └── tmp
│   ├── tests
│   │   ├── download
│   │   └── images
├── public
├── src           //ReactJS
│   ├── assets
│   ├── components
│   └── styles
└── tests
    └── images
        └── tests
```

## Collaborate

  ### Convention de Nommage
  Nous suivons une convention de nommage claire pour assurer une lisibilité et une maintenabilité élevées du code. Voici quelques exemples basés sur votre code :

  **Classes** : Noms en CamelCase avec un préfixe indiquant leur rôle, par exemple `AwsDataObjectImpl` pour une implémentation d'un objet de données AWS.

  **Fonctions** : Noms en camelCase commençant par un verbe, par exemple `encode(data)`.

  **Variables et Instances** : Noms explicites en camelCase, comme `bucketName` ou `fileContent`.

  **Constantes** : Utilisez des majuscules avec des underscores, par exemple AWS.

  **Noms de Fichiers** : Pour les noms de fichiers, utilisez une lettre minuscule au début et pour les mots suivants, collez-les ensemble avec la première lettre de chaque nouveau mot en majuscule, comme `awsDataObjectImpl.js`.

### Pattern de Protection de Branche

1. **`main/master` :** 
   - **Protection :** Cette branche est protégée. Les commits directs sont interdits.
   - **Usage :** Seules les pull requests (PR) approuvées et testées peuvent être fusionnées dans `main/master`.
   - **Revue de Code :** Chaque PR doit être revue et approuvée par au moins une autre personne de l'équipe.
   - **Tests Automatiques :** Les tests automatisés doivent passer avant la fusion.

2. **Branches de Développement (`dev`, `feature/*`, `bugfix/*`, etc.) :**
   - **Protection :** Protection légère ou pas de protection. Selon les besoins du projet, vous pouvez choisir d'exiger des revues de code même pour ces branches.
   - **Usage :** 
     - `dev` sert de branche de développement principal.
     - `feature/*` pour le développement de nouvelles fonctionnalités.
     - `bugfix/*` pour les corrections de bugs.
   - **Fusion :** Ces branches peuvent être fusionnées dans `main/master` une fois qu'elles sont complètes, testées, et approuvées.

### Bonnes Pratiques
- **Noms des commit :** Utilisez des noms descriptifs pour vos branches, par exemple `feature: add-image-processing` ou `bugfix: login-issue` ou si c'est un developpement courrant "verbe + action"
- **Rebase et Squash :** Pour garder un historique propre, utilisez `rebase` pour mettre à jour votre branche avec `main/master` et `squash` vos commits avant de fusionner.
- **Commits Fréquents, Petits et Significatifs :** Cela facilite les revues de code et la compréhension de l'historique des changements.

## License

Le projet est sous licence MIT

## Contact

Yannick Perret - support par email exclusivement :  dev[at]yannickperret.com