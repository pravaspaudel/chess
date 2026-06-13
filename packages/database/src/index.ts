import { drizzle } from "drizzle-orm/node-postgres";
import { users } from "./schema/schema";
import { eq } from "drizzle-orm";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool);

console.log("DATABASE_URL =", process.env.DATABASE_URL);

export { db, users, eq };
