import { betterAuth } from "better-auth";
import { Pool } from "pg";

export function connectDB() {
    try { new Pool({
        user: process.env.postgres_user,
        password: process.env.postgres_password,
        host: process.env.postgres_host,
        port: parseInt(process.env.postgres_port || "5432"),
        database: process.env.postgres_database,
    }), 
        betterAuth({
        secret: process.env.SECRET_BETTER_AUTH_KEY || "supersecretkey",
        algorithm: process.env.SECRET_BETTER_AUTH_ALGORITHM || "HS256",
    }); console.log("Connected to the database successfully.");
    } catch (error) {
        console.error("Error connecting to the database:", error);
    }
}

