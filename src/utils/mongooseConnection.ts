/* eslint-disable no-await-in-loop */
/* eslint-disable comma-dangle */
/* eslint-disable no-loop-func */
/* eslint-disable prefer-template */
import chalk from 'chalk';
import mongoose from 'mongoose';
import sleep from './sleep';

export default async(): Promise<mongoose.Connection> => {
  let time = 1;
  let connectSuccess = false;
  let connection: mongoose.Connection;
  do {
    try {
      await new Promise((resolve, reject) => {
        const mongoUri = process.env.MONGO_URI;
        mongoose.connect(mongoUri, {
          useCreateIndex: true,
          useNewUrlParser: true,
          useUnifiedTopology: true,
          useFindAndModify: false,
        });
        const db = mongoose.connection;
        connection = db;
        db.on('error', (err: Error) => {
          console.error(
            chalk.red('connection error', err)
          );
          return reject(err);
        });
        db.once('open', async () => {
          console.info(
            chalk.blue('Connection to DB successful')
          );
          return resolve({ mongoose });
        });
      });

      connectSuccess = true;
    } catch (exception) {
      console.error({ exception });
      time += time;
      // eslint-disable-next-line no-await-in-loop
      await sleep(time * 1000);
    }
  } while (!connectSuccess && time < 10);

  return connection;
}
