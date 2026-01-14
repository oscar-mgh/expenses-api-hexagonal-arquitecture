import { Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { SeedService } from './seed.service';

@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Post()
  seedExpenses() {
    return this.seedService.seedExpenses();
  }
  
  @Post('clear')
  @HttpCode(HttpStatus.OK)
  clearExpenses() {
    return this.seedService.clearExpenses();
  }
}
