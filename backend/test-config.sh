#!/bin/bash

echo "=== NeverLucky Backend Configuration Test ==="
echo ""

# Check if application files exist
echo "1. Checking application configuration files:"
if [ -f "src/main/resources/application.properties" ]; then
    echo "   ✓ application.properties exists"
else
    echo "   ✗ application.properties missing"
fi

if [ -f "src/main/resources/application-dev.yml" ]; then
    echo "   ✓ application-dev.yml exists"
else
    echo "   ✗ application-dev.yml missing"
fi

if [ -f "src/main/resources/application-prod.yml" ]; then
    echo "   ✓ application-prod.yml exists"
else
    echo "   ✗ application-prod.yml missing"
fi

echo ""
echo "2. Checking Docker configuration:"
if [ -f "Dockerfile" ]; then
    echo "   ✓ Dockerfile exists"
else
    echo "   ✗ Dockerfile missing"
fi

echo ""
echo "3. Checking Maven configuration:"
if [ -f "pom.xml" ]; then
    echo "   ✓ pom.xml exists"
else
    echo "   ✗ pom.xml missing"
fi

echo ""
echo "4. Checking Render configuration:"
if [ -f "../../render.yaml" ]; then
    echo "   ✓ render.yaml exists"
else
    echo "   ✗ render.yaml missing"
fi

echo ""
echo "=== Configuration Summary ==="
echo "The application is configured to:"
echo "- Use H2 database for development (application-dev.yml)"
echo "- Use PostgreSQL for production (application-prod.yml)"
echo "- Support environment-based profile selection (Dockerfile)"
echo "- Deploy with PostgreSQL database service (render.yaml)"
echo ""
echo "To run locally with H2 database:"
echo "  cd backend"
echo "  ./mvnw spring-boot:run -Dspring-boot.run.profiles=dev"
echo ""
echo "To run with production profile:"
echo "  cd backend"
echo "  ./mvnw spring-boot:run -Dspring-boot.run.profiles=prod"
echo "  (Requires PostgreSQL database)"