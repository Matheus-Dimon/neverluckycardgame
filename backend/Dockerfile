FROM eclipse-temurin:17-jre-focal

ARG JAR_FILE=target/*.jar
WORKDIR /app
COPY ${JAR_FILE} app.jar
EXPOSE ${PORT:-8080}
ENV JAVA_OPTS="-Xms512m -Xmx1024m"
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar /app/app.jar --spring.profiles.active=prod"]
