export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  tags: string[];
  content: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: "building-real-time-systems-with-socketio",
    title: "Building Real-Time Systems with Socket.io",
    excerpt:
      "How I engineered a real-time multiplayer backend for a 6-deck strategy card game with strict latency constraints.",
    date: "2025-05-15",
    readTime: "5 min read",
    tags: ["Socket.io", "Node.js", "Real-time", "AWS"],
    content: `Real-time systems require a fundamentally different approach to architecture. When I built the backend for COBRA, a 6-deck multiplayer strategy card game, every millisecond mattered.

## The Challenge

The game needed to support multiple concurrent rooms, each with up to 6 players, broadcasting live match telemetry under strict latency constraints. Traditional REST APIs wouldn't cut it.

## The Solution

I chose Socket.io for its event-driven architecture and built a synchronization layer that:

- Broadcasts game state changes to all connected clients in under 50ms
- Implements server-side validation to prevent unauthorized state manipulation
- Handles graceful disconnection and reconnection without losing game state

## Key Takeaways

1. Always validate on the server — never trust the client
2. Use rooms for efficient broadcasting
3. Implement heartbeat mechanisms for connection health
4. Design for failure — disconnections will happen`,
  },
  {
    id: "integrating-genai-into-development-workflows",
    title: "Integrating GenAI Into Development Workflows",
    excerpt:
      "How I use LangChain, Ollama, and AI agents to accelerate feature development and improve code quality.",
    date: "2025-04-20",
    readTime: "4 min read",
    tags: ["GenAI", "LangChain", "Ollama", "Productivity"],
    content: `Generative AI isn't just a buzzword — it's a force multiplier for developers who know how to wield it effectively.

## My AI-Augmented Workflow

At Elisium Space, I integrated GenAI tooling into our regular development workflows. Here's what that looks like in practice:

### Code Generation & Refactoring
Using Cursor IDE with Claude, I can describe complex refactoring patterns and have them executed across entire codebases in minutes rather than hours.

### Local LLMs with Ollama
For sensitive codebases, I run models locally via Ollama. This gives us the power of AI assistance without sending proprietary code to external APIs.

### AI Agents for Automation
LangChain-powered agents handle repetitive tasks like generating boilerplate, writing tests, and documenting APIs.

## Results

- Feature release cycles accelerated by ~40%
- Code review time reduced through AI-assisted pre-checks
- Documentation quality improved with AI-generated drafts`,
  },
  {
    id: "designing-scalable-database-schemas",
    title: "Designing Scalable Database Schemas for Real-Time Apps",
    excerpt:
      "Lessons learned from designing MongoDB schemas that handle player match history, active rooms, and real-time profiles.",
    date: "2025-03-10",
    readTime: "6 min read",
    tags: ["MongoDB", "Database Design", "Architecture"],
    content: `Schema design can make or break your application's performance at scale. Here's what I learned building the chess platform's database layer.

## The Requirements

- Store player match history (potentially millions of records)
- Track active rooms with real-time state
- Maintain player profiles with ELO ratings
- Handle concurrent reads/writes without conflicts

## Schema Decisions

### Embedding vs. Referencing
For active game state, I embedded the board position directly in the room document. This eliminates joins during the hot path — every move only requires a single document update.

### Indexing Strategy
Compound indexes on (playerId, timestamp) for match history queries. Partial indexes on (status: "active") for room lookups.

### State Persistence
Automated routines snapshot game state every 10 moves, protecting against data loss from abrupt disconnects.

## Performance Results

- Room lookup: < 5ms average
- Match history pagination: < 20ms for 1000+ games
- Zero data loss across 10,000+ test disconnections`,
  },
];
