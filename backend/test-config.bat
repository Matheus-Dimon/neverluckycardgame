@echo off
echo === NeverLucky Backend Configuration Test ===
echo.

echo 1. Checking application configuration files:
if exist "src\main\resources\application.properties" (
    echo    ✓ application.properties exists
) else (
    echo    ✗ application.properties missing
)

if exist "src\main\resources\application-dev.yml" (
    echo    ✓ application-dev.yml exists
) else (
    echo    ✗ application-dev.yml missing
)

if exist "src\main\resources\application-prod.yml" (
    echo    ✓ application-prod.yml exists
) else (
    echo    ✗ application-prod.yml missing
)

echo.
echo 2. Checking Docker configuration:
if exist "Dockerfile" (
    echo    ✓ Dockerfile exists
) else (
    echo    ✗ Dockerfile missing
)

echo.
echo 3. Checking Maven configuration:
if exist "pom.xml" (
    echo    ✓ pom.xml exists
) else (
    echo    ✗ pom.xml missing
)

echo.
echo 4. Checking Render configuration:
if exist "..\..\render.yaml" (
    echo    ✓ render.yaml exists
) else (
    echo    ✗ render.yaml missing
)

echo.
echo === Configuration Summary ===
echo The application is configured to:
echo - Use H2 database for development (application-dev.yml)
echo - Use PostgreSQL for production (application-prod.yml)
echo - Support environment-based profile selection (Dockerfile)
echo - Deploy with PostgreSQL database service (render.yaml)
echo.
echo To run locally with H2 database:
echo   cd backend
echo   ./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
echo.
echo To run with production profile:
echo   cd backend
echo   ./mvnw spring-boot:run -Dspring-boot.run.profiles=prod
echo   (Requires PostgreSQL database)