# syntax=docker/dockerfile:1
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app
COPY . .
RUN mvn -q -DskipTests -pl agent-gateway -am package

FROM eclipse-temurin:17-jre
ENV JAVA_OPTS=""
# Create non-root user
RUN groupadd -g 10001 vibe && useradd -u 10001 -g vibe -s /sbin/nologin -m vibe
WORKDIR /app
RUN mkdir -p /app && chown -R vibe:vibe /app
COPY --from=build /app/agent-gateway/target/*-SNAPSHOT.jar /app/app.jar
RUN chown vibe:vibe /app/app.jar
USER vibe:vibe
EXPOSE 8080
ENTRYPOINT ["sh","-c","java $JAVA_OPTS -jar /app/app.jar"] 