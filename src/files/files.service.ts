import { Injectable } from '@nestjs/common';
import { promises as fsPromises } from 'fs';
import { join } from 'path';

@Injectable()
export class FilesService {
  async upload(
    folder: string,
    dataBuffer: Buffer,
    filename: string,
  ): Promise<string> {
    const dirPath = join(__dirname, `../../static/img/${folder}`);
    const filePath = join(dirPath, filename);

    try {
      await fsPromises.access(dirPath);
    } catch (e) {
      await fsPromises.mkdir(dirPath, { recursive: true });
    }

    await fsPromises.writeFile(filePath, dataBuffer);

    return filePath;
  }
}
