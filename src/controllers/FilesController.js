import { OK, BAD_REQUEST } from 'http-status-codes';
import { respond } from '../utils/response';
import FilesManager from '../managers/FilesManager';
import BaseController from './BaseController';

export default class FilesController extends BaseController {
  static basePath = '/api/v1/files';

  initialize() {
    // get Upload presignd URL
    this.app.get(
      `${FilesController.basePath}/upload`,
      FilesController.getNewFileUploadUrl
    );

    // GET List objets in bucket
    this.app.get(FilesController.basePath, FilesController.listObjets);

    // GET filecontent
    this.app.get(
      `${FilesController.basePath}/content`,
      FilesController.getFileContents
    );
  }

  static mount(app) {
    return new FilesController(app);
  }

  static async getNewFileUploadUrl(req, res) {
    try {
      const { fileName } = req.query;
      if (!fileName) {
        respond(res, BAD_REQUEST, {
          message: 'fileName is required'
        });
        return;
      }
      const url = await FilesManager.getPresignedUrl(fileName, 'putObjet');
      respond(res, OK, { url: url }); // :url: si lo que devuelve tiene el mismo nombre
    } catch (e) {
      FilesController.handleUnknownError(res, e);
    }
  }

  static async listObjets(req, res) {
    try {
      const objects = await FilesManager.listObjets();
      respond(res, OK, objects);
    } catch (e) {
      FilesController.handleUnknownError(res, e);
    }
  }

  static async getFileContents(req, res) {
    try {
      const { fileName } = req.query;

      const content = await FilesManager.getFileContent(fileName);
      respond(res, OK, { content });
    } catch (e) {
      FilesController.handleUnknownError(res, e);
    }
  }
}