export interface BaseRepositoryInterface<T, ID> {
    findById(id: ID, field?: string[]): Promise<T | null>;
    findAll({ limit, page, filter, select }: { limit: number; page: number; filter: Record<string, any>; select: string[] }): Promise<{totalPage: number, data: T[]}>;
    save(entity: Partial<T>): Promise<T>;
    update(id: ID, entity: Partial<T>): Promise<T | null>;
    deleteById(id: ID): Promise<boolean>;
}
  