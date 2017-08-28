import path from 'path';
import express from 'express';

const app = express();
const publicPath = path.join(__dirname, '../public');

app.use(express.static(publicPath));

app.listen(process.env.PORT || '4200');