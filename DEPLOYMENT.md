# NeverLucky Deployment Guide

This guide explains how to deploy the NeverLucky application with the backend on Render and frontend on Vercel.

## Architecture

- **Backend**: Spring Boot API deployed on Render
- **Frontend**: React/Vite application deployed on Vercel
- **Communication**: HTTP via environment variables

## Backend Deployment (Render)

### 1. Environment Variables

Set these environment variables in your Render dashboard:

```
SPRING_PROFILES_ACTIVE: prod
DATABASE_URL: your-postgres-connection-string
DB_USER: your-db-username
DB_PASSWORD: your-db-password
FRONTEND_URL: https://your-frontend.vercel.app
FRONTEND_URLS: http://localhost:3000,http://localhost:5173
```

**Important:** Do not set PORT manually - Render will override this automatically.

**Database Connection String Format:**
```
jdbc:postgresql://hostname:port/database_name
```

**Example for Render PostgreSQL:**
```
DATABASE_URL: jdbc:postgresql://your-db.internal:5432/neverlucky
DB_USER: postgres
DB_PASSWORD: your-secure-password
```

### 2. Build Configuration

- **Build Command**: `mvn clean package -DskipTests`
- **Start Command**: `java -jar target/*.jar --spring.profiles.active=prod`
- **Plan**: Free tier is available

### 3. Database

Set up a PostgreSQL database on Render or use an external provider.

## Frontend Deployment (Vercel)

### 1. Environment Variables

Set these environment variables in your Vercel dashboard:

```
VITE_API_BASE_URL: https://your-backend.onrender.com/api
```

### 2. Build Configuration

- **Framework Preset**: Other
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 3. Local Development

For local development, copy `.env.local.example` to `.env.local` and set:

```
VITE_API_BASE_URL=http://localhost:8080/api
```

## CORS Configuration

The backend is configured to accept requests from:
- Your Vercel frontend URL
- localhost:3000 (common React dev port)
- localhost:5173 (common Vite dev port)
- Any additional URLs via FRONTEND_URLS environment variable

## Testing

1. Deploy backend to Render
2. Get the backend URL (e.g., `https://your-backend.onrender.com`)
3. Deploy frontend to Vercel with the backend URL in VITE_API_BASE_URL
4. Test the connection between frontend and backend

## Troubleshooting

### Backend Issues
- Check that PORT environment variable is set correctly
- Verify database connection string
- Ensure CORS configuration includes your frontend URL

### Frontend Issues
- Verify VITE_API_BASE_URL is set correctly
- Check browser console for CORS errors
- Ensure the backend is running and accessible

### Common Issues
- **CORS errors**: Check that your frontend URL is in the allowed origins
- **Connection refused**: Verify backend URL and that the service is running

### Database-Specific Issues

#### 1. Database Connection Failed
**Error**: `Connection refused` or `Unable to acquire JDBC Connection`
**Solution**: 
- Verify DATABASE_URL is correctly formatted
- Ensure database is accessible from Render
- Check DB_USER and DB_PASSWORD are correct
- Test connection string independently

#### 2. Authentication Failed
**Error**: `Access denied for user` or `password authentication failed`
**Solution**:
- Verify DB_USER and DB_PASSWORD environment variables
- Ensure database user has proper permissions
- Check if database requires SSL connection

#### 3. Database Not Found
**Error**: `Database "neverlucky" does not exist`
**Solution**:
- Create the database manually in PostgreSQL
- Ensure database name matches DATABASE_URL
- Verify database user has CREATE permissions

#### 4. Connection Pool Exhausted
**Error**: `HikariPool-1 - Connection is not available`
**Solution**:
- Increase connection pool size in application-prod.yml
- Check for connection leaks in application code
- Monitor database connection usage

#### 5. Schema Update Issues
**Error**: `Table already exists` or `Column not found`
**Solution**:
- Set `spring.jpa.hibernate.ddl-auto: update` (current setting)
- Manually run database migrations if needed
- Check entity mappings match database schema
