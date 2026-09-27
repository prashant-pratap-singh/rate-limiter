# Rate Limiter

An **IP-based rate limiter** built with **Node.js, Express, and Redis**, implemented in two different ways to understand the trade-offs between **in-memory request tracking** and **distributed rate limiting with Redis**.

The project allows a maximum of **5 requests from an IP within a 30-second window**. Once the limit is exceeded, the server responds with **HTTP 429 — Too Many Requests**.

## Implementations

This project contains two approaches:

### 1. In-Memory Hashing

### 2. Redis

To understand the implementation in depth, see the [Implementation Guide](./implementation.md).

## In-Memory vs Redis

| Feature               | In-Memory Hashing         | Redis                          |
| --------------------- | ------------------------- | ------------------------------ |
| Storage               | Application memory        | Redis                          |
| Setup                 | Simple                    | Requires Redis                 |
| Shared across servers | ❌                         | ✅                              |
| Persistence           | ❌                         | Configurable                   |
| Scalability           | Limited                   | Better for distributed systems |
| Atomic increment      | Application-level         | Redis `INCR`                   |
| Best suited for       | Simple/single-server apps | Distributed applications       |


## Tech Stack

* **Node.js**
* **Express.js**
* **Redis**
* **JavaScript**

## Project Structure

```text
rate-limiter/
│
├── helpers/
│   ├── hideip.js
│   └── redis.js
│
├── index.js
├── package.json
└── README.md
```

## Running Locally

### 1. Clone the repository

```bash
git clone https://github.com/prashant-pratap-singh/rate-limiter
cd rate-limiter
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start Redis

Make sure a Redis server is running locally or configure the project to connect to your Redis instance.

### 4. Start the application

```bash
node index.js
```

The server will start on:

```text
http://localhost:8000
```

## Testing the Rate Limiter

Send multiple requests to:

```text
GET /
```

The first **5 requests** within the 30-second window are allowed.

After that:

```text
HTTP 429
Too Many Requests
```

Once the Redis key expires, requests are allowed again.

## Future Improvements

Possible extensions to the project:

* Token-bucket rate limiting
* Sliding-window rate limiting
* Per-user rate limiting
* API-key based limits
* Route-specific limits
* Redis Lua scripts for atomic operations
* Rate-limit headers such as `X-RateLimit-Remaining`
* Dockerized deployment
* Redis-backed distributed rate limiting across multiple application instances

## License
MIT LICENSE
