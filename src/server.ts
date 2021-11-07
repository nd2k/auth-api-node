import express, { Application } from 'express';
import log from './utils/logger.utils';
import connect from './db/mongoConnection';
import config from 'config';
import routes from './routes/routes';
import deserializeUser from './middlewares/deserializeUser';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const PORT = process.env.port || config.get<number>('config.port');
const app: Application = express();

app.use(
  cors({
    origin: process.env.origin || config.get<string>('config.origin'),
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(deserializeUser);

try {
  app.listen(PORT, async () => {
    log.info(`App is listening on port ${PORT}`);
    await connect();
    routes(app);
  });
} catch (error) {
  log.error(error);
}
