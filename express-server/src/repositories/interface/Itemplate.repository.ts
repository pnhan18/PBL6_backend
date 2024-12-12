import { BaseRepositoryInterface } from "./Ibase.repository";
import { ITemplate } from "../../models/template.model";
import { Types } from "mongoose";

export interface ITemplateRepository
  extends BaseRepositoryInterface<ITemplate, Types.ObjectId> {
  findByName({ name }: { name: string }): Promise<ITemplate | null>;
}
