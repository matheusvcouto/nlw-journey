import { decodeTime } from 'ulid'
import { db, tb } from '~/db'
import { dayjs } from '~/lib/dayjs'

const run = async () => {
  const [res] = await db.select({
    id: tb.trips.id,
    create_at: tb.trips.createdAt
  }).from(tb.trips)
  if (!res) return;

  const ulid_date = dayjs(decodeTime(res.id)).toDate()
  const normal_date = res.create_at
  if (ulid_date === normal_date) {
    console.log('Igual')
  }

  console.log({
    ulid_date,
    normal_date,
    isEqual: ulid_date === normal_date
  })
}

run()

// {
//   id: "01J2J9HTV8W8XTFG1DHEZHB0AW",
//   create_at: 2024-07-12T01:40:03.561Z,
// }