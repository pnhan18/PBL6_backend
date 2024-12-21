import { Model, Document, Types } from "mongoose";
import { BaseRepositoryInterface } from "./interface/Ibase.repository";
import { selectData } from "../utils";

export class BaseRepository<T, ID extends Types.ObjectId>
  implements BaseRepositoryInterface<T, ID>
{
  protected model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  async findById(id: ID, field: string[] = []): Promise<T | null> {
    return (await this.model
      .findById(id)
      .select(selectData(field))
      .lean()) as T;
  }

  async findAll({
    limit,
    page,
    filter,
    select,
  }: {
    limit: number;
    page: number;
    filter: Record<string, any>;
    select: string[];
  }): Promise<T[]> {
    const skip = (page - 1) * limit;
    const query: Record<string, any> = {};
    for (const key in filter) {
      if (filter[key]) {
        const value = filter[key];
        if (!isNaN(Number(value))) {
          query[key] = Number(value);
        } else {
          query[key] = { $regex: value, $options: "i" };
        }
      }
    }
    return (await this.model
      .find(query)
      .select(selectData(select))
      .limit(limit)
      .skip(skip)
      .lean()) as T[];
  }

  async save(entity: Partial<T>): Promise<T> {
    return await this.model.create(entity);
  }

  async update(id: ID, entity: Partial<T>): Promise<T | null> {
    return (await this.model
      .findByIdAndUpdate(id, entity, { new: true })
      .lean()) as T;
  }

  async deleteById(id: ID): Promise<boolean> {
    return (await this.model.findByIdAndDelete(id).lean()) ? true : false;
  }
}
