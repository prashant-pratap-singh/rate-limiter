const Redis = require("ioredis");

const client = new Redis({
});

client.on("connect", () => {
  console.log("Connected to Redis");
});

client.on("error", (err) => {
  console.error("Redis error:", err);
});     

client.on("ready", () => {
  console.log("Redis is ready to use");
});

client.on("close", () => {
  console.log("Redis connection closed");
});

module.exports = client;