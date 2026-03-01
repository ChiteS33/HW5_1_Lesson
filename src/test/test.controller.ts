import { Controller, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Controller('testing')
export class DeleteAllController {
  constructor(@InjectDataSource() private datasource: DataSource) {}

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('all-data')
  async clearAllCollections() {
    // const collectionsToClear = [
    //   'usermodels',
    //   'blogmodels',
    //   'postmodels',
    //   'commentmodels',
    //   'likeforpostmodels',
    //   'likeforcommentsmodels',
    //   'sessionsmodels',
    // ];
    // for (const name of collectionsToClear) {
    //   const collection = this.connection.collections[name];
    //   if (collection) {
    //     await collection.deleteMany({});
    //   }
    // }
    //
    // return { success: true };

    await this.datasource.query(
      `TRUNCATE TABLE "Users", "Sessions" RESTART IDENTITY`,
    );
  }
}
