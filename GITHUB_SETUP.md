# 🚀 Guide pour Pusher EquipePro sur GitHub

Ce guide vous accompagne étape par étape pour publier votre projet **EquipePro** sur GitHub.

## 📋 Prérequis

- ✅ Avoir un compte GitHub ([créer un compte](https://github.com/signup))
- ✅ Avoir Git installé sur votre machine
  - Windows : [Git for Windows](https://git-scm.com/download/win)
  - Mac : `brew install git`
  - Linux : `sudo apt-get install git`
- ✅ Vérifier l'installation : `git --version`

## 🔧 Configuration Initiale de Git

### 1. Configurer votre identité Git (première fois uniquement)

```bash
# Configurer votre nom
git config --global user.name "Votre Nom"

# Configurer votre email (utilisez l'email de votre compte GitHub)
git config --global user.email "votre.email@example.com"

# Vérifier la configuration
git config --list
```

## 📦 Préparer le Projet

### 2. Naviguer vers votre projet

```bash
cd C:\Users\comp\Documents\Development\Projects\projet_spring_angular
```

### 3. Vérifier les fichiers présents

```bash
# Lister les fichiers
dir

# Vous devriez voir :
# - backend/
# - frontend/
# - README.md
# - .gitignore
```

## 🎯 Créer le Repository sur GitHub

### 4. Créer un nouveau repository

1. Allez sur [github.com](https://github.com)
2. Cliquez sur le bouton **"+"** en haut à droite
3. Sélectionnez **"New repository"**

4. Remplissez les informations :
   - **Repository name** : `equipepro` (ou le nom de votre choix)
   - **Description** : `Application de gestion d'équipe avec Spring Boot et Angular`
   - **Visibilité** :
     - ✅ **Public** : Tout le monde peut voir (recommandé pour portfolio)
     - ⚠️ **Private** : Seulement vous et vos collaborateurs
   - **NE PAS** cocher :
     - ❌ Add a README file
     - ❌ Add .gitignore
     - ❌ Choose a license

5. Cliquez sur **"Create repository"**

### 5. Copier l'URL du repository

Après création, GitHub affiche une page avec l'URL de votre repository.

**Format HTTPS** (recommandé pour débutants) :
```
https://github.com/votre-username/equipepro.git
```

**Format SSH** (si vous avez configuré les clés SSH) :
```
git@github.com:votre-username/equipepro.git
```

## 🔄 Initialiser Git Localement

### 6. Initialiser le repository Git

```bash
# Initialiser Git dans votre projet
git init

# Vérifier le statut
git status
```

### 7. Ajouter tous les fichiers

```bash
# Ajouter tous les fichiers au staging
git add .

# Vérifier les fichiers ajoutés
git status
```

### 8. Créer le premier commit

```bash
# Créer le commit initial
git commit -m "Initial commit: EquipePro - Application de gestion d'équipe"

# Vérifier l'historique
git log
```

## 🌐 Connecter au Repository GitHub

### 9. Ajouter le remote GitHub

Remplacez `votre-username` par votre nom d'utilisateur GitHub :

```bash
# Ajouter le remote
git remote add origin https://github.com/votre-username/equipepro.git

# Vérifier le remote
git remote -v
```

### 10. Renommer la branche en 'main'

```bash
# Renommer la branche master en main (convention moderne)
git branch -M main
```

### 11. Pusher le code sur GitHub

```bash
# Premier push
git push -u origin main
```

**Si c'est votre premier push**, Git vous demandera vos identifiants GitHub :
- **Username** : Votre nom d'utilisateur GitHub
- **Password** : Utilisez un **Personal Access Token** (PAT) au lieu du mot de passe

### 🔑 Créer un Personal Access Token (si nécessaire)

Si Git demande un mot de passe :

1. Allez sur GitHub → **Settings** (icône profil en haut à droite)
2. **Developer settings** (tout en bas)
3. **Personal access tokens** → **Tokens (classic)**
4. **Generate new token** → **Generate new token (classic)**
5. Donnez un nom : `EquipePro Token`
6. Sélectionnez les scopes :
   - ✅ `repo` (Full control of private repositories)
7. **Generate token**
8. **COPIEZ** le token immédiatement (vous ne pourrez plus le voir!)
9. Utilisez ce token comme **mot de passe** lors du push

## ✅ Vérification

### 12. Vérifier sur GitHub

1. Allez sur `https://github.com/votre-username/equipepro`
2. Vous devriez voir :
   - ✅ Tous vos fichiers
   - ✅ Le README.md affiché en bas de page
   - ✅ Les dossiers `backend/` et `frontend/`

## 🔄 Commandes Git Futures

### Ajouter de nouvelles modifications

```bash
# 1. Vérifier les modifications
git status

# 2. Ajouter les fichiers modifiés
git add .

# Ou ajouter des fichiers spécifiques
git add backend/ems-Backend-1/ems-backend/src/main/java/...

# 3. Créer un commit avec un message descriptif
git commit -m "Ajout de la fonctionnalité de recherche avancée"

# 4. Pusher sur GitHub
git push origin main
```

### Récupérer les modifications depuis GitHub

```bash
# Télécharger et fusionner les modifications
git pull origin main
```

### Voir l'historique des commits

```bash
# Historique complet
git log

# Historique condensé
git log --oneline

# Historique graphique
git log --graph --oneline --all
```

## 📝 Bonnes Pratiques

### Messages de Commit

Utilisez des messages clairs et descriptifs :

✅ **BON** :
```bash
git commit -m "Ajout de la validation email dans le formulaire employé"
git commit -m "Correction du bug de suppression de département"
git commit -m "Amélioration du design du dashboard"
```

❌ **MAUVAIS** :
```bash
git commit -m "update"
git commit -m "fix"
git commit -m "changes"
```

### Fréquence des Commits

- Commitez **souvent** (après chaque fonctionnalité ou correction)
- Poussez sur GitHub **régulièrement** (au moins une fois par jour de travail)

### Branches (optionnel pour projets avancés)

```bash
# Créer une nouvelle branche pour une fonctionnalité
git checkout -b feature/authentification

# Travailler sur la branche
git add .
git commit -m "Implémentation de l'authentification JWT"

# Pusher la branche
git push origin feature/authentification

# Retourner sur main
git checkout main

# Fusionner la branche
git merge feature/authentification
```

## 🎨 Personnaliser le README

### Ajouter des badges

Éditez `README.md` et ajoutez votre URL GitHub :

```markdown
![License](https://img.shields.io/github/license/votre-username/equipepro)
![Stars](https://img.shields.io/github/stars/votre-username/equipepro)
![Forks](https://img.shields.io/github/forks/votre-username/equipepro)
```

### Ajouter des captures d'écran

1. Créez un dossier `screenshots/` dans votre projet
2. Ajoutez vos images
3. Référencez-les dans le README :

```markdown
## Screenshots

![Dashboard](screenshots/dashboard.png)
![Employee List](screenshots/employee-list.png)
```

## 🔒 Sécurité - IMPORTANT

### ⚠️ NE JAMAIS PUSHER :

- ❌ Mots de passe de base de données
- ❌ Clés API
- ❌ Tokens secrets
- ❌ Fichiers de configuration avec données sensibles

### ✅ Vérifier avant de pusher

```bash
# Vérifier les fichiers qui seront commités
git status

# Voir le contenu exact des modifications
git diff

# Si vous avez commité par erreur un fichier sensible
git reset HEAD~1  # Annule le dernier commit (garde les modifications)
```

## 📞 Résolution de Problèmes

### Erreur : "fatal: remote origin already exists"

```bash
# Supprimer le remote existant
git remote remove origin

# Ajouter à nouveau
git remote add origin https://github.com/votre-username/equipepro.git
```

### Erreur : "Updates were rejected"

```bash
# Récupérer les modifications distantes d'abord
git pull origin main --rebase

# Puis pusher
git push origin main
```

### Erreur : "Permission denied (publickey)"

Si vous utilisez SSH, configurez vos clés SSH :
1. [Guide GitHub SSH](https://docs.github.com/en/authentication/connecting-to-github-with-ssh)

Ou utilisez HTTPS à la place :
```bash
git remote set-url origin https://github.com/votre-username/equipepro.git
```

## 🎓 Ressources Utiles

- [Documentation Git officielle](https://git-scm.com/doc)
- [GitHub Docs](https://docs.github.com)
- [Git Cheat Sheet](https://education.github.com/git-cheat-sheet-education.pdf)
- [Learn Git Branching (interactif)](https://learngitbranching.js.org/)

---

**Félicitations! 🎉** Votre projet **EquipePro** est maintenant sur GitHub!

Partagez votre repository avec le monde : `https://github.com/votre-username/equipepro`
