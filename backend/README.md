# NeverLucky Backend

Spring Boot backend for the NeverLucky card game application.

## Environment Setup

### Development Environment (Local)

To run the application locally with H2 in-memory database:

```bash
# Navigate to the backend directory
cd backend

# Run with development profile (uses H2 database)
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev

# Or run with default profile (also uses H2)
./mvnw spring-boot:run
```

The application will be available at:
- API: http://localhost:8081
- H2 Console: http://localhost:8081/h2-console

**H2 Console Credentials:**
- JDBC URL: `jdbc:h2:mem:testdb`
- Username: `sa`
- Password: (empty)

### Production Environment

The application is configured to use PostgreSQL in production. When deployed to Render:

1. A PostgreSQL database service is automatically created
2. Environment variables are automatically configured
3. The application uses the `prod` profile by default

### Environment Variables

#### Development
```bash
SPRING_PROFILES_ACTIVE=dev
PORT=8081
DATABASE_URL=jdbc:h2:mem:testdb
DB_USER=sa
DB_PASSWORD=
JWT_SECRET=your-jwt-secret-key
```

#### Production
```bash
SPRING_PROFILES_ACTIVE=prod
PORT=8080
DATABASE_URL=jdbc:postgresql://localhost:5432/neverlucky
DB_USER=postgres
DB_PASSWORD=your-db-password
JWT_SECRET=your-production-jwt-secret
```

## Database Configuration

### H2 (Development)
- In-memory database
- Auto-creates schema on startup
- H2 console available for debugging
- No external database setup required

### PostgreSQL (Production)
- Persistent database
- Schema updates via Hibernate
- Connection pooling with HikariCP
- Configured via environment variables

## Docker

### Local Development
```bash
# Build the image
docker build -t neverlucky-backend .

# Run with development profile
docker run -p 8081:8081 -e SPRING_PROFILES_ACTIVE=dev neverlucky-backend
```

### Production
```bash
# Run with production profile (requires PostgreSQL)
docker run -p 8080:8080 \
  -e SPRING_PROFILES_ACTIVE=prod \
  -e DATABASE_URL=jdbc:postgresql://localhost:5432/neverlucky \
  -e DB_USER=postgres \
  -e DB_PASSWORD=your-password \
  -e JWT_SECRET=your-jwt-secret \
  neverlucky-backend
```

## API Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/users` - Get all users (requires authentication)
- `GET /api/auth/user/{id}` - Get user by ID (requires authentication)

## CORS Configuration

The application supports CORS for frontend applications. Configure allowed origins via:

- `FRONTEND_URL` - Single frontend URL
- `FRONTEND_URLS` - Comma-separated list of allowed URLs

## JWT Authentication

JWT tokens are used for authentication. Configure via:

- `JWT_SECRET` - Secret key for signing tokens
- `JWT_EXPIRATION` - Token expiration time in milliseconds (default: 24 hours)

## Troubleshooting

### Connection Issues
If you encounter database connection issues:

1. **Development**: Ensure H2 dependencies are in pom.xml
2. **Production**: Verify PostgreSQL is running and accessible
3. **Docker**: Check environment variables are properly set

### Port Conflicts
Change the port via:
- `PORT` environment variable
- `server.port` property in application configuration

### Missing Dependencies
Ensure all required dependencies are in `pom.xml`:
- Spring Boot Starter Web
- Spring Boot Starter Data JPA
- H2 Database (development)
- PostgreSQL Driver (production)
- Spring Security
- JWT dependencies