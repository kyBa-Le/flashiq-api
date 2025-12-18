# ENOSTA PROJECT: FlashIQ
A platform that helps learners memorize English vocabulary through flashcards and immediately apply that vocabulary in automatically generated reading contexts (using AI).

## 🛠️ Installation for Backend development

### Step 1: Clone repository
```
git clone https://github.com/CongDoan0806/flashiq-api
```

### Step 2: Install project dependencies
```
npm install
```

### Step 3: Backend Database Setup

We will use **Docker** to create and run the **PostgreSQL** database instance.

#### 🐳 3.1. Run the Docker Container.

Execute the following command in your terminal. This command will pull the `postgres:latest` image (if not already present), create a container named `my-postgres-db-fixed`, and initialize the database `flashiqdb`.

```bash
docker run --name my-postgres-db-fixed `
-e POSTGRES_USER=postgres `
-e POSTGRES_PASSWORD=flashiq123 `
-e POSTGRES_DB=flashiqdb `
-e POSTGRES_HOST_AUTH_METHOD=trust `
-p 5432:5432 `
-d postgres:latest
```
#### ⚙️ 3.2. After running successfully, create a `.env` file in the root folder and update the environment variables.

```
DATABASE_URL="postgresql://root:flashiq123@localhost:5432/flashiqdb?createDatabaseIfNotExist=yes
```
#### 🔄 3.3. After completing the above steps, open the project terminal and run.

``` 
npx prisma generate
```

### Step 4: Redis Setup for Rate Limiting

We will use **Docker** to run **Redis** for rate limiting functionality.

#### 🐳 4.1. Run Redis Docker Container

```bash
docker run --name redis-server -p 6379:6379 -d redis:latest
```

#### 🔄 4.2. Start Redis (if stopped)

```bash
docker start redis-server
```

#### ✅ 4.3. Verify Redis is running

```bash
docker exec -it redis-server redis-cli ping
```
Should return `PONG` if Redis is working correctly.


## 🚀 Quick run using Docker compose
You should have the Docker desktop and it is running

### Run this command in your project terminal
```
docker compose up --build
```
After run successfully, the application run on ```localhost:3000```
##

## 🚀 Development Commands

### Start Development Server
```bash
npm run dev
```

### Build Project
```bash
npm run build
```

### Code Quality & Formatting
```bash
# Check for linting errors
npm run lint

# Auto-fix linting errors
npm run lint:fix

# Format code with Prettier
npm run format

# Check code formatting
npm run format:check
```

### Database Commands
```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# View database in Prisma Studio
npx prisma studio
```

## 📚 API Documentation
Access ```localhost:3000/api-docs``` on your browser to see Swagger API documentation
