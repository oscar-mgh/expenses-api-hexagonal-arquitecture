import { Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { SeedService } from './seed.service';
import { ApiResponse } from '@nestjs/swagger';

@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Post()
  @ApiResponse({ status: 201, description: 'Expenses populated in DB' })
  seedExpenses() {
    return this.seedService.seedExpenses();
  }

  @Post('clear')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, description: 'Expenses cleared in DB' })
  clearExpenses() {
    return this.seedService.clearExpenses();
  }
}
