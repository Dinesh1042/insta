import dotenv from 'dotenv';
import express from 'express';

import cookieParser from 'cookie-parser';
import appRoutes from './routes';

const app = express();
dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(appRoutes);

const PORT = process.env.PORT || 3007;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
