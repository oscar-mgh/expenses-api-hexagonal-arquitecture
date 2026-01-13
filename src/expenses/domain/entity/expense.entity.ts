export class Expense {
  constructor(
    public id: number,
    public description: string,
    public amount: string,
    public category: string,
    public createdAt: Date,
    public updatedAt?: Date,
    public deletedAt?: Date,
  ) {}
}