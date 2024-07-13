import Elysia from "elysia";
import { swagger } from '@elysiajs/swagger'
import { create_trip } from "./routes/create_trip";
import { get_trip } from "./routes/get-trip";
import { invite_participants } from "./routes/invite_participants";
import { get_trips } from "./routes/get_trips";
import { get_participants } from "./routes/get_participants";

export const app = new Elysia({ prefix: '/api' })
  .use(swagger({
    provider: 'swagger-ui'
  }))
  .use(get_trip)
  .use(get_trips)
  .use(get_participants)
  .use(create_trip)
  .use(invite_participants)