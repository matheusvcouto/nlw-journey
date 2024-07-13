import { pgTable, text, boolean, timestamp } from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';
import { ulid } from 'ulid';
import { participants } from './participants';
import { activities } from './activities';
import { links } from './links';

// viagens
export const trips = pgTable('trips', {
  id: text('id').primaryKey().notNull().$defaultFn(ulid),
  destination: text('destination').notNull(),
  starts_at: timestamp('starts_at').notNull(),
  ends_at: timestamp('ends_at').notNull(),
  is_confirmed: boolean('is_confirmed').default(false),
  createdAt: timestamp('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const tripsRelations = relations(trips, ({ one, many }) => ({
  participants: many(participants),
  activities: many(activities),
  links: many(links)
}));
