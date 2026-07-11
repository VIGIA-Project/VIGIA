import { Controller, Get, Post, Body, UseGuards, Query } from '@nestjs/common';
import { JwtAuthGuard } from '@core/auth/presentation/jwt-auth.guard';
import { RolesGuard } from '@core/auth/presentation/roles.guard';
import { Roles } from '@core/auth/presentation/roles.decorator';
import { UserRole } from '@core/auth/domain/user.entity';
import { AccessControlService, CreateEventDto } from '../application/access-control.service';

@Controller('access-control')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AccessControlController {
  constructor(private readonly accessControlService: AccessControlService) {}

  @Post('events')
  @Roles(UserRole.ADMIN, UserRole.GUARD)
  async createEvent(@Body() dto: CreateEventDto) {
    return this.accessControlService.createEvent(dto);
  }

  @Get('events/pending')
  @Roles(UserRole.ADMIN, UserRole.GUARD)
  async getPendingEvents() {
    return this.accessControlService.getPendingEvents();
  }

  @Get('events/recent')
  @Roles(UserRole.ADMIN, UserRole.GUARD)
  async getRecentEvents(@Query('limit') limit?: number) {
    return this.accessControlService.getRecentEvents(limit || 20);
  }

  @Get('events')
  @Roles(UserRole.ADMIN, UserRole.GUARD)
  async getAllEvents() {
    return this.accessControlService.getAllEvents();
  }
}
