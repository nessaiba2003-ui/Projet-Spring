# 🚀 Système de Gestion de Suivi de Projets (SGSP)

> **Projet Académique - Module Développement Framework Spring Boot - JEE**  
> Une solution robuste pour la gestion des organismes, le suivi des phases de projets et la facturation automatisée.

---

<p align="center">
  <img src="https://img.shields.io/badge/Spring_Boot-3.2-6DB33F?style=for-the-badge&logo=springboot&logoColor=white" />
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white" />
  <img src="https://img.shields.io/badge/JWT-Auth-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" />
  <img src="https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white" />
  <img src="https://img.shields.io/badge/Prometheus_%2B_Grafana-E65C8A?style=for-the-badge&logo=prometheus&logoColor=white" />
</p>

---

## 📌 Présentation du Projet
Ce projet a été conçu pour répondre aux besoins réels d'une organisation gérant plusieurs projets simultanés. L'objectif est de digitaliser le cycle de vie complet d'un projet : de la collaboration avec un **Organisme** partenaire jusqu'au calcul automatisé de la **Facturation** par phase.

--- 

## ✨ Fonctionnalités Majeures

| Module | Fonctionnalités |
|--------|----------------|
| 🏢 **Organismes** | CRUD complet, recherche multicritère (nom, code, contact), validation stricte |
| 👥 **Employés** | Gestion profils, unicité (matricule/login/email), écran disponibilité périodique |
| 📁 **Projets** | Création avec organisme/chef projet, contrôle dates, état dynamique, résumé projet |
| 🔄 **Phases** | Découpage temporel, suivi % réalisation/montant, règles métier (somme ≤ projet) |
| 🔗 **Affectations** | Clé composée (`@EmbeddedId`), contrôle disponibilité, historique par employé |
| 📦 **Livrables** | Liaison phase, upload fichiers, suivi statut, traçabilité |
| 📄 **Documents** | Métadonnées, aperçu, téléchargement sécurisé, gestion versions |
| 💰 **Factures** | Génération depuis phase terminée, statuts (facturé/payé), cohérence comptable |
| 📊 **Reporting** | KPIs, phases non facturées, projets en cours/clôturés, filtres dynamiques |
| 🔐 **Sécurité** | JWT stateless, rôles hiérarchisés, routes protégées, menu dynamique par profil |



---

## 🏗️ Architecture du Projet
L'application suit une **Architecture en Couches** standard, garantissant une séparation claire des responsabilités, facilitant la maintenance et les tests :

┌─────────────────────────────────────────────┐  
│ 🌐 Frontend (React 18 + Vite + Tailwind) │   
│ • Axios + Interceptors JWT │  
│ • React Router + PrivateRoute/RoleRoute │  
│ • Context API / Redux + React Hook Form │   
└──────────────┬──────────────────────────────┘  
│ HTTPS / JSON      
▼    
┌─────────────────────────────────────────────┐    
│ 🔐 API Gateway - Spring Boot 3.2 (Java 21) │   
│ • Spring Security 6 + JWT Filter │    
│ • @RestController + DTO Pattern │   
│ • @ControllerAdvice + @Valid │   
└──────────────┬──────────────────────────────┘   
│ Couche Service (@Transactional)     
▼   
┌─────────────────────────────────────────────┐  
│ ⚙️ Business Logic & Validation │  
│ • Règles métier & calculs facturation │  
│ • MapStruct (Entity ↔ DTO) │  
│ • Exceptions métier personnalisées │  
└──────────────┬──────────────────────────────┘  
│ Spring Data JPA  
▼  
┌─────────────────────────────────────────────┐   
│ 🗄️ Data Access Layer │  
│ • Repositories JPA + requêtes métier │  
│ • Relations @OneToMany/@ManyToMany │  
│ • Clé composée @Embeddable + @EmbeddedId │  
└──────────────┬──────────────────────────────┘  
▼  
┌─────────────────────────────────────────────┐  
│ 🗃️ MySQL 8.0 + Docker Compose │  
│ • Prometheus + Grafana (Monitoring) │  
└─────────────────────────────────────────────┘  


