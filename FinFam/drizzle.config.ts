import type { Config } from 'drizzle-kit';
import * as dotenv from "dotenv";
dotenv.config({ path: './.env' });

const databaseUrl = new URL(process.env.DATABASE_URL || "");

export default {
  schema: './drizzle/schema.ts',
  out: './drizzle/migrations',
  dialect: 'postgresql',
  verbose: true,
  strict: true,
  dbCredentials: {
    host: databaseUrl.hostname,
    port: parseInt(databaseUrl.port),
    user: databaseUrl.username,
    password: databaseUrl.password,
    database: databaseUrl.pathname.slice(1),
  },
  
} satisfies Config;