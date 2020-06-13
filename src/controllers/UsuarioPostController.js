import { BAD_REQUEST, NOT_FOUND, OK } from 'http-status-codes';
import { respond } from '../utils/response';
import BaseController from './BaseController';
import Post from '../models/Usuario';

export default class ProyectoPostsController extends BaseController {
  static basePath = '/api';

  initialize() {
    // GET get posts list
    this.app.get(
      `${ProyectoPostsController.basePath}/:usuarioo/:contrasenaa`,
      ProyectoPostsController.getAllPosts
    );

    // GET get post by id
    this.app.get(
      `${ProyectoPostsController.basePath}/:id`,
      ProyectoPostsController.getPostById
    );

    // POST create a new post
    /* this.app.post(
      ProyectoPostsController.basePath,
      ProyectoPostsController.
    ); */

    // PUT update existing post
    this.app.put(
      `${ProyectoPostsController.basePath}/:id`,
      ProyectoPostsController.updatePost
    );

    this.app.post(
      ProyectoPostsController.basePath,
      ProyectoPostsController.createPost
    );

    // DELETE delete post
    this.app.delete(
      `${ProyectoPostsController.basePath}/:id`,
      ProyectoPostsController.deletePost
    );
  }

  static mount(app) {
    return new ProyectoPostsController(app);
  }

  // Start: Endpoints

  static async getAllPosts(req, res) {
    try {
      const { usuarioo, contrasenaa } = req.params;
      let respuesta = false;
      const posts = await new Post().get();
      for (let i = 0; i < posts.length - 1; i++) {
        if (
          posts[i].Usuario === usuarioo &&
          posts[i].Contrasena === contrasenaa
        ) {
          respuesta = true;
        }
      }
      if (respuesta) {
        respond(res, OK, '1');
      } else {
        respond(res, OK, '0');
      }
    } catch (e) {
      ProyectoPostsController.handleUnknownError(res, e);
    }
  }

  static async getPostById(req, res) {
    try {
      const { id } = req.params;
      const post = await new Post(id).getByKey();

      if (!post) {
        respond(res, NOT_FOUND);
        return;
      }

      respond(res, OK, post);
    } catch (e) {
      ProyectoPostsController.handleUnknownError(res, e);
    }
  }

  static async createPost(req, res) {
    try {
      const expectedParams = ['Usuario', 'Contrasena', 'Nombre'];
      const validationErrors = [];

      expectedParams.forEach(p => {
        if (!req.body[p]) {
          validationErrors.push(`${p} parameter was not found in the request`);
        }
      });

      if (validationErrors.length > 0) {
        respond(res, BAD_REQUEST, {
          message: validationErrors.join('\n')
        });
        return;
      }

      const { Usuario, Contrasena, Nombre } = req.body;

      const post = Post.newPost(Usuario, Contrasena, Nombre);
      await post.create();

      respond(res, OK, post);
    } catch (e) {
      ProyectoPostsController.handleUnknownError(res, e);
    }
  }

  static async updatePost(req, res) {
    try {
      const { id } = req.params;

      const post = await new Post(id).getByKey();

      if (!post) {
        respond(res, NOT_FOUND);
        return;
      }

      const allowedParams = ['Usuario', 'Contrasena', 'Nombre'];

      Object.keys(req.body).forEach(p => {
        if (allowedParams.includes(p)) {
          post[p] = req.body[p];
        }
      });

      post.updatedAt = new Date();

      await post.update();

      respond(res, OK, post);
    } catch (e) {
      ProyectoPostsController.handleUnknownError(e);
    }
  }

  static async deletePost(req, res) {
    try {
      const { id } = req.params;
      await new Post(id).delete();
      respond(res, OK);
    } catch (e) {
      ProyectoPostsController.handleUnknownError(e);
    }
  }

  // End: Endpoints
}