*   **Couche API (Controllers)** : Points d'entrée de l'application. Reçoivent les requêtes JSON, gèrent les codes de retour HTTP (200, 201, 403, etc.) et communiquent avec la couche Service.
*   **Couche Service (Business Logic)** : Contient toute la logique métier, les calculs de facturation et les règles de gestion.
*   **Couche Data Access (Repositories)** : Interface avec la base de données via Spring Data JPA.
*   **Couche Modèle (Entities)** : Représentation des tables de la base de données (Organisme, Projet, Phase, Employé, etc.).
*   **Couche Sécurité** : Gestion de l'authentification et des autorisations via Spring Security et JWT.
*   **Backend (Spring Boot )** : API REST sécurisée, gérant la logique métier et l'exposition des métriques de santé.
*   **Frontend (React 18 + Vite)** : Interface utilisateur dynamique et réactive, développée avec Tailwind CSS pour un design moderne.
*   **Infrastructure (Docker)** : Orchestration de services pour le monitoring (Prometheus/Grafana) et la base de données.
*   **Monitoring (Observabilité)** : Collecte de données en temps réel sur l'état de la JVM et des performances de l'API.

---

## 🔐 Focus : Sécurité et Authentification (JWT)
Pour ce projet, nous avons implémenté une couche de sécurité moderne basée sur les **Tokens JWT** pour assurer des communications sécurisées entre le client et le serveur :
1.  **Authentification Stateless** : Le serveur ne stocke pas de session, rendant l'application plus légère et scalable.
2.  **Gestion des Rôles (RBAC)** : Utilisation des annotations `@PreAuthorize` pour restreindre les méthodes sensibles (ex: Seul le Comptable peut valider une facture).
3.  **Filtre de Sécurité personnalisé** : Extraction du token de l'entête HTTP `Authorization` à chaque requête pour valider l'identité.
4.  **Protection des Routes** : Toute tentative d'accès sans token valide renvoie une erreur `401 Unauthorized`.
---

## 📊 Monitoring & Observabilité (Docker Stack)
Nous avons mis en place une stack de monitoring complète pour assurer la haute disponibilité du système :

*   **Prometheus** : Serveur de collecte qui "scrape" les métriques exposées par l'endpoint `/actuator/prometheus` du backend.
*   **Grafana** : Interface de visualisation connectée à Prometheus.
    *   *Dashboard utilisé* : JVM Micrometer (ID: 4701).
    *   *Indicateurs suivis* : Utilisation CPU, Consommation RAM (Heap Memory), Taux de réussite des requêtes HTTP, Nombre de threads actifs.

> **Accès** : Grafana est accessible sur le port `3001` après le lancement du Docker Compose.


---
## 📸 Démonstration Technique

### 🛠️ 1. Initialisation & Configuration (IntelliJ IDEA)
Démonstration de la structure du projet sous Java 21 avec Maven.
<p align="center">
  <br><em>Packages organisés, configuration du pom.xml et classe Main.</em>
</p>

### 📄 2. Documentation Interactive avec Swagger
Le projet expose une documentation vivante accessible via OpenAPI.
<p align="center">
  <br><em>Liste complète des endpoints et modèles de données testables en direct.</em>
</p>

### 🧪 3. Tests des API REST (Postman)
Validation des flux de données et des réponses JSON.
<p align="center">
  <br><em>Test réussi : Création d'une phase de projet avec retour 201 Created.</em>
</p>

### 🛡️ 4. Validation de la Sécurité JWT
Preuve du fonctionnement des filtres de sécurité.
<p align="center">
  <br><em>Capture montrant le blocage d'une requête sans Token Bearer.</em>
</p>



## 📑 Documentation de l'API (Endpoints principaux)
Voici un aperçu des points d'entrée développés et testés sous Postman :



