require("dotenv").config({ path: "./src/.env" }); 
const express=require('express');
const app=express();

const main=require('./config/db');
const cookieparser=require('cookie-parser');
const authrouter=require('./routes/userauth');
const redisclient=require('./config/redis');
const problemrouter=require("./routes/problemcreator");
const submitrouter=require("./routes/submit");
const airouter=require("./routes/aichatting");
const cors=require('cors');
const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:5173")
  .split(",")
  .map((o) => o.trim());
app.use(cors({
  origin: allowedOrigins,
  credentials:true
}));


app.use(cookieparser());
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Server is running 🚀");
})
app.use('/user',authrouter);
app.use('/problem',problemrouter);
app.use('/submission',submitrouter);
app.use('/ai',airouter);






const initializeconnection = async () => {
  try {
    await main(); // MongoDB
    console.log("db connected");

    try {
      const connectTimeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Redis connect timed out")), 5000)
      );
      await Promise.race([redisclient.connect(), connectTimeout]);
      console.log("redis connected");
    } catch (redisErr) {
      console.log("⚠️ Redis not connected, continuing without Redis:", redisErr.message);
    }

    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
      console.log(`server http://localhost:${PORT}`);
    });
  } catch (err) {
    console.log("server startup error:", err);
  }
};



initializeconnection();



