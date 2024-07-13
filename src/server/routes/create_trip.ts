import Elysia, { t } from "elysia";
import { db, eq, tb } from "~/db";
import { dayjs } from '~/lib/dayjs';
import { sendEmail } from "~/lib/mail";
import { getTestMessageUrl } from 'nodemailer' 

export const create_trip = new Elysia()
  .post('trips', async ({ body, set }) => {
    const {
      destination,
      ends_at,
      owner_email,
      owner_name,
      starts_at
    } = body

    if (dayjs(starts_at).isBefore(new Date)) {
      return 'invalid trip start date. 1'
    }

    if (dayjs(ends_at).isBefore(starts_at)) {
      return 'invalid trip start date. 2'
    }

    let user_id: string | null = null

    const [user] = await db.select().from(tb.users).where(eq(tb.users.email, owner_email))

    if (!user) {
      const [newUser] = await db.insert(tb.users).values({
        email: owner_email,
        name: owner_name,
      }).returning({
        id: tb.users.id
      })
      if (!newUser) {
        return 'Ocorreu um error ao criar o usuaio'
      }
      user_id = newUser.id
    } else {
      user_id = user.id
    }

    const { trip_id, participant_id } = await db.transaction(async tx => {
      const [trip] = await db.insert(tb.trips).values({
        destination,
        starts_at: dayjs(starts_at).toDate(),
        ends_at: dayjs(ends_at).toDate()
      }).returning()
      
      
      if (!trip) {
        throw new Error('Não foi possivel criar a viagem')
      }
      
      const [participant] = await db.insert(tb.participants).values({
        trip_id: trip.id,
        is_owner: true,
        user_id,
      }).returning({
        id: tb.participants.id
      })

      if (!participant) {
        throw new Error('Não foi possivel criar a viagem')
      }
    
      return { trip_id: trip.id, participant_id: participant.id }
    })

    const message = await sendEmail({
      to: {
        name: owner_name,
        address: owner_email
      },
      subject: `Testenando envio de email`,
      html: `
      <p>Envio de email</p>
      `
    })

    console.log(getTestMessageUrl(message))

    return {
      trip_id,
      participant_id,
    }

  }, {
    tags: ['trips'],
    body: t.Object({
      destination: t.String(),
      starts_at: t.String({format: 'date-time'}),
      ends_at: t.String({format: 'date-time'}),
      owner_name: t.String(),
      owner_email: t.String({ format: 'email' })
    })
  })

// {
//   "destination": "string",
//   "starts_at": "2025-09-12 10:50",
//   "ends_at": "2025-09-13 10:50"
// }
  