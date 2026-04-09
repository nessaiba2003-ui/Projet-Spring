# 🚀 Système de Gestion de Suivi de Projets (SGSP)

> **Projet Académique - Module Développement Framework Spring Boot - JEE**  
> Une solution robuste pour la gestion des organismes, le suivi des phases de projets et la facturation automatisée.

---

## 📌 Présentation du Projet
Ce projet a été conçu pour répondre aux besoins réels d'une organisation gérant plusieurs projets simultanés. L'objectif est de digitaliser le cycle de vie complet d'un projet : de la collaboration avec un **Organisme** partenaire jusqu'au calcul automatisé de la **Facturation** par phase.

### ✨ Fonctionnalités Majeures
*   **Gestion Multicritères** : Administration complète des Organismes, Projets et Employés.
*   **Découpage Opérationnel** : Structuration des projets en **Phases** (Analyse, Développement, Test) avec gestion des livrables associés.
*   **Suivi des Affectations** : Gestion dynamique des employés sur chaque phase avec suivi des dates de début et de fin (Clés composées JPA).
*   **Moteur de Facturation** : Calcul automatique des montants basés sur l'achèvement des livrables par phase.
*   **Sécurité Granulaire** : Système d'accès restreint selon le rôle (Directeur, Chef de projet, Comptable, Secrétaire, Administrateur).

---

## 🏗️ Architecture du Projet
L'application suit une **Architecture en Couches** standard, garantissant une séparation claire des responsabilités, facilitant la maintenance et les tests :

*.  **Couche API (Controllers)** : Points d'entrée de l'application. Reçoivent les requêtes JSON, gèrent les codes de retour HTTP (200, 201, 403, etc.) et communiquent avec la couche Service.
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
  <img src= "" alt="Structure IntelliJ" width="850" height="200">
  <br><em>Packages organisés, configuration du pom.xml et classe Main.</em>
</p>

### 📄 2. Documentation Interactive avec Swagger
Le projet expose une documentation vivante accessible via OpenAPI.
<p align="center">
  <img src="URL_DE_TA_CAPTURE_SWAGGER" alt="Swagger UI" width="850">
  <br><em>Liste complète des endpoints et modèles de données testables en direct.</em>
</p>

### 🧪 3. Tests des API REST (Postman)
Validation des flux de données et des réponses JSON.
<p align="center">
  <img src="URL_DE_TA_CAPTURE_POSTMAN" alt="Tests Postman" width="850">
  <br><em>Test réussi : Création d'une phase de projet avec retour 201 Created.</em>
</p>

### 🛡️ 4. Validation de la Sécurité JWT
Preuve du fonctionnement des filtres de sécurité.
<p align="center">
  <img src="URL_DE_TA_CAPTURE_SECURITY_TEST" alt="Test Sécurité" width="850">
  <br><em>Capture montrant le blocage d'une requête sans Token Bearer.</em>
</p>



## 📑 Documentation de l'API (Endpoints principaux)
Voici un aperçu des points d'entrée développés et testés sous Postman :


| Méthode | Endpoint | Description | Accès Autorisé |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Authentification et génération du JWT | Public |
| `GET` | `/api/projets` | Liste tous les projets en cours | Tous les rôles |
| `POST` | `/api/projets` | Création d'un nouveau projet | Chef de projet / Admin |
| `GET` | `/api/factures/{id}` | Générer la facture détaillée d'une phase | Comptable / Directeur |
| `PUT` | `/api/affectations` | Assigner un employé à une phase spécifique | Admin |

---

## 🛠️ Conception & Modélisation
Le projet respecte rigoureusement les diagrammes UML élaborés en amont (Packages `organisation`, `projet`, `facturation`).

### Défis techniques relevés :
*   **Clés Composées** : Utilisation de `@Embeddable` et `@EmbeddedId` pour la table de liaison `LigneEmployePhase` (Relation Ternaire).
*   **Validation** : Mise en place de `Bean Validation` (JSR-303) pour assurer l'intégrité des données entrantes.
*   **Mappage Complexe** : Gestion des cycles de vie des entités liées (Cascade types).


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




