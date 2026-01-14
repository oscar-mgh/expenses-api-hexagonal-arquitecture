import { Module } from '@nestjs/common';
import { SeedController } from './seed.controller';
import { SeedService } from './seed.service';
import { ExpensesModule } from 'src/expenses/expenses.module';

@Module({
  imports: [ExpensesModule],
  controllers: [SeedController],
  providers: [SeedService],
})
export class SeedModule {}
