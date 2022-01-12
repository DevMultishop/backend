import 'reflect-metadata';
import 'dotenv/config';

import express from 'express';

import 'express-async-errors';

import '../typeorm';
import '../../container';
import upload from '../../../config/upload';

const app = express();
app.use('/files', express.static(upload.uploadsFolder));

export default app;
