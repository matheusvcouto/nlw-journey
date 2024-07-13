import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { env } from "~/env";
import * as schema from "./schema/index";
import { PgTableWithColumns } from "drizzle-orm/pg-core";
import { SQLiteTableWithColumns } from "drizzle-orm/sqlite-core";
import { MySqlTableWithColumns } from "drizzle-orm/mysql-core";

export { eq } from 'drizzle-orm'

/**
 * Cache the database connection in development. This avoids creating a new connection on every HMR
 * update.
 */
const globalForDb = globalThis as unknown as {
  conn: postgres.Sql | undefined;
};

const conn = globalForDb.conn ?? postgres(env.DATABASE_URL);
if (env.NODE_ENV !== "production") globalForDb.conn = conn;

const db = drizzle(conn, { schema });

type SchemaWithoutRelations<T> = {
  [K in keyof T as K extends `${string}Relations` ? never : K]: T[K];
};
// Tipo para excluir relações e enums
type SchemaWithoutRelationsAndEnums<T> = {
  [K in keyof T as K extends `${string}Relations` ? never : K extends `${string}Enum` ? never : K]: T[K];
}

// Tipo para filtrar apenas PgTableWithColumns
type TablesOnly<T> = {
  [K in keyof T]: T[K] extends 
  PgTableWithColumns<any> 
  | SQLiteTableWithColumns<any> 
  | MySqlTableWithColumns<any> 
  ? K : never;
}[keyof T];

type FilteredSchema<T> = Pick<T, TablesOnly<T>>;

const tb: FilteredSchema<typeof schema> = schema;

export { db, tb }