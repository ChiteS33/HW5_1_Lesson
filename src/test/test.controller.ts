import { Controller, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Controller('testing')
export class DeleteAllController {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('all-data')
  async clearAllCollections() {
    const collectionsToClear = [
      'usermodels',
      'blogmodels',
      'postmodels',
      'commentmodels',
    ];
    for (const name of collectionsToClear) {
      const collection = this.connection.collections[name];
      if (collection) {
        await collection.deleteMany({});
      }
    }

    return { success: true };
  }
}
