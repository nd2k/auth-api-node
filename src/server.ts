import express, { Application, Request, Response } from 'express';
import log from './utils/logger';
import connect from './db/mongoConnection';

const PORT = process.env.PORT || 1000;
const app: Application = express();

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Hello world');
});

app.listen(PORT, async () => {
  log.info(`App is listening on port ${PORT}`);
  await connect();
});
