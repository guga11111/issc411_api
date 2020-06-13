import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import FilesController from './controllers/FilesController';
import UsuarioPostController from './controllers/UsuarioPostController';

const app = express();
app.use(cors());
app.use(bodyParser.json());

FilesController.mount(app);
UsuarioPostController.mount(app);
export default app;
