const { createClient } = require("redis");

const redisclient = createClient({
  url: process.env.REDIS_URL,
  socket: {
    reconnectStrategy: (retries) => (retries >= 3 ? false : Math.min(retries * 200, 1000))
  }
});

/* Handle Redis Events */
redisclient.on("connect", () => {
  console.log("redis connected");
});

redisclient.on("error", (err) => {
  console.error("Redis error:", err.message);
});

redisclient.on("reconnecting", () => {
  console.log("Redis reconnecting...");
});

module.exports = redisclient;