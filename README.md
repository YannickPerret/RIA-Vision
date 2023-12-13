# BI1-Vision

## Installation
Pour l'installation de ce projet, il faut tout d'abord cloner le projet sur votre machine. Pour cela, il faut utiliser la commande suivante :
```bash
git clone https://github.com/YannickPerret/BI1-Vision.git bi1-vision
```

Ensuite, il faut installer les dépendances du projet. Pour cela, il faut utiliser la commande suivante :
```bash
cd bi1-vision
npm install
```

il faut ensuite copie le .env.example en .env et remplir les informations de connexion au SDK d'aws.

```bash
cp .env.example .env
```

## Lancement
Pour lancer le projet, il faut utiliser la commande suivante :
```bash
npm start
```

## Utilisation
Pour utiliser le projet, il faut lancer en ligne de commande : 
```bash
node index.js <image> <maxLabels?> <minConfidence?>
```

## Tests
Pour lancer les tests, il faut utiliser la commande suivante :
```bash
npm test
```