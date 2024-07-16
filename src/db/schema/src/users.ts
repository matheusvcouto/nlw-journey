import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';
import { ulid } from 'ulid';
import { participants } from './participants';

export const users = pgTable('users', {
  id: text('id').primaryKey().notNull().$defaultFn(ulid),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  updatedAt: timestamp('updated_at').notNull()
    .default(sql`CURRENT_TIMESTAMP`)
    .$onUpdate(() => sql`CURRENT_TIMESTAMP`),
});

export const usersRelations = relations(users, ({ one, many }) => ({
  participants: many(participants)
}));
