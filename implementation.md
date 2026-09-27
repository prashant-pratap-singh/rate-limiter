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
