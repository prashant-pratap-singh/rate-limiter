# Rate Limiter

An **IP-based rate limiter** built with **Node.js, Express, and Redis**, implemented in two different ways to understand the trade-offs between **in-memory request tracking** and **distributed rate limiting with Redis**.

The project allows a maximum of **5 requests from an IP within a 30-second window**. Once the limit is exceeded, the server responds with **HTTP 429 — Too Many Requests**.

## Implementations

This project contains two approaches:

### 1. In-Memory Hashing

The first implementation uses a JavaScript object as a hash map:

```js
const ip_mapping = {};
```

Each IP address is used as a key, with its request count stored as the value.

Conceptually:

```text
IP Address          Requests
-----------         --------
IP_1                3
IP_2                5
IP_3                1
```

Once the time window expires, the stored mappings can be cleared.

### 2. Redis

The second implementation uses **Redis** to maintain request counts.

For every request:

```js
const request = await redis.incr(my_ip);
```

If it is the first request from that IP, an expiration is set:

```js
if (request === 1) {
    await redis.expire(my_ip, 30);
}
```

This gives each IP its own **30-second expiration window**.

If the request count exceeds the limit:

```js
if (request > MAX_ALLOWED_REQ) {
    return res.status(429).send('too many request');
}
```

## How It Works

The rate limiter runs as Express middleware before the request reaches the route handler.

```text
Client Request
      │
      ▼
Extract IP Address
      │
      ▼
Hide / Transform IP
      │
      ▼
Increment Request Count
      │
      ▼
Is count > 5?
   ┌──┴──┐
  Yes    No
   │      │
   ▼      ▼
 HTTP 429  next()
          │
          ▼
       Route Handler
```

### Configuration

The current configuration is:

```js
const MAX_ALLOWED_REQ = 5;
const MAX_TIME = 30_000;
```

This means:

* **Maximum requests:** 5
* **Time window:** 30 seconds
* **Exceeded limit:** HTTP 429

## Redis Approach

Redis is particularly useful when the application runs across multiple server instances.

With an in-memory object:

```text
             Load Balancer
             /           \
            /             \
       Server 1          Server 2
       count = 3         count = 2
```

Each server maintains its own request counts, so the rate limit is not shared.

With Redis:

```text
             Load Balancer
             /           \
            /             \
       Server 1          Server 2
            \             /
             \           /
                Redis
                 │
           Shared counters
```

Both application instances can access the same request counters.

This makes Redis-based rate limiting more suitable for **scalable and distributed applications**.

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
