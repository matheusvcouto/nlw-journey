import { pgTable, serial, text, integer, boolean, timestamp } from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';
import { ulid } from 'ulid';
import { trips } from './trips';

export const activities = pgTable('activities', {
  id: text('id').primaryKey().notNull().$defaultFn(ulid),
  title: text('title').notNull(),
  occurs_at: timestamp('occurs_at').notNull(),

  trip_id: text('trip_id').notNull().references(() => trips.id),
});

export const activitiesRelations = relations(activities, ({ one, many }) => ({
  trip: one(trips, {
    fields: [activities.trip_id],
    references: [trips.id]
  })
}));