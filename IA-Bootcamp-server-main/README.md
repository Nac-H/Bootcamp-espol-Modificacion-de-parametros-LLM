# LLM Server

Simple LLM completion server with clean architecture patterns.

## Features

- Express.js server with TypeScript
- Clean architecture with controllers pattern
- Zod validation for environment variables and request bodies
- Winston logging
- Health check endpoints
- Test coverage with Vitest

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3000
NODE_ENV=development
LOG_LEVEL=info

# OpenAI credentials (will be used in branch 2/openai-sdk)
# SERVER_OPENAI_API_KEY=your-api-key
# SERVER_OPENAI_PROJECT_ID=your-project-id
```

### Running the Application

Development mode:
```bash
npm run dev
```

Production build:
```bash
npm run build
npm start
```

### API Endpoints

- `GET /health` - Health check
- `GET /status` - Service status
- `POST /api/completion` - Text completion (mock response in current branch)

#### Completion Request

```bash
curl -X POST http://localhost:3000/api/completion \
  -H "Content-Type: application/json" \
  -d '{"input": "Hello, world!"}'
```

Response:
```json
{
  "content": "Echo: Hello, world! (This is a mock response - LLM service not implemented yet)"
}
```

### Testing

Run tests:
```bash
npm test
```

Watch mode:
```bash
npm run test:watch
```

## Architecture

This project follows clean architecture principles:

- **Controllers**: Handle HTTP requests/responses
- **Types**: Zod schemas for validation and type inference
- **Config**: Environment variable validation and app configuration
- **Utils**: Shared utilities like logging

## Branches

- `1/server`: Basic server skeleton (current)
- `2/openai-sdk`: Add OpenAI integration with base service pattern
