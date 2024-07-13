import Elysia, { t } from "elysia";
import { z } from "zod";
import { db, tb } from "~/db";

export const invite_participants = new Elysia()
  .post('/trip/:trip_id/participants', async ({ params, body, set }) => {
    const { data: trip_id } = z.string().ulid().safeParse(params.trip_id)
    if (!trip_id) {
      set.status = 400
      return { error: 'Invalid trip_id' }
    }
    const { participants } = body
    const users = await db.insert(tb.users).values(participants.map(({email, name}) => ({
      name,
      email,
    }))).returning({ id: tb.users.id })

    await db.insert(tb.participants).values(users.map(user => ({
      trip_id,
      user_id: user.id
    })))

    set.status = 'Created'
    return { success: 'Adicionados com sucesso' }
  }, {
    tags: ['trips'],
    params: t.Object({
      trip_id: t.String()
    }),
    body: t.Object({
      participants: t.Array(t.Object({
        name: t.String(),
        email: t.String({ format: 'email' })
      }))
    })
  })