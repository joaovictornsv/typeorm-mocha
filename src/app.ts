import 'reflect-metadata';
import express from 'express';
import createConnection from './database';
import { UserController } from './controllers/UserController';
import 'dotenv/config';

createConnection();
const app = express();

app.use(express.json());
const userController = new UserController();
app.get('/users', userController.index);
app.get('/users/:id', userController.indexByID);
app.post('/users', userController.create);

export { app };
