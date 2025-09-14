import { Injectable } from '@nestjs/common';
import { existsSync, mkdirSync, unlink } from 'fs';
import { extname, join, resolve } from 'path';
import { ErrorHender } from 'src/infrostructure/utils/catchError';
import { v4 } from 'uuid';
import * as dotenv from 'dotenv';
import { writeFile } from 'fs/promises';
dotenv.config();

@Injectable()
export class FileService {
  private readonly Base_url = process.env.BASE_API;

async createFile(file: Express.Multer.File): Promise<string> {
  try {
    const ext = extname(file.originalname);
    const baseName = file.originalname.split('.')[0];
    const file_name = `${baseName}__${v4()}${ext.toLowerCase()}`;

    const file_path = resolve(__dirname, '..', '..','..', '..', 'upload');

    if (!existsSync(file_path)) {
      mkdirSync(file_path, { recursive: true });
    }

    await writeFile(join(file_path, file_name), file.buffer);

    return `${this.Base_url}/${file_name}`;
  } catch (error) {
    console.error(error);
    return ErrorHender(error);
  }
}


 async deleteFile(fileUrl: string): Promise<void> {
  try {
    const prefix = this.Base_url + '/';
    const fileName = fileUrl.replace(prefix, '');
    const filePath = resolve(__dirname, '..', '..','..', '..', 'upload', fileName);

    if (!existsSync(filePath)) {
      return;
    }

    await new Promise<void>((resolve, reject) => {
      unlink(filePath, (err) => {
        if (err) return reject(err);
        resolve();
      });
    });

  } catch (err) {
  }
}


  async existFile(file_name: any) {
    const file = file_name.replace(this.Base_url + '/', '');

    const file_path = resolve(
      __dirname,
      '..',
      '..',
      '..',
      '..',
      'upload',
      file,
    );
    if (existsSync(file_path)) {
      return true;
    } else {
      return false;
    }
  }
}
