import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class DatabaseService implements OnModuleInit {
  private readonly logger = new Logger(DatabaseService.name);

  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.checkConnection();
  }

  async checkConnection(): Promise<boolean> {
    try {
      if (!this.dataSource.isInitialized) {
        await this.dataSource.initialize();
      }
      await this.dataSource.query('SELECT 1');
      this.logger.log('✅ Conexión a base de datos establecida');
      return true;
    } catch (error) {
      this.logger.error('❌ Error de conexión a base de datos', error);
      return false;
    }
  }

  async isHealthy(): Promise<boolean> {
    try {
      await this.dataSource.query('SELECT 1');
      return true;
    } catch {
      return false;
    }
  }

  getDataSource(): DataSource {
    return this.dataSource;
  }

  async runMigrations(): Promise<void> {
    this.logger.log('Ejecutando migraciones pendientes...');
    await this.dataSource.runMigrations();
    this.logger.log('Migraciones completadas');
  }
}
