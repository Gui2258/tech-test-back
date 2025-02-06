# Technical Test Backend

This is a backend technical test project that provides a REST API service.

## Prerequisites

- Node.js
- Docker and Docker Compose
- npm or yarn

## Getting Started

1. Clone this repository
2. Copy the environment variables file:

```bash
cp .env.example .env
```
3. Setup the database (you can use your own datababase):
```bash
docker-compose up -d
```
4. Install dependencies:
```bash
npm install     
```
5. Execute the application:
```bash
npm run start:dev
```
1. The API will be available at:
  - http://localhost:3000/api/swagger

2. For test execution :
```bash
npm run test
```