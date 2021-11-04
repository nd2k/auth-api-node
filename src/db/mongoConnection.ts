import mongoose from 'mongoose';
import log from '../utils/logger';

const connect = async () => {
  const DBURI = process.env.dbUri || '@mongodbConnect';
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
