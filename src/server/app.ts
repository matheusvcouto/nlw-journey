import Elysia from "elysia";
import { swagger } from '@elysiajs/swagger'
import { create_trip } from "./routes/create_trip";
import { get_trip } from "./routes/get-trip";

export const app = new Elysia({ prefix: '/api' })
  .use(swagger({
    provider: 'swagger-ui'
  }))
  .use(get_trip)
  .use(create_trip)