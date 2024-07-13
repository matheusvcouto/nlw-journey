import Elysia, { t } from "elysia";
import { z } from "zod";
import { db, eq, tb } from "~/db";

export const get_participants = new Elysia()
  .get('trips/:trip_id/participants', async ({ params, set }) => {
    const { data: trip_id } = z.string().ulid().safeParse(params.trip_id)
    if (!trip_id) {
      return { error: 'Invalid trip_id' }
    }

    const participants = await db.select().from(tb.participants).where(eq(tb.participants.trip_id,  trip_id))

    return { participants }
  }, {
    tags: ['trips'],
    params: t.Object({
      trip_id: t.String()
    })
  })