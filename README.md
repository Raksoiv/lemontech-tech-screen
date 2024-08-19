# NotyFutbol

NotyFutbol is an API built using TypeScript and the NestJS framework. It provides live score data and allows users to subscribe to teams and receive notifications about match events.

## Features

- Simple Sign Up: Requires only email and password.
- Global Team Search: Find teams from around the world.
- Team Subscriptions: Subscribe to any team and receive notifications.
- Notification Management: Pull and view notifications about subscribed teams.


## Planned Features
- League and Competition Subscriptions: Subscribe to leagues and competitions for broader coverage.
- Team, League, and Competition Statistics: Review detailed statistics.
- Improved Quality Assurance: Implement a testing suite for comprehensive checks.
- Continuous Integration: Leverage Github Actions for continuous integration.

## Build and deploy

The API uses a `docker-compose.yml` file to manage all required components.

### Environment Files:

Two environment files are needed:

- .env: Stores general configuration values like database credentials and JWT secret.
- .env.mysql: Stores MySQL-specific configuration values like root password and database name.

Ensure both files share matching values to facilitate communication between services.

Example of them:

```.env
DB_HOST=
DB_USER=
DB_PASS=
DB_NAME=

JTW_SECRET=
```

```.env.mysql
MYSQL_ROOT_PASSWORD=
MYSQL_DATABASE=
```

### Running the API:

- Prerequisites: Docker needs to be installed and running.
- Command: Execute docker-compose up in your terminal.

## Usage

API Documentation: After building the API, access Swagger documentation at /api/.

## Use Case / Test Case

This section outlines steps to test core functionalities:

### 1. Create user

Endpoint: `/auth/signup`

Data:

```
{
  "email": "oscar@test.cl",
  "password": "changeme"
}
```

### 2. Login

Endpoint: `/auth/signin`

Data:

```
{
  "email": "oscar@test.cl",
  "password": "changeme"
}
```

Response:

```
{
  "access_token": "<token>"
}
```

### 3. Search teams

Endpoint: `/search?q=<team>`

Response:

```
{
	"Teams": [
		{
			"path": "2901",
			"name": "Leicester City",
			"country": "England",
			"type": "team"
		},
		{
			"path": "186658",
			"name": "Leicester Road",
			"country": "England",
			"type": "team"
		}
  ]
}
```

### 4. Subscribe to a team

Endpoint: `/subscriptions`

Data:

```
{
  "path": "2901",
  "name": "Leicester City",
  "country": "England",
  "type": "team"
}
```

### 5. Query the notifications

Endpoint: `/notifications`

Response:

```
{
	"1244578": [
		{
			"text": "El partido entre Tijuana y Club Santos Laguna ha comenzado",
			"new": true
		},
		{
			"text": "Gol de Club Santos Laguna! Anthony Lozano asistido por Ramiro Sordo anotan el 1-0 contra el Tijuana en el minuto 14",
			"new": true
		},
		{
			"text": "Gol de Tijuana! Efrain Alvarez asistido por Unai Bilbao anotan el 1-1 contra el Club Santos Laguna en el minuto 28",
			"new": true
		},
		{
			"text": "Gol de Tijuana! Jose Zuniga anota el 2-1 contra el Club Santos Laguna en el minuto 45+8",
			"new": true
		},
		{
			"text": "Club Santos Laguna: Tarjeta roja para Santiago Nunez en el minuto 51",
			"new": true
		},
		{
			"text": "Club Santos Laguna: Tarjeta amarilla para Ramiro Sordo en el minuto 58",
			"new": true
		},
		{
			"text": "Club Santos Laguna: Tarjeta amarilla para Santiago Naveda en el minuto 69",
			"new": true
		},
		{
			"text": "Tijuana: Tarjeta amarilla para Ivan Tona en el minuto 74",
			"new": true
		},
		{
			"text": "Club Santos Laguna: Tarjeta amarilla para Salvador Mariscal en el minuto 76",
			"new": true
		},
		{
			"text": "Gol de Tijuana! Jaime Alvarez asistido por Gilberto Mora anotan el 3-1 contra el Club Santos Laguna en el minuto 90+6",
			"new": true
		}
	]
}
```
