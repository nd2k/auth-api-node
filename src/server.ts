import express, { Application } from 'express';
import log from './utils/logger';
import connect from './db/mongoConnection';
import config from 'config';
import routes from './routes/routes';

const PORT = process.env.PORT || config.get<number>('config.port');
const app: Application = express();

app.use(express.json());

try {
  app.listen(PORT, async () => {
    log.info(`App is listening on port ${PORT}`);
    await connect();
    routes(app);
  });
} catch (error) {
  log.error(error);
}
