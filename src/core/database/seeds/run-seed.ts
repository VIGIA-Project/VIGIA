import 'reflect-metadata';
import * as dotenv from 'dotenv';
dotenv.config();

import { AppDataSource } from '../data-source';
import { runInitialSeed } from './initial.seeds';

async function main(): Promise<void> {
    await AppDataSource.initialize();
    try {
        await runInitialSeed(AppDataSource);
    } catch (error) {
        console.error('❌ Error en seeds:', error);
        process.exit(1);
    } finally {
        await AppDataSource.destroy();
    }
}

main();