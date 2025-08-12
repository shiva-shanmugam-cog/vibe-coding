# syntax=docker/dockerfile:1
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app
COPY . .
RUN mvn -q -DskipTests -pl agents/fraud-detection-agent -am package

FROM eclipse-temurin:17-jre
ENV JAVA_OPTS=""
WORKDIR /app
COPY --from=build /app/agents/fraud-detection-agent/target/*-SNAPSHOT.jar /app/app.jar
EXPOSE 8083
ENTRYPOINT ["sh","-c","java $JAVA_OPTS -jar /app/app.jar"] 