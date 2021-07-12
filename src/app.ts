import express from 'express';
import createConnection from '..';

createConnection();
const app = express();

export { app };
