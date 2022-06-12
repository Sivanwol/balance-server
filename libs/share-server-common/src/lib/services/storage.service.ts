import { Inject, Injectable, Logger } from '@nestjs/common';
import S3 from 'aws-sdk/clients/s3';
import { DoSpacesServiceLib, UploadedMulterFileI } from '../utils';
import { series } from 'async';

@Injectable()
export class StorageService {
  private readonly logger = new Logger('StorageService');
  constructor(@Inject(DoSpacesServiceLib) private readonly s3: S3) {}
  async removeFile(bucket: string, path: string, fileName: string) {
    if (this.hasFileExist(bucket, path, fileName)) {
      await this.s3
        .deleteObject({
          Bucket: bucket,
          Key: `${path}/${fileName}`,
        })
        .promise();
    }
  }
  async hasFileExist(bucket: string, path: string, fileName: string) {
    this.logger.log(`checking if file existed in storage [${bucket}, ${path}, ${fileName}`);
    try {
      await this.s3
        .headObject({
          Bucket: bucket,
          Key: `${path}/${fileName}`,
        })
        .promise();
      return true;
    } catch (error) {
      if (error.name === 'NotFound') {
        // Handle no object on cloud here...
        return false;
      }
    }
  }

  async moveFileFromUploads(bucket: string, path: string, fileName: string) {
    this.logger.log(`move from upload files into ${path} [${bucket}, ${path}, ${fileName}`);
    if (this.hasFileExist(bucket, 'uploads', fileName)) {
      return new Promise((resolve, reject) => {
        const tasks = [
          this.s3
            .copyObject({
              Bucket: bucket,
              CopySource: `${bucket}/uploads/${fileName}`,
              Key: `${path}/${fileName}`,
            })
            .promise(),
          this.s3
            .deleteObject({
              Bucket: bucket,
              Key: `uploads/${fileName}`,
            })
            .promise(),
        ];
        series(tasks, (err, results) => {
          if (err) {
            this.logger.error(err);
            reject(err);
          }
          this.logger.verbose(results);
          resolve(true);
        });
      });
    }
  }

  async uploadFile(bucket: string, userId: string, file: UploadedMulterFileI) {
    // Precaution to avoid having 2 files with the same name
    const fileName = `uploads/${userId}-${file.originalname}`;

    this.logger.log(`uploading new file [${bucket}, ${userId}, ${fileName}`);
    // Return a promise that resolves only when the file upload is complete
    return new Promise((resolve, reject) => {
      this.s3.putObject(
        {
          Bucket: bucket,
          Key: fileName,
          Body: file.buffer,
          ACL: 'public-read',
        },
        (error: AWS.AWSError) => {
          if (!error) {
            resolve(`${process.env.DC_STORE_PUBLIC_URL}/${fileName}`);
          } else {
            reject(new Error(`DoSpacesService_ERROR: ${error.message || 'Something went wrong'}`));
          }
        }
      );
    });
  }
}
