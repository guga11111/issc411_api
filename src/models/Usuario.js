import uuid from 'uuid/v4';
import DBManager from '../managers/DBManager';

const Usuarios = {
  id: {
    type: String,
    hashKey: true
  },
  Usuario: String,
  Contrasena: String,
  Nombre: String
};

export default class Post extends DBManager {
  id;

  Usuario;

  Contrasena;

  Nombre;

  // eslint-disable-next-line prettier/prettier
  constructor(
    id,
    Usuario,
    Contrasena,
    Nombre
  ) {
    super('tbl_Usuarios', Usuarios);
    this.id = id;
    this.Usuario = Usuario;
    this.Contrasena = Contrasena;
    this.Nombre = Nombre;
  }

  toDBFormat() {
    return {
      ...this
    };
  }

  getKey() {
    return this.id;
  }

  // eslint-disable-next-line class-methods-use-this
  fromDBResponse(post) {
    return new Post(post.id, post.Usuario, post.Contrasena, post.Nombre);
  }

  static newPost(Usuario, Contrasena, Nombre) {
    const id = uuid();
    return new Post(id, Usuario, Contrasena, Nombre);
  }
}
