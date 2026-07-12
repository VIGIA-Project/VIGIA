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
  
  // App configuration (optional but good practice)
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test', 'provision')
    .default('development'),
  APP_PORT: Joi.number().default(3000),

  // AI services (all optional — stubs usados en dev por defecto)
  USE_AI_STUBS: Joi.string().valid('true', 'false').default('true'),
  OCR_SERVICE_URL: Joi.string().uri().default('http://localhost:8001'),
  BIOMETRIC_SERVICE_URL: Joi.string().uri().default('http://localhost:8002'),
  AI_HTTP_TIMEOUT_MS: Joi.number().default(5000),
});
