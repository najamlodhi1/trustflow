import { defineConfig } from 'prisma/config'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: process.env.DATABASE_URL ?? 'postgresql://localhost/trustflow',
  },
  migrations: {
    path: 'prisma/migrations',
  },
})
