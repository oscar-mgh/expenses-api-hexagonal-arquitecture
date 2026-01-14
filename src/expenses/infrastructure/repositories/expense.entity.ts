import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'expenses' })
export class ExpenseEntity {
  @ApiProperty({
    description: 'The unique identifier of the expense',
    example: 1,
    type: String, // bigint is often handled as string in JS, but number works for 'increment'
  })
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @ApiProperty({
    description: 'Detailed description of the expense',
    example: 'Monthly Netflix subscription',
  })
  @Column({ type: 'text' })
  description: string;

  @ApiProperty({
    description:
      'The monetary value stored as a numeric string to preserve precision',
    example: '15.99',
  })
  @Column({ type: 'numeric', precision: 10, scale: 2 })
  amount: string;

  @ApiProperty({
    description: 'Category group for the expense',
    example: 'Entertainment',
  })
  @Column({ type: 'varchar', length: 50 })
  category: string;

  @ApiProperty({
    description: 'Timestamp when the record was created',
    example: '2024-03-20T10:00:00Z',
  })
  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @ApiProperty({
    description: 'Timestamp of the last update',
    example: '2024-03-21T12:00:00Z',
  })
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @ApiProperty({
    description: 'Timestamp when the record was soft-deleted',
    example: null,
    nullable: true,
  })
  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz', nullable: true })
  deletedAt: Date;
}
