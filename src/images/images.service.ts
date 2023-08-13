import { Injectable, Logger } from '@nestjs/common';
import * as fsPromises from 'fs/promises';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ImagesService {
  private readonly logger = new Logger(ImagesService.name);

  async uploadImage(
    folder: string,
    file: Express.Multer.File,
  ): Promise<string> {
    const dirPath = path.join(__dirname, `../../static/img/${folder}`);
    const fileName = `${uuidv4()}.webp`;
    const filePath = path.join(dirPath, fileName);

    try {
      await fsPromises.access(dirPath);
    } catch (e) {
      await fsPromises.mkdir(dirPath, { recursive: true });
    }

    await fsPromises.writeFile(filePath, file.buffer);

    return `/static/img/${folder}/${fileName}`;
  }

  async removeImage(imagePath: string): Promise<void> {
    const absFilePath = path.join(process.cwd(), imagePath);

    try {
      await fsPromises.access(absFilePath);
      await fsPromises.unlink(absFilePath);
    } catch (error) {
      if (error.code !== 'ENOENT') {
        throw error;
      }
    }
  }
}
