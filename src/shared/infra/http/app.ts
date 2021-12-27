import 'reflect-metadata';
import 'dotenv/config';

import express from 'express';

import 'express-async-errors';

import '../typeorm';
import '../../container';

const app = express();

export default app;
