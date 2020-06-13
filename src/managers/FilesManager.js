/* eslint-disable no-underscore-dangle */
import AWS from 'aws-sdk';

export default class FilesManager {
  static _presignedUrlExpirationSeconds = 900; // el guion bajo es para saber si es privada o no

  static _createS3Client() {
    return new AWS.S3({
      region: 'us-east-1'
    });
  }

  static getPresignedUrl(fileName, operation) {
    const client = FilesManager._createS3Client();

    const params = {
      Bucket: 'aperes-file-sharing',
      Key: fileName,
      ContentType: '',
      Expires: FilesManager._presignedUrlExpirationSeconds
    };
    return client.getSignedUrlPromise(operation, params);
  }

  static listObjets(nextContinationToken) {
    return new Promise((resolve, reject) => {
      const client = new FilesManager._createS3Client();
      const params = {
        Bucket: 'aperes-file-sharing'
      };
      if (nextContinationToken) {
        params.nextContinationToken = nextContinationToken;
      }
      client.listObjetsV2(params, async (err, data) => {
        if (err) {
          reject(err);
        } else {
          const objets = [
            ...data.Contents,
            ...(data.nextContinationToken
              ? await FilesManager.listObjets(data.nextContinationToken)
              : [])
          ];
          resolve(objets);
        }
      });
    });
  }

  static getFileContent(key) {
    return new Promise((resolve, reject) => {
      const client = FilesManager._createS3Client();
      const params = {
        Bucket: 'aperes-file-sharing',
        Key: key // nombre del archivo en s3
      };
      client.getObject(params, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data.Body.toString());
        }
      });
    });
  }
}
