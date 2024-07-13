import { pgTable, text } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { ulid } from 'ulid';
import { trips } from './trips';

export const links = pgTable('links', {
  id: text('id').primaryKey().notNull().$defaultFn(ulid),
  title: text('title').notNull(),
  url: text('url').notNull(),

  trip_id: text('trip_id').notNull().references(() => trips.id, {
    onDelete: 'cascade'
  }), 
});

export const linksRelations = relations(links, ({ one, many }) => ({
  trip: one(trips, {
    fields: [links.trip_id],
    references: [trips.id]
  })
}));