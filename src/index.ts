import dotenv from 'dotenv';
import express from 'express';

const app = express();
dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3007;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
