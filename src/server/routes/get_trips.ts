import Elysia, { t } from "elysia";
import { z } from "zod";
import { db, eq, tb } from "~/db";

/**
 * Listar as viagens de um determinado usuario
 */
export const get_trips = new Elysia()
  .get('trips/users/:user_id', async ({ params, set }) => {
    const { data: user_id } = z.string().ulid().safeParse(params.user_id)
    if (!user_id) {
      return { error: 'Invalid user' }
    }

    const user = await db.query.users.findFirst({
      where: eq(tb.users.id, user_id),
      with: {
        participants: true
      }
    })
    if (!user) {
      set.status = 'Not Found'
      return { error: 'User Not Found' }
    }
    return { participants: user.participants }
  }, {
    tags: ['trips'],
    detail: {
      description: 'Listar as viagens de um determinado usuario'
    },
    params: t.Object({
      user_id: t.String()
    }),
  })