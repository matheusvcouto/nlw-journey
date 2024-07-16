import { db, eq, tb } from ".."

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

const seed = async () => {
  
  await db.delete(tb.participants)
  await db.delete(tb.trips)
  await db.delete(tb.users)

  try {
    const users = await db.insert(tb.users).values([
      {
        name: 'Mathues',
        email: 'matheus.vieira.couto@gmail.com'
      },
      {
        name: 'Mirella',
        email: 'mirella.vieira.couto@gmail.com'
      }
    ]).returning();

    const [trip] = await db.insert(tb.trips).values([
      {
        destination: 'Dubai',
        ends_at: addDays(new Date, 10),
        starts_at: addDays(new Date, 4)
      }
    ]).returning();

    if (!trip || !users || !users[0]) {
      return
    }

    await db.insert(tb.participants).values(users.map((user) => ({
      trip_id: trip.id,
      user_id: user.id
    })))

    await db.update(tb.participants).set({
      is_owner: true
    }).where(eq(tb.participants.id, users[0].id))

    console.log('Finalizou')
    process.exit()

  } catch (error) {
    console.log('Ocorreu um error', error)
  }
}

seed()