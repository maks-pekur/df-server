import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { promises as fsPromises } from 'fs';
import * as path from 'path';
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

  async removeFiles(filePaths: string[]): Promise<void> {
    const unlinkPromises = filePaths.map((filePath) => {
      const absFilePath = path.join(process.cwd(), filePath);

      // Check if file exists before trying to delete it
      if (fs.existsSync(absFilePath)) {
        return new Promise<void>((resolve, reject) => {
          fs.unlink(absFilePath, (err) => {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          });
        });
      } else {
        return Promise.resolve();
      }
    });

    await Promise.all(unlinkPromises);
  }
}
