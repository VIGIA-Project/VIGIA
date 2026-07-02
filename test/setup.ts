import * as dotenv from 'dotenv';
import { resolve } from 'path';

export default async function setup(): Promise<void> {
  dotenv.config({ path: resolve(__dirname, '../.env') });
  process.env.NODE_ENV = 'test';
  process.env.DB_NAME = process.env.DB_NAME_TEST ?? process.env.DB_NAME ?? 'vigia_test';
}
