import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  // Database configuration
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().default(5432),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_NAME: Joi.string().required(),

  // Auth configuration
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRATION: Joi.string().default('1d'),
  BCRYPT_ROUNDS: Joi.number().default(10),

  // API Key para dispositivos edge (garitas) — no usan JWT de usuario
  EDGE_DEVICE_API_KEY: Joi.string().required(),

  // App configuration (optional but good practice)
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test', 'provision')
    .default('development'),
  APP_PORT: Joi.number().default(3000),
});
