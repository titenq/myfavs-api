import fs from 'node:fs';
import { Upload } from '@aws-sdk/lib-storage';
import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';

import { IGenericError } from '@/interfaces/errorInterface';

const {
  BUCKET_KEY,
  BUCKET_SECRET,
  BUCKET_NAME,
  BUCKET_ENDPOINT
} = process.env;

const credentials = {
  accessKeyId: BUCKET_KEY!,
  secretAccessKey: BUCKET_SECRET!
};

const s3Client = new S3Client({
  endpoint: BUCKET_ENDPOINT!,
  credentials: credentials,
  region: 'global',
  forcePathStyle: true
});

const saveFile = async (filepath: string, filename: string): Promise<string | IGenericError> => {
  try {
    const uploadData = await new Upload({
      client: s3Client,
      params: {
        Bucket: BUCKET_NAME!,
        Key: filename,
        Body: fs.createReadStream(filepath),
        ContentType: 'image/jpeg'
      }
    }).done();

    return uploadData.Location!;
  } catch (error) {
    return {
      error: true,
      message: 'erro ao salvar arquivo no bucket',
      statusCode: 400
    };
  }
};

const deleteFile = async (pictureUrl: string): Promise<boolean | IGenericError> => {
  try {
    const filename = pictureUrl.split('/').pop();

    if (!filename) {
      return {
        error: true,
        message: 'nome do arquivo não encontrado',
        statusCode: 404
      };
    }

    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: BUCKET_NAME!,
        Key: filename
      })
    );

    return true;
  } catch (error) {
    return {
      error: true,
      message: 'erro ao deletar screenshot',
      statusCode: 400
    };
  }
};

export {
  saveFile,
  deleteFile
};
