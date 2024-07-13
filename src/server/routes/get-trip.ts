import Elysia, { t } from "elysia";
import { db, eq, tb } from "~/db";
import { z } from "zod";

export const get_trip = new Elysia()
  .get('trips/:tripId', async ({ params, set }) => {

    const {
      error: validation_error,
      data: trip_id
    } = z.string().ulid().safeParse(params.tripId)

    if (validation_error) {
      set.status = 400
      return { error: validation_error }
    }

    // const [trip] = await db.select().from(tb.trips).where(eq(tb.trips.id, trip_id))
    
    const trip = await db.query.trips.findFirst({
      where: eq(tb.trips.id, trip_id),
      with: {
        participants: {
          where: eq(tb.participants.is_owner, true),
        }
      }
    })

    if (!trip) {
      set.status = 'Not Found'
      return { error: 'Trip not found' }
    }

    return { trip }
  }, {
    tags: ['trips'],
    params: t.Object({
      tripId: t.String()
    })
  })

// {
//   "destination": "string",
//   "starts_at": "2025-09-12 10:50",
//   "ends_at": "2025-09-13 10:50"
// }
  