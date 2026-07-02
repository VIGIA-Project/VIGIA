import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  name: process.env.APP_NAME ?? 'VIGIA',
  version: process.env.APP_VERSION ?? '0.1.0',
  port: parseInt(process.env.APP_PORT ?? '3000', 10),
  env: process.env.NODE_ENV ?? 'development',
  apiPrefix: process.env.API_PREFIX ?? 'api/v1',
  corsOrigin: process.env.CORS_ORIGIN ?? '*',
  throttle: {
    ttl: parseInt(process.env.THROTTLE_TTL ?? '60', 10),
    limit: parseInt(process.env.THROTTLE_LIMIT ?? '100', 10),
  },
  health: {
    memoryHeapThreshold: parseInt(
      process.env.HEALTH_MEMORY_HEAP_THRESHOLD ?? '300',
      10,
    ),
    memoryRssThreshold: parseInt(
      process.env.HEALTH_MEMORY_RSS_THRESHOLD ?? '300',
      10,
    ),
  },
}));
