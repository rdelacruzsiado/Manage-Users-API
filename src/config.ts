import { registerAs } from '@nestjs/config';

export default registerAs('config', () => ({
  appPort: process.env.APP_PORT,
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
  allowedOrigins: process.env.ALLOWED_ORIGINS,
}));
