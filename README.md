# EquipePro - Application de Gestion d'Équipe

![Version](https://img.shields.io/badge/version-2.0-blue.svg)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.0-brightgreen.svg)
![Angular](https://img.shields.io/badge/Angular-21.0-red.svg)
![Java](https://img.shields.io/badge/Java-21-orange.svg)
![MySQL](https://img.shields.io/badge/MySQL-8.0+-blue.svg)
![JWT](https://img.shields.io/badge/JWT-Enabled-yellow.svg)
![Security](https://img.shields.io/badge/Security-Spring%20Security-green.svg)

Application web moderne et sécurisée de gestion des employés et départements, développée avec **Spring Boot** et **Angular**, intégrant un système d'authentification JWT et d'autorisation basée sur les rôles.

## 📋 Table des Matières

- [Fonctionnalités](#-fonctionnalités)
- [Technologies Utilisées](#-technologies-utilisées)
- [Architecture et Sécurité](#-architecture-et-sécurité)
- [Prérequis](#-prérequis)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Lancement du Projet](#-lancement-du-projet)
- [Identifiants par Défaut](#-identifiants-par-défaut)
- [Structure du Projet](#-structure-du-projet)
- [API Endpoints](#-api-endpoints)
- [Tests](#-tests)
- [Captures d'Écran](#-captures-décran)

## ✨ Fonctionnalités

### 🔐 Authentification & Sécurité

- ✅ **Authentification JWT** (JSON Web Token)
  - Token sécurisé avec expiration (24h)
  - Stockage côté client (localStorage)
  - Refresh automatique lors de la navigation

- ✅ **Autorisation Basée sur les Rôles (RBAC)**
  - **ROLE_ADMIN** : Accès complet (gestion employés, départements, utilisateurs)
  - **ROLE_MANAGER** : Gestion employés et départements
  - **ROLE_EMPLOYEE** : Consultation uniquement (lecture seule)

- ✅ **Sécurité Multi-niveaux**
  - Backend : Spring Security + @PreAuthorize
  - Frontend : Guards (AuthGuard, RoleGuard) + Interceptors
  - Hashage BCrypt des mots de passe (force 10)
  - Protection CORS configurée
  - Endpoints sécurisés par rôle

- ✅ **Gestion des Sessions**
  - Déconnexion automatique à l'expiration du token
  - Logout avec nettoyage complet
  - Redirection automatique si non autorisé

### 👥 Gestion des Employés

- ✅ **CRUD Complet** avec permissions par rôle
- ✅ **Création de compte utilisateur** lors de l'ajout d'un employé
  - Formulaire unifié : infos personnelles + compte utilisateur
  - Assignation automatique du rôle
  - Validation username/email unique
- ✅ Recherche et filtrage en temps réel
- ✅ Export des données en CSV
- ✅ Page de détail complète pour chaque employé
- ✅ Sélection multiple et suppression en masse (Admin/Manager uniquement)
- ✅ Pagination et tri des données

### 🏢 Gestion des Départements

- ✅ **CRUD complet** avec permissions
- ✅ Affectation des employés aux départements
- ✅ Validation des contraintes (empêcher suppression avec employés)
- ✅ Statistiques par département
- ✅ Actions protégées par rôle

### 📊 Dashboard & Statistiques

- ✅ Vue d'ensemble avec cartes statistiques
- ✅ Employés récents
- ✅ Répartition par département avec graphiques
- ✅ Actions rapides selon les permissions
- ✅ Mise à jour en temps réel
- ✅ Menu utilisateur avec déconnexion

### 🎨 Interface Utilisateur

- ✅ **Page de connexion moderne**
  - Design dark theme cohérent
  - Animations fluides (cercles flottants, glassmorphism)
  - Icônes Material Design
  - Feedback visuel immédiat

- ✅ **Navigation sécurisée**
  - Sidebar intuitive avec routes protégées
  - Toolbar avec menu utilisateur
  - Affichage conditionnel selon les rôles
  - Redirection automatique si non connecté

- ✅ Design moderne avec Material Design
- ✅ Thème sombre élégant (Teal #7ee7c6 + Rouge #ff6b6b)
- ✅ Animations fluides et transitions
- ✅ Interface responsive (mobile-friendly)
- ✅ Notifications toast pour les actions

## 🛠 Technologies Utilisées

### Backend

- **Spring Boot 3.2.0** - Framework Java
- **Spring Security** - Sécurité et authentification
- **Spring Data JPA** - Gestion de la persistance
- **Hibernate** - ORM
- **MySQL** - Base de données relationnelle
- **JWT (jjwt 0.12.3)** - JSON Web Token
- **BCrypt** - Hashage des mots de passe
- **Lombok** - Réduction du code boilerplate
- **Maven** - Gestion des dépendances

### Frontend

- **Angular 21** - Framework JavaScript/TypeScript
- **Angular Material** - Composants UI Material Design
- **RxJS 7.8** - Programmation réactive
- **TypeScript 5.9** - Typage statique
- **SCSS** - Styles avancés avec variables
- **Angular Guards** - Protection des routes
- **HTTP Interceptors** - Injection automatique du token JWT

### Sécurité

- **JWT (JSON Web Token)** - Authentification stateless
- **BCrypt** - Hashage sécurisé des mots de passe
- **Spring Security** - Framework de sécurité
- **CORS** - Configuration Cross-Origin
- **RBAC** - Role-Based Access Control

## 🏗 Architecture et Sécurité

### Architecture 3-Tiers

```
┌─────────────────────────────────────────────────────┐
│              Frontend (Angular 21)                   │
│  - Components (Login, Dashboard, Lists, Forms)      │
│  - Services (Auth, Employee, Department)            │
│  - Guards (Auth, Role) + Interceptors               │
└─────────────────────────────────────────────────────┘
                        ↕ HTTP/JSON + JWT
┌─────────────────────────────────────────────────────┐
│           Backend (Spring Boot 3.2.0)                │
│  - Controllers (REST API)                            │
│  - Services (Business Logic)                         │
│  - Security (JWT Filter, UserDetailsService)        │
│  - Repositories (JPA)                                │
└─────────────────────────────────────────────────────┘
                        ↕ JDBC
┌─────────────────────────────────────────────────────┐
│             Base de Données (MySQL 8.0)              │
│  - Tables: employee, department, users, roles        │
│  - Relations: OneToMany, ManyToMany, OneToOne        │
└─────────────────────────────────────────────────────┘
```

### Flux d'Authentification

```
1. User → Login (username, password)
2. Backend → Validation credentials
3. Backend → Generate JWT Token (24h expiration)
4. Frontend → Store token (localStorage) + user info
5. Frontend → Inject token in all API requests (Authorization header)
6. Backend → Validate token + Extract roles
7. Backend → Check permissions (@PreAuthorize)
8. Backend → Return data or 403 Forbidden
```

### Matrice des Permissions

| Action                    | ADMIN | MANAGER | EMPLOYEE |
|---------------------------|-------|---------|----------|
| Consulter employés        | ✅    | ✅      | ✅       |
| Créer employé             | ✅    | ✅      | ❌       |
| Modifier employé          | ✅    | ✅      | ❌       |
| Supprimer employé         | ✅    | ✅      | ❌       |
| Consulter départements    | ✅    | ✅      | ✅       |
| Créer département         | ✅    | ✅      | ❌       |
| Modifier département      | ✅    | ✅      | ❌       |
| Supprimer département     | ✅    | ✅      | ❌       |
| Voir page de connexion    | ✅    | ✅      | ✅       |

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

> **Note :** Les tables (`employee`, `department`, `users`, `roles`, `user_roles`) seront créées automatiquement au premier lancement grâce à Hibernate (`ddl-auto=update`).

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
spring.jpa.show-sql=true

# Configuration JWT
app.jwt.secret=VotreSecretKeyTresLonguePourJWTQuiDoitFaireAuMoins256BitsDeSecurite
app.jwt.expiration-ms=86400000

# Configuration Serveur
server.port=8080
```

**Modifier si nécessaire :**
- `spring.datasource.password` : Votre mot de passe MySQL (vide par défaut)
- `spring.datasource.url` : Port MySQL si différent de 3306
- `app.jwt.secret` : Clé secrète pour signer les tokens JWT (gardez-la secrète!)
- `app.jwt.expiration-ms` : Durée de validité du token (86400000 ms = 24h)

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
6. **Vérifier l'initialisation des rôles :** Vous devriez voir dans les logs :
   ```
   Initializing roles...
   Creating default admin user...
   ```

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
- Vous verrez la **page de connexion** moderne

## 🔑 Identifiants par Défaut

Au premier lancement, un compte administrateur est créé automatiquement :

| Champ          | Valeur              |
|----------------|---------------------|
| **Username**   | `admin`             |
| **Password**   | `admin123`          |
| **Email**      | admin@equipepro.com |
| **Rôle**       | ROLE_ADMIN          |

> ⚠️ **Important :** Changez ces identifiants en production!

### Créer d'autres utilisateurs

Une fois connecté en tant qu'admin :
1. Allez dans "Employés"
2. Cliquez sur "Ajouter un employé"
3. Remplissez les informations personnelles
4. Remplissez la section "Compte utilisateur" :
   - Nom d'utilisateur
   - Mot de passe
   - Rôle (ADMIN, MANAGER, ou EMPLOYEE)

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
│           │   │   │   ├── config/
│           │   │   │   │   ├── CorsConfig.java
│           │   │   │   │   ├── SecurityConfig.java          # 🔐 Configuration Spring Security
│           │   │   │   │   └── DataInitializer.java         # 🔐 Init rôles + admin
│           │   │   │   ├── controller/
│           │   │   │   │   ├── EmployeeController.java      # 🔐 @PreAuthorize
│           │   │   │   │   ├── DepartmentController.java    # 🔐 @PreAuthorize
│           │   │   │   │   └── AuthController.java          # 🔐 Login endpoint
│           │   │   │   ├── dto/
│           │   │   │   │   ├── EmployeeDto.java
│           │   │   │   │   ├── DepartmentDto.java
│           │   │   │   │   ├── LoginRequest.java            # 🔐 DTO Login
│           │   │   │   │   └── JwtResponse.java             # 🔐 DTO Response JWT
│           │   │   │   ├── entity/
│           │   │   │   │   ├── Employee.java
│           │   │   │   │   ├── Department.java
│           │   │   │   │   ├── User.java                    # 🔐 Entité User
│           │   │   │   │   ├── Role.java                    # 🔐 Entité Role
│           │   │   │   │   └── RoleName.java                # 🔐 Enum Roles
│           │   │   │   ├── security/                        # 🔐 Package Security
│           │   │   │   │   ├── JwtTokenProvider.java        # Génération/Validation JWT
│           │   │   │   │   ├── JwtAuthenticationFilter.java # Filtre HTTP JWT
│           │   │   │   │   ├── UserDetailsImpl.java         # UserDetails impl
│           │   │   │   │   └── UserDetailsServiceImpl.java  # Load user
│           │   │   │   ├── exception/
│           │   │   │   ├── mapper/
│           │   │   │   ├── repository/
│           │   │   │   │   ├── EmployeeRepository.java
│           │   │   │   │   ├── DepartmentRepository.java
│           │   │   │   │   ├── UserRepository.java          # 🔐 Repo User
│           │   │   │   │   └── RoleRepository.java          # 🔐 Repo Role
│           │   │   │   ├── service/
│           │   │   │   │   ├── EmployeeService.java
│           │   │   │   │   ├── DepartmentService.java
│           │   │   │   │   ├── AuthService.java             # 🔐 Service Auth
│           │   │   │   │   └── impl/
│           │   │   │   └── EmsBackendApplication.java
│           │   │   └── resources/
│           │   │       └── application.properties           # 🔐 Config JWT
│           │   └── test/
│           └── pom.xml                                      # 🔐 Dependencies Security + JWT
│
└── frontend/
    └── ems-frontend/
        ├── src/
        │   ├── app/
        │   │   ├── components/
        │   │   │   ├── login/                               # 🔐 Page Login
        │   │   │   │   ├── login.component.ts
        │   │   │   │   ├── login.component.html
        │   │   │   │   └── login.component.scss
        │   │   │   ├── unauthorized/                        # 🔐 Page 403
        │   │   │   ├── dashboard/
        │   │   │   ├── employee-list/
        │   │   │   ├── employee-form/                       # 🔐 + section compte user
        │   │   │   ├── employee-detail/
        │   │   │   ├── department-list/
        │   │   │   └── department-form/
        │   │   ├── services/
        │   │   │   ├── auth.service.ts                      # 🔐 Service Auth
        │   │   │   ├── employee.service.ts
        │   │   │   └── department.service.ts
        │   │   ├── guards/                                  # 🔐 Guards
        │   │   │   ├── auth.guard.ts                        # Protection connexion
        │   │   │   └── role.guard.ts                        # Protection rôles
        │   │   ├── interceptors/                            # 🔐 Interceptors
        │   │   │   └── auth.interceptor.ts                  # Injection JWT
        │   │   ├── directives/
        │   │   │   └── has-role.directive.ts                # 🔐 Directive *appHasRole
        │   │   ├── models/
        │   │   │   ├── employee.ts
        │   │   │   ├── department.ts
        │   │   │   └── user.ts                              # 🔐 Interfaces User/JWT
        │   │   ├── app.ts                                   # 🔐 + Logout
        │   │   ├── app.html                                 # 🔐 + Menu user
        │   │   ├── app.scss
        │   │   └── app-routing.module.ts                    # 🔐 + Guards
        │   ├── index.html
        │   └── styles.scss
        ├── package.json
        └── angular.json
```

## 🌐 API Endpoints

### 🔐 Authentification

| Méthode | Endpoint           | Protection | Description                    |
|---------|--------------------|-----------|---------------------------------|
| POST    | `/api/auth/login`  | Public    | Connexion (retourne JWT token) |

**Exemple Login :**
```bash
POST http://localhost:8080/api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}

# Réponse :
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "id": 1,
  "username": "admin",
  "email": "admin@equipepro.com",
  "roles": ["ROLE_ADMIN"],
  "firstName": "Admin",
  "lastName": "User"
}
```

### 👥 Employés

| Méthode | Endpoint                | Rôles Autorisés      | Description                            |
|---------|-------------------------|----------------------|----------------------------------------|
| GET     | `/api/employees`        | ALL                  | Récupérer tous les employés            |
| GET     | `/api/employees/{id}`   | ALL                  | Récupérer un employé par ID            |
| POST    | `/api/employees`        | ADMIN, MANAGER       | Créer un employé + compte utilisateur  |
| PUT     | `/api/employees/{id}`   | ADMIN, MANAGER       | Modifier un employé                    |
| DELETE  | `/api/employees/{id}`   | ADMIN, MANAGER       | Supprimer un employé                   |

### 🏢 Départements

| Méthode | Endpoint                  | Rôles Autorisés      | Description                      |
|---------|---------------------------|----------------------|----------------------------------|
| GET     | `/api/departments`        | ALL                  | Récupérer tous les départements  |
| GET     | `/api/departments/{id}`   | ALL                  | Récupérer un département par ID  |
| POST    | `/api/departments`        | ADMIN, MANAGER       | Créer un nouveau département     |
| PUT     | `/api/departments/{id}`   | ADMIN, MANAGER       | Modifier un département          |
| DELETE  | `/api/departments/{id}`   | ADMIN, MANAGER       | Supprimer un département         |

### 📝 Exemples de Requêtes

#### Créer un Employé avec Compte Utilisateur

```bash
POST http://localhost:8080/api/employees
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "firstName": "Jean",
  "lastName": "Dupont",
  "email": "jean.dupont@example.com",
  "departmentId": 1,
  "username": "jdupont",
  "password": "motdepasse123",
  "roles": ["ROLE_EMPLOYEE"]
}
```

#### Créer un Département

```bash
POST http://localhost:8080/api/departments
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "name": "Ressources Humaines",
  "description": "Gestion du personnel et recrutement"
}
```

> **Note :** Toutes les requêtes (sauf `/api/auth/login`) nécessitent le header `Authorization: Bearer <token>`

## 🧪 Tests

### Tests Backend

```bash
cd backend/ems-Backend-1/ems-backend

# Exécuter tous les tests
mvn test

# Exécuter les tests avec couverture
mvn clean test jacoco:report
```

### Tests Frontend

```bash
cd frontend/ems-frontend

# Exécuter les tests unitaires
npm test

# Exécuter les tests en mode watch
npm test -- --watch

# Générer le rapport de couverture
npm test -- --code-coverage
```

## 📸 Captures d'Écran

### 🔐 Page de Connexion
- Design moderne avec thème sombre
- Logo animé avec effet de pulsation
- Cercles flottants en arrière-plan
- Effets glassmorphism
- Validation en temps réel
- Identifiants par défaut affichés

### 📊 Dashboard
- Cartes statistiques (Total Employés, Départements, Employés Assignés, Statut)
- Menu utilisateur avec nom et email
- Bouton de déconnexion
- Liste des employés récents
- Actions rapides selon les permissions
- Répartition par département avec barres de progression

### 👥 Liste des Employés
- Tableau avec pagination et tri
- Recherche en temps réel
- Sélection multiple
- Actions conditionnelles selon le rôle :
  - **Admin/Manager** : Voir, Modifier, Supprimer, Exporter CSV
  - **Employee** : Voir uniquement
- Badge de département

### ✏️ Formulaire Employé (Création)
- Section "Informations personnelles" (Prénom, Nom, Email, Département)
- **Section "Compte utilisateur"** (visible uniquement en mode création) :
  - Nom d'utilisateur
  - Mot de passe
  - Rôle (menu déroulant : Admin, Manager, Employé)
- Validation en temps réel
- Indicateurs de caractères

### 🏢 Gestion des Départements
- Liste des départements avec nombre d'employés
- Création et modification (Admin/Manager uniquement)
- Suppression protégée (impossible si employés assignés)
- Validation des contraintes

### ⛔ Page Non Autorisé (403)
- Message d'erreur clair
- Bouton de retour au dashboard
- Design cohérent avec le thème

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

# Rebuild après modifications (important!)
mvn clean install
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

# Clear cache npm (si problèmes)
npm cache clean --force
```

## 🐛 Résolution de Problèmes

### ❌ Erreur : "Port 8080 already in use"

**Solution :** Un autre processus utilise le port 8080.

```bash
# Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:8080 | xargs kill -9
```

### ❌ Erreur : "Access denied for user 'root'@'localhost'"

**Solution :** Vérifier les identifiants MySQL dans `application.properties`.

### ❌ Erreur : "403 Forbidden" après login

**Solutions :**

1. **Vider le localStorage et reconnecter :**
```javascript
// Dans la console du navigateur (F12)
localStorage.clear()
// Puis rechargez la page et reconnectez-vous
```

2. **Vérifier que le backend a été rebuild :**
```bash
cd backend/ems-Backend-1/ems-backend
mvn clean install
# Redémarrez le backend
```

3. **Vérifier le token JWT dans la console :**
```javascript
// Dans la console (F12)
const token = localStorage.getItem('token');
const payload = JSON.parse(atob(token.split('.')[1]));
console.log(payload);
// Vérifiez que vous avez bien les rôles (ROLE_ADMIN, etc.)
```

### ❌ Erreur Frontend : "Cannot GET /api/..."

**Solution :**
1. Vérifier que le backend est démarré sur le port 8080
2. Vérifier le proxy dans `proxy.conf.json`
3. Redémarrer le frontend : `npm start`

### ❌ Erreur : "Table 'equipepro.users' doesn't exist"

**Solution :**
1. Vérifier que `spring.jpa.hibernate.ddl-auto=update` est dans `application.properties`
2. Redémarrer le backend pour créer les tables automatiquement
3. Les tables créées : `employee`, `department`, `users`, `roles`, `user_roles`

### ❌ Erreur : "JWT signature does not match"

**Solution :**
1. Le secret JWT a changé → vider localStorage et reconnecter
2. Vérifier que `app.jwt.secret` est identique dans `application.properties`

### ❌ Warning Angular : "NG8113: HasRoleDirective is not used"

**Solution :** Ce warning a été corrigé. Si vous le voyez encore, vérifiez que vous avez la dernière version du code.

## 🚀 Déploiement en Production

### Checklist Sécurité

- [ ] Changer le secret JWT (`app.jwt.secret`) avec une clé forte
- [ ] Changer les identifiants admin par défaut
- [ ] Configurer HTTPS/TLS
- [ ] Activer les httpOnly cookies au lieu de localStorage
- [ ] Implémenter les refresh tokens
- [ ] Configurer CORS pour le domaine de production uniquement
- [ ] Désactiver `spring.jpa.show-sql=true`
- [ ] Utiliser des variables d'environnement pour les secrets
- [ ] Configurer un système de logs
- [ ] Mettre en place des rate limiting

### Build Production

**Backend :**
```bash
mvn clean package -DskipTests
java -jar target/equipepro-backend-0.0.1-SNAPSHOT.jar
```

**Frontend :**
```bash
ng build --configuration production
# Les fichiers sont dans dist/ems-frontend/browser/
```

## 📄 Documentation

- [Plan de Présentation](PRESENTATION_PLAN.md) - Slides pour présenter le projet
- [Script de Présentation](SCRIPT_PRESENTATION.md) - Script détaillé (10 minutes)
- [Aide-Mémoire](AIDE_MEMOIRE_PRESENTATION.md) - Points clés à retenir
- [Rapport LaTeX](rapport_equipepro.tex) - Rapport technique complet

## 📝 Licence

Ce projet est sous licence MIT. Vous êtes libre de l'utiliser, le modifier et le distribuer.

## 👨‍💻 Auteur

**Développé par CHOU Naima**
Encadré par Prof. KHAMLICHI IDRISSI Younes

Développé avec ❤️ en utilisant Spring Boot, Angular, JWT et Spring Security.

---

## 🎯 Roadmap / Améliorations Futures

### Court Terme
- [ ] Implémenter les refresh tokens
- [ ] Migration vers httpOnly cookies
- [ ] Export PDF des rapports
- [ ] Pagination côté frontend (virtual scrolling)

### Moyen Terme
- [ ] Authentification à deux facteurs (2FA)
- [ ] Upload et gestion de photos d'employés
- [ ] Notifications en temps réel (WebSocket)
- [ ] Gestion des congés et absences
- [ ] Organigramme visuel interactif

### Long Terme
- [ ] Architecture microservices
- [ ] Système de workflow d'approbation
- [ ] Intégration Active Directory / LDAP
- [ ] Application mobile (React Native / Flutter)
- [ ] Tableau de bord analytique avec Charts.js

---

**EquipePro** - Gérez vos équipes efficacement et en toute sécurité ! 🚀🔐
