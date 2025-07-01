# Joke API Server

A backend implementation to support Qu Code Challenge frontend app.

---

## Features

- Fetches jokes from the [official-joke-api](https://official-joke-api.appspot.com/)
- Stores jokes in memory
- Enriches jokes with a `rating` property (scale: `0–3`)
- Full CRUD support:
  - `GET` jokes
  - `POST` new jokes
  - `PUT` updates
  - `DELETE` single or all jokes
- **MVC architecture**

---

## Project Structure

```
src/
├── controllers/       # Route handler logic
│   └── jokeController.ts
├── models/            # TypeScript types and interfaces
│   └── Joke.ts
├── routes/            # Express routes
│   └── jokes.ts
├── services/          # Business logic and state management
│   └── jokesService.ts
├── utils/             # Utility functions
│   └── enrichJoke.ts
├── index.ts           # Entry point
├── app.ts             # Express app configuration
```

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/BjornReinhard/qu-code-challenge.git
cd server
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run the server

```bash
npm run dev
```

---

## Environment Variables

Create a `.env` file in the root if you want to override defaults:

```env
JOKE_API_BASE_URL=https://official-joke-api.appspot.com
```

---

## API Endpoints

| Method | Route               | Description                     |
|--------|---------------------|---------------------------------|
| GET    | `/api/jokes`        | Fetches all jokes (remote if empty) |
| POST   | `/api/jokes`        | Adds a new joke                 |
| PUT    | `/api/jokes/:id`    | Updates a joke by ID            |
| DELETE | `/api/jokes/:id`    | Deletes a joke by ID            |
| DELETE | `/api/jokes`        | Deletes all jokes               |

All jokes are enriched with a `rating` field of type `0 | 1 | 2 | 3`.

---

## Example Payload

```json
{
  "id": 101,
  "type": "programming",
  "setup": "Why do programmers prefer dark mode?",
  "punchline": "Because light attracts bugs.",
  "rating": 2
}
```
