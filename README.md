# PcVerify - Logiciel de vérification et d'optimisation PC
PcVerify est une **application desktop** développée avec *Electron.js* qui permet d'analyser, vérifier et optimiser votre ordinateur. Elle détecte les fichiers **suspects**, **vérifie** les exécutables **non autorisés**, liste les **périphériques connectés**, nettoie le **cache système** et fournit des **conseils d'optimisation**.

## Fonctionnalités principales
- Analyse des fichiers suspects : Détection des fichiers Composium et autres extensions potentiellement dangereuses
- Vérification des exécutables : Identification des fichiers .exe non autorisés ou suspects
- Inventaire des périphériques : Liste complète des périphériques USB connectés
- Nettoyage du cache : Suppression des fichiers temporaires pour libérer de l'espace disque
- Diagnostic système : Analyse des composants matériels et des performances
- Conseils d'optimisation : Recommandations personnalisées pour améliorer les performances

## Prérequis
- Node.js v16 ou supérieur
- npm v8 ou supérieur
- Système d'exploitation : Windows, macOS ou Linux (Bientôt)
### Installation
1. Clonez le dépôt :

  ```bash
  git clone https://github.com/votre-utilisateur/pcverify.git
```
2. Installez les dépendances :

```bash
cd pcverify
npm install
```

## Utilisation
Démarrer l'application en mode développement :

```bash
npm start
```

### Pour lancer une vérification complète du système :
- Cliquez sur "Démarrer la vérification"
- Consultez les résultats dans l'onglet "Résultats & Conseils"
- Utilisez "Nettoyer le cache" pour supprimer les fichiers temporaires

## Construction de l'application
Pour créer des exécutables :
### Windows :

``` bash
npm run package-win
```

### macOS :

```bash
npm run package-mac
```

### Linux :

```bash
npm run package-linux
```

*Les fichiers exécutables seront générés dans le dossier dist/.*

## Structure du projet
```text
pcverify/
├── src/
│   ├── main.js          # Processus principal Electron
│   ├── preload.js       # Script de préchargement
│   └── renderer/
│       ├── index.html   # Interface utilisateur
│       ├── style.css    # Feuille de style
│       └── script.js    # Logique de l'interface
├── package.json         # Fichier de configuration
└── .gitignore
```

## Contribution
- Les contributions sont les bienvenues. Veuillez suivre ces étapes :
- Forkez le projet
- Créez votre branche (git checkout -b feature/AmazingFeature)
- Committez vos changements (git commit -m 'Add some AmazingFeature')
- Pushez vers la branche (git push origin feature/AmazingFeature)
- Ouvrez une Pull Request

## Licence
Distribué sous la licence **MIT**. Voir le fichier **LICENSE** pour plus d'informations.

## Crédits
- Crée par Maxlware
### Remerciments
- Node.js
- Electron.js

## Remarques importantes
**Cette application effectue des opérations sensibles sur votre système**
Toujours sauvegarder vos données importantes avant d'effectuer des nettoyages
L'application est conçue à des fins éducatives et diagnostiques
Certaines fonctionnalités peuvent nécessiter des droits administrateur
