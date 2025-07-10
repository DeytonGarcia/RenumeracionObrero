FROM maven:3.9.6-eclipse-temurin-17-alpine
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=0 /app/target/hackaton-0.0.1-SNAPSHOT.jar app.jar
ENV PORT=8087
EXPOSE ${PORT}
ENTRYPOINT ["java", "-jar", "/app/app.jar"]