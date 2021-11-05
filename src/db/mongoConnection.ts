import mongoose from 'mongoose';
import log from '../utils/logger';
import config from 'config';

const connect = async () => {
  const DBURI = process.env.DBURI || config.get<string>('config.dbUri');
  try {
    log.info(`Trying to connect to MongoDb on ${DBURI}...`);
    await mongoose.connect(DBURI);
    log.info('Successfull connection to MongoDb');
  } catch (error) {
    log.error('Failure to connect to MongoDb');
    process.exit(1);
  }
};

export default connect;