### 👥 Matrice des Rôles & Permissions
| Rôle | Accès Autorisés | Restrictions |
|------|-----------|----------|
| 👑 **Administrateur** |Tous les modules, gestion employés/utilisateurs | Aucun | 
| 📋 **Secrétaire** | Organismes, projets, consultation générale | Pas de facturation, pas de suppression critique | 
| 🎯 **Directeur** |Dashboard, reporting, suivi global, validation stratégique | Pas de modification technique directe |
| 👨‍💻 **Chef Projet** | Phases, affectations, livrables, documents de ses projets | Uniquement projets assignés |
| 💼 **Comptable** | Factures, paiements, reporting financier | Lecture seule sur autres modules |

> 🔒 **Principe de défense en profondeur** : Le frontend masque les actions non autorisées, mais Spring Security reste la seule source de vérité pour les autorisations réelles.

---

## 📡 API & Endpoints (OpenAPI/Swagger)

| Méthode | Endpoint | Description | Accès |
|---------|----------|-------------|-------|
| `POST` | `/api/auth/login` | Authentification & génération JWT | 🔓 Public |
| `GET` | `/api/auth/me` | Profil utilisateur connecté | 🔐 Auth |
| `POST` | `/api/auth/change-password` | Modification mot de passe | 🔐 Auth |
| `GET` | `/api/organismes` | Liste organismes (paginée + filtres) | Secrétaire+ |
| `POST` | `/api/projets` | Création projet + validation dates | Chef/Admin |
| `GET` | `/api/projets/{id}/phases` | Phases d'un projet | Chef/Admin |
| `PATCH` | `/api/phases/{id}/facturation` | Marquer une phase comme facturée | Comptable |
| `POST` | `/api/phases/{id}/facture` | Génération facture depuis phase | Comptable |
| `GET` | `/api/reporting/tableau-de-bord` | Métriques globales KPIs | Directeur+ |
| `GET` | `/api/documents/{id}/download` | Téléchargement sécurisé | Rôle autorisé |

📚 **Documentation Interactive** : `http://localhost:9090/swagger-ui/index.html`

---

## 📊 Dashboard & Reporting

### 🎯 Indicateurs Visualisés

---

## 🛠️ Conception & Modélisation
Le projet respecte rigoureusement les diagrammes UML élaborés en amont (Packages `organisation`, `projet`, `facturation`).

### Défis techniques relevés :
*   **Clés Composées** : Utilisation de `@Embeddable` et `@EmbeddedId` pour la table de liaison `LigneEmployePhase` (Relation Ternaire).
*   **Validation** : Mise en place de `Bean Validation` (JSR-303) pour assurer l'intégrité des données entrantes.
*   **Mappage Complexe** : Gestion des cycles de vie des entités liées (Cascade types).

---

🔍 Filtres Disponibles
🗓️ Période personnalisée (date début/fin)
🏢 Organisme / Chef de projet
📊 État : En cours / Terminé / Facturé / Payé
👥 Employé affecté

---


--- 


## 🚀 Installation et Démarrage
1. **Configuration DB** : Modifier le fichier `src/main/resources/application.properties`(URL DB, login/pass).
2. **Explorer** : Ouvrir `http://localhost:8080/swagger-ui/index.html`.
3. **Build & Run** :
   ```bash
   mvn clean install
   mvn spring-boot:run
⚙️ Lancement du Backend
cd backend
mvn spring-boot:run
💻 Lancement du Frontend (React)
cd frontend
npm install
npm run dev
### 🐳 Lancement de l'Infrastructure (Monitoring)
Assurez-vous que Docker Desktop est lancé, puis à la racine du projet :
```bash
docker-compose up -d

Endpoints clés :
Frontend : http://localhost:5173
Backend : http://localhost:9090
Grafana : http://localhost:3001

## 👥 Équipe de Développement
*   **Hafsa Belahnech & Nessaiba Messaadiyene** 




