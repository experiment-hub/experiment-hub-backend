import { Injectable } from '@nestjs/common';
import { PrismaClient as PostgresClient } from '@prisma/postgres/client';
import { PrismaClient as MongoClient } from '@prisma/mongo/client';
import { FormDto } from 'src/forms/form.dto';
@Injectable()
export class FormService {
  private readonly postgresPrisma: PostgresClient;
  private readonly mongoPrisma: MongoClient;

  constructor() {
    this.postgresPrisma = new PostgresClient();
    this.mongoPrisma = new MongoClient();
  }

  async createForm(createFormDto: FormDto) {
    try {
      const mongoForm = await this.mongoPrisma.form.create({
        data: {
          title: createFormDto.title,
          description: createFormDto.description,
          body: createFormDto.body,
        },
      });

      console.log('Mongo Form:', mongoForm);

      createFormDto.formMongoId = mongoForm.id;

      const newForm = await this.postgresPrisma.form.create({
        data: {
          title: createFormDto.title,
          teamId: +createFormDto.teamId,
          formMongoId: createFormDto.formMongoId,
          content: createFormDto.content,
        },
      });

      return { newForm, mongoForm };
    } catch (error) {
      throw error; // Rethrow the error to be caught by the controller
    }
  }

  async getFormById(id: number) {
    const pForm = await this.postgresPrisma.form.findUnique({
      where: { pk: id },
    });
    const mForm = await this.mongoPrisma.form.findUniqueOrThrow({
      where: {
        id: pForm.formMongoId,
      },
    });

    return { pForm, mForm };
  }

  async updateForm(id: number, updateFormDto: FormDto) {
    const updatedForm = await this.postgresPrisma.form.update({
      where: { pk: id },
      data: updateFormDto,
    });
    return updatedForm;
  }

  async listForms(teamId: number) {
    const pForms = await this.postgresPrisma.form.findMany({
      where: { teamId },
    });
    const pFormsDictionary = Object.fromEntries(
      pForms.map((x) => [x.formMongoId, x]),
    );

    const pFormIds = Object.keys(pFormsDictionary);
    const mForms = await this.mongoPrisma.form.findMany({
      where: {
        id: {
          in: pFormIds,
        },
      },
    });

    const result = mForms.map((mForm) => {
      return { pForm: pFormsDictionary[mForm.id], mForm };
    });
    return result;
  }
}
