import { Global, Module } from '@nestjs/common';
import { VigiaLogger } from './logger.service';

@Global()
@Module({
  providers: [VigiaLogger],
  exports: [VigiaLogger],
})
export class LoggerModule {}
