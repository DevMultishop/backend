import path from 'path';

const tmpFolder = path.resolve(__dirname, '..', '..', 'tmp');

interface IUploadConfig {
  driver: 'disk' | 's3';
  tmpFolder: string;
  uploadsFolder: string;
  config: {
    aws: {
      bucket: string;
      region: string;
    };
  };
}

export default {
  driver: process.env.STORAGE_DRIVER,

  tmpFolder,
  uploadsFolder: path.resolve(tmpFolder, 'uploads'),

  config: {
    aws: {
      bucket: process.env.AWS_BUCKET_NAME,
      region: process.env.AWS_REGION,
    },
  },
} as IUploadConfig;
