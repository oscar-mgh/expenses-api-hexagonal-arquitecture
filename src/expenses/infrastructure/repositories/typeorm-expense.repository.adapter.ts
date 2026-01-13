import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExpenseQueryDto } from 'src/expenses/application/dto/expenses-query.dto';
import { type ExpensePagination } from 'src/expenses/application/types/expense.types';
import { Expense } from 'src/expenses/domain/entity/expense.entity';
import { type ExpenseRepository } from 'src/expenses/domain/interfaces/expense.repository.port';
import { Repository } from 'typeorm';
import { ExpenseEntity } from './expense.entity';

@Injectable()
export class TypeOrmExpenseRepositoryAdapter implements ExpenseRepository {
  private readonly logger = new Logger(TypeOrmExpenseRepositoryAdapter.name);

  constructor(
    @InjectRepository(ExpenseEntity)
    private readonly ormRepo: Repository<ExpenseEntity>,
  ) {}

  async save(expense: Expense): Promise<Expense> {
    try {
      const entity = this.toEntity(expense);
      const savedEntity = await this.ormRepo.save(entity);
      return this.toDomain(savedEntity);
    } catch (error) {
      this.logger.error(
        `Failed to save expense: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'Error persisting expense in database',
      );
    }
  }

  async findById(id: number): Promise<Expense | null> {
    try {
      const entity = await this.ormRepo.findOneBy({ id });
      return entity ? this.toDomain(entity) : null;
    } catch (error) {
      this.logger.error(`Failed to find expense by id ${id}: ${error.message}`);
      throw new InternalServerErrorException('Error retrieving expense');
    }
  }

  async findAll(dto: ExpenseQueryDto): Promise<ExpensePagination> {
    try {
      const { page, limit, category } = dto;
      const qb = this.ormRepo
        .createQueryBuilder('expense')
        .orderBy('expense.updatedAt', 'DESC')
        .addOrderBy('expense.id', 'DESC')
        .skip((page - 1) * limit)
        .take(limit);

      if (category) {
        qb.andWhere('expense.category ILIKE :category', {
          category: `%${category}%`,
        });
      }

      const [data, total] = await qb.getManyAndCount();

      return {
        data: data.map((entity) => this.toDomain(entity)),
        meta: {
          total,
          page,
          lastPage: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      this.logger.error(`Failed to fetch expenses: ${error.message}`);
      throw new InternalServerErrorException('Error fetching expenses list');
    }
  }

  async update(id: number, data: Partial<Expense>): Promise<Expense | null> {
    try {
      const entity = await this.ormRepo.findOneBy({ id });
      if (!entity) return null;

      const cleanData = Object.fromEntries(
        Object.entries(data).filter(([_, v]) => v !== undefined),
      );

      Object.assign(entity, cleanData);

      const updatedEntity = await this.ormRepo.save(entity);
      return this.toDomain(updatedEntity);
    } catch (error) {
      this.logger.error(`Failed to update expense ${id}: ${error.message}`);
      throw new InternalServerErrorException('Error updating expense');
    }
  }

  async delete(id: number): Promise<void> {
    try {
      const result = await this.ormRepo.softDelete(id);

      if (result.affected === 0) {
        throw new NotFoundException(`Expense with id ${id} not found`);
      }
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(
        `Failed to soft delete expense ${id}: ${error.message}`,
      );
      throw new InternalServerErrorException('Error deleting expense');
    }
  }

  private toEntity(domain: Expense): ExpenseEntity {
    const entity = new ExpenseEntity();
    entity.id = domain.id;
    entity.description = domain.description;
    entity.amount = domain.amount;
    entity.category = domain.category;
    return entity;
  }

  private toDomain(entity: ExpenseEntity): Expense {
    return new Expense(
      entity.id,
      entity.description,
      entity.amount,
      entity.category,
      entity.createdAt,
      entity.updatedAt,
      entity.deletedAt,
    );
  }
}
