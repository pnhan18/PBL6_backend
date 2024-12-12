import { Types } from "mongoose";
import Template, { ITemplate } from "../models/template.model";
import { BaseRepository } from "./base.repository";
import { ITemplateRepository } from "./interface/Itemplate.repository";
import { Service } from "typedi";

@Service()
export class TemplateRepository
  extends BaseRepository<ITemplate, Types.ObjectId>
  implements ITemplateRepository
{
  constructor() {
    super(Template);
  }

  async findByName({ name }: { name: string }): Promise<ITemplate | null> {
    return await this.model.findOne({ name }).lean() as ITemplate | null;
  }
}
