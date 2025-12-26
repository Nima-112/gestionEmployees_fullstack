# EquipePro - Application de Gestion d'Équipe

![Version](https://img.shields.io/badge/version-2.0-blue.svg)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.0-brightgreen.svg)
![Angular](https://img.shields.io/badge/Angular-21.0-red.svg)
![Java](https://img.shields.io/badge/Java-21-orange.svg)
![MySQL](https://img.shields.io/badge/MySQL-8.0+-blue.svg)

Application web moderne de gestion des employés et départements, développée avec **Spring Boot** et **Angular**.

## 📋 Table des Matières

- [Fonctionnalités](#-fonctionnalités)
- [Technologies Utilisées](#-technologies-utilisées)
- [Prérequis](#-prérequis)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Lancement du Projet](#-lancement-du-projet)
- [Structure du Projet](#-structure-du-projet)
- [API Endpoints](#-api-endpoints)
- [Captures d'Écran](#-captures-décran)

## ✨ Fonctionnalités

### Gestion des Employés
- ✅ Créer, modifier, supprimer et visualiser les employés
- ✅ Recherche et filtrage en temps réel
- ✅ Export des données en CSV
- ✅ Page de détail complète pour chaque employé
- ✅ Sélection multiple et suppression en masse
- ✅ Pagination et tri des données

### Gestion des Départements
- ✅ CRUD complet des départements
- ✅ Affectation des employés aux départements
- ✅ Validation des contraintes (empêcher suppression avec employés)
- ✅ Statistiques par département

### Dashboard & Statistiques
- ✅ Vue d'ensemble avec cartes statistiques
- ✅ Employés récents
- ✅ Répartition par département avec graphiques
- ✅ Actions rapides
- ✅ Mise à jour en temps réel

### Interface Utilisateur
- ✅ Design moderne avec Material Design
- ✅ Thème sombre élégant
- ✅ Navigation intuitive (sidebar + toolbar)
- ✅ Animations fluides
- ✅ Interface responsive (mobile-friendly)
- ✅ Notifications toast pour les actions

## 🛠 Technologies Utilisées

### Backend
- **Spring Boot 3.2.0** - Framework Java
- **Spring Data JPA** - Gestion de la persistance
- **Hibernate** - ORM
- **MySQL** - Base de données relationnelle
- **Lombok** - Réduction du code boilerplate
- **Maven** - Gestion des dépendances

### Frontend
- **Angular 21** - Framework JavaScript
- **Angular Material** - Composants UI
- **RxJS** - Programmation réactive
- **TypeScript** - Typage statique
- **SCSS** - Styles avancés

## 📦 Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- **Java JDK 21** ou supérieur
  - [Télécharger Java](https://www.oracle.com/java/technologies/downloads/)
  - Vérifier : `java -version`

- **Node.js 18+** et **npm**
  - [Télécharger Node.js](https://nodejs.org/)
  - Vérifier : `node -v` et `npm -v`

- **MySQL 8.0+**
  - [Télécharger MySQL](https://dev.mysql.com/downloads/)
  - Ou utiliser XAMPP/WAMP

- **Maven 3.6+**
  - Généralement inclus avec Spring Tool Suite ou IntelliJ
  - Vérifier : `mvn -version`

- **Git**
  - [Télécharger Git](https://git-scm.com/downloads)

## 🚀 Installation

### 1. Cloner le Projet

```bash
git clone https://github.com/votre-username/equipepro.git
cd equipepro
```

### 2. Configuration de la Base de Données

#### Démarrer MySQL

Assurez-vous que MySQL est en cours d'exécution (port 3306 par défaut).

#### Créer la Base de Données

```sql
-- Connectez-vous à MySQL
mysql -u root -p

-- Créer la base de données
CREATE DATABASE equipepro;

-- Vérifier la création
SHOW DATABASES;

-- Quitter MySQL
exit;
```

> **Note :** Les tables seront créées automatiquement au premier lancement grâce à Hibernate (`ddl-auto=update`).

### 3. Installation du Backend

```bash
# Naviguer vers le dossier backend
cd backend/ems-Backend-1/ems-backend

# Option 1 : Avec Maven (ligne de commande)
mvn clean install

# Option 2 : Avec un IDE (Spring Tool Suite 4 / IntelliJ IDEA)
# - Importer le projet Maven
# - Attendre que les dépendances se téléchargent
```

### 4. Installation du Frontend

```bash
# Naviguer vers le dossier frontend (depuis la racine du projet)
cd frontend/ems-frontend

# Installer les dépendances npm
npm install

# Attendre la fin de l'installation (peut prendre quelques minutes)
```

## ⚙️ Configuration

### Configuration Backend

Fichier : `backend/ems-Backend-1/ems-backend/src/main/resources/application.properties`

```properties
# Configuration MySQL
spring.datasource.url=jdbc:mysql://localhost:3306/equipepro
spring.datasource.username=root
spring.datasource.password=

# Configuration JPA/Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.open-in-view=false
```

**Modifier si nécessaire :**
- `spring.datasource.password` : Votre mot de passe MySQL (vide par défaut)
- `spring.datasource.url` : Port MySQL si différent de 3306

### Configuration Frontend

Fichier : `frontend/ems-frontend/src/proxy.conf.json`

```json
{
  "/api": {
    "target": "http://localhost:8080",
    "secure": false,
    "changeOrigin": true
  }
}
```

> **Note :** Le frontend utilise un proxy pour éviter les problèmes CORS en développement.

## 🎯 Lancement du Projet

### Démarrer le Backend

#### Option 1 : Avec Spring Tool Suite 4 (STS4) - **Recommandé**

1. Ouvrir STS4
2. `File` → `Import` → `Existing Maven Projects`
3. Sélectionner le dossier `backend/ems-Backend-1/ems-backend`
4. Clic droit sur le projet → `Run As` → `Spring Boot App`
5. Vérifier dans la console : `Tomcat started on port(s): 8080`

#### Option 2 : Avec Maven (ligne de commande)

```bash
cd backend/ems-Backend-1/ems-backend
mvn spring-boot:run
```

#### Option 3 : Avec IntelliJ IDEA

1. Ouvrir le projet backend
2. Attendre l'indexation
3. Clic droit sur `EmsBackendApplication.java` → `Run`

**Vérification :** Le backend est accessible sur `http://localhost:8080`

### Démarrer le Frontend

```bash
cd frontend/ems-frontend
npm start
```

**Vérification :**
- Le frontend démarre sur `http://localhost:4200`
- Le navigateur s'ouvre automatiquement
- Vous verrez le dashboard **EquipePro**

## 📂 Structure du Projet

```
equipepro/
│
├── backend/
│   └── ems-Backend-1/
│       └── ems-backend/
│           ├── src/
│           │   ├── main/
│           │   │   ├── java/net/javaguides/ems/
│           │   │   │   ├── controller/      # REST Controllers
│           │   │   │   ├── dto/             # Data Transfer Objects
│           │   │   │   ├── entity/          # JPA Entities
│           │   │   │   ├── exception/       # Custom Exceptions
│           │   │   │   ├── mapper/          # Entity-DTO Mappers
│           │   │   │   ├── repository/      # JPA Repositories
│           │   │   │   ├── service/         # Business Logic
│           │   │   │   │   └── impl/
│           │   │   │   └── EmsBackendApplication.java
│           │   │   └── resources/
│           │   │       └── application.properties
│           │   └── test/
│           └── pom.xml                      # Maven Dependencies
│
└── frontend/
    └── ems-frontend/
        ├── src/
        │   ├── app/
        │   │   ├── components/
        │   │   │   ├── dashboard/          # Page Dashboard
        │   │   │   ├── employee-list/      # Liste Employés
        │   │   │   ├── employee-form/      # Formulaire Employé
        │   │   │   ├── employee-detail/    # Détail Employé
        │   │   │   ├── department-list/    # Liste Départements
        │   │   │   └── department-form/    # Formulaire Département
        │   │   ├── models/                 # TypeScript Models
        │   │   ├── services/               # HTTP Services
        │   │   ├── app.ts                  # App Component
        │   │   ├── app.html                # Layout Principal
        │   │   └── app.scss                # Styles Globaux
        │   ├── index.html
        │   └── styles.scss                 # Styles Globaux
        ├── package.json                    # npm Dependencies
        └── angular.json                    # Angular Config
```

## 🌐 API Endpoints

### Employés

| Méthode | Endpoint                | Description                    |
|---------|-------------------------|--------------------------------|
| GET     | `/api/employees`        | Récupérer tous les employés    |
| GET     | `/api/employees/{id}`   | Récupérer un employé par ID    |
| POST    | `/api/employees`        | Créer un nouvel employé        |
| PUT     | `/api/employees/{id}`   | Modifier un employé            |
| DELETE  | `/api/employees/{id}`   | Supprimer un employé           |

### Départements

| Méthode | Endpoint                  | Description                      |
|---------|---------------------------|----------------------------------|
| GET     | `/api/departments`        | Récupérer tous les départements  |
| GET     | `/api/departments/{id}`   | Récupérer un département par ID  |
| POST    | `/api/departments`        | Créer un nouveau département     |
| PUT     | `/api/departments/{id}`   | Modifier un département          |
| DELETE  | `/api/departments/{id}`   | Supprimer un département         |

### Exemples de Requêtes

#### Créer un Employé

```bash
POST http://localhost:8080/api/employees
Content-Type: application/json

{
  "firstName": "Jean",
  "lastName": "Dupont",
  "email": "jean.dupont@example.com",
  "departmentId": 1
}
```

#### Créer un Département

```bash
POST http://localhost:8080/api/departments
Content-Type: application/json

{
  "name": "Ressources Humaines",
  "description": "Gestion du personnel et recrutement"
}
```

## 📸 Captures d'Écran

### Dashboard
- Cartes statistiques (Total Employés, Départements, Employés Assignés, Statut)
- Liste des employés récents
- Actions rapides
- Répartition par département avec barres de progression

### Liste des Employés
- Tableau avec pagination et tri
- Recherche en temps réel
- Sélection multiple
- Actions : Voir, Modifier, Supprimer, Exporter CSV

### Détail Employé
- Informations complètes de l'employé
- Avatar avec initiales
- Badge du département
- Actions : Modifier, Supprimer, Retour

### Gestion des Départements
- Liste des départements avec nombre d'employés
- Création et modification de départements
- Validation des contraintes

## 🔧 Commandes Utiles

### Backend

```bash
# Compiler le projet
mvn clean compile

# Exécuter les tests
mvn test

# Créer un JAR exécutable
mvn clean package

# Lancer le JAR
java -jar target/equipepro-backend-0.0.1-SNAPSHOT.jar
```

### Frontend

```bash
# Démarrer en mode développement
npm start

# Build de production
npm run build

# Lancer les tests
npm test

# Linter le code
ng lint
```

## 🐛 Résolution de Problèmes

### Erreur : "Port 8080 already in use"

**Solution :** Un autre processus utilise le port 8080.

```bash
# Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:8080 | xargs kill -9
```

### Erreur : "Access denied for user 'root'@'localhost'"

**Solution :** Vérifier les identifiants MySQL dans `application.properties`.

### Erreur Frontend : "Cannot GET /api/..."

**Solution :**
1. Vérifier que le backend est démarré
2. Vérifier le proxy dans `proxy.conf.json`
3. Redémarrer le frontend : `npm start`

### Erreur : "Table 'equipepro.employees' doesn't exist"

**Solution :**
1. Vérifier que `spring.jpa.hibernate.ddl-auto=update` est dans `application.properties`
2. Redémarrer le backend pour créer les tables automatiquement

## 📝 Licence

Ce projet est sous licence MIT. Vous êtes libre de l'utiliser, le modifier et le distribuer.

## 👨‍💻 Auteur

Développé avec ❤️ en utilisant Spring Boot et Angular.

---

**EquipePro** - Gérez vos équipes efficacement ! 🚀
