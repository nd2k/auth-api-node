import express, { Application, Request, Response } from 'express';
import log from './utils/logger';
import connect from './db/mongoConnection';
import config from 'config';

const PORT = process.env.PORT || config.get<number>('config.port');
const app: Application = express();

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Hello world');
});

try {
  app.listen(PORT, async () => {
    log.info(`App is listening on port ${PORT}`);
    await connect();
  });
} catch (error) {
  log.error(error);
}
