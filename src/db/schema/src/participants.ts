import { pgTable, text, boolean } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { ulid } from 'ulid';
import { trips } from './trips';
import { users } from './users';

export const participants = pgTable('participants', {
  id: text('id').primaryKey().notNull().$defaultFn(ulid),
  user_id: text('user_id').notNull().references(() => users.id, {
    onDelete: 'cascade'
  }),
  is_confirmed : boolean('is_confirmed ').notNull().default(false),
  is_owner: boolean('is_owner').notNull().default(false),
  trip_id: text('trip_id').notNull().references(() => trips.id, {
    onDelete: 'cascade'
  }),
});

export const participantsRelations = relations(participants, ({ one, many }) => ({
  trip: one(trips, {
    fields: [participants.trip_id],
    references: [trips.id]
  }),
  user: one(users, {
    fields: [participants.user_id],
    references: [users.id]
  })
}));
