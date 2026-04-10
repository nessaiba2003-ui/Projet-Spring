FROM eclipse-temurin:21-jdk AS build
WORKDIR /app

# Copier les fichiers du wrapper et le pom.xml
COPY .mvn/ .mvn
COPY mvnw pom.xml ./

# Donner les droits d'exécution au script wrapper
RUN chmod +x mvnw

# Télécharger les dépendances
RUN ./mvnw dependency:go-offline

# Copier le code source et construire le JAR
COPY src ./src
RUN ./mvnw clean package -DskipTests

# Image finale
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 9090
ENTRYPOINT ["java", "-jar", "app.jar"]

