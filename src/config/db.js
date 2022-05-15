/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable global-require  */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
const chalk = require('chalk');
const syntax = require('sequelize-log-syntax-colors');
const dotenv = require('dotenv');

dotenv.config();

const prod = process.env.NODE_ENV === 'prod';

const log = (s) => {
  if (!s.includes('SELECT 1+1 AS result')) {
    const query = s.replace('Executed (default): ', '');
    console.info(
      chalk`{bgYellow.black ${' SQL > '}} {yellowBright ${syntax(query)}}`,
    );
  }
};

/**
 *
 * @type {{password: string, database: string, logQueryParameters: boolean, dialect: "mysql", port: number, seederStorage: string, host: string, pool: {min: number, max: number, idle: number}, define: {charset: string, freezeTableName: boolean, engine: string, timestamps: boolean, underscored: boolean, dialectOptions: {collate: string, typeCast: boolean, useUTC: boolean, dateString: boolean}, paranoid: boolean}, logging: (function(*): void|boolean), benchmark: boolean, username: string}}
 */
module.exports = {
  username: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || 'root',
  database: process.env.MYSQL_DATABASE || 'adhoc_dev',
  port: process.env.MYSQL_PORT_CI || process.env.MYSQL_PORT || 3306,
  host: process.env.MYSQL_HOST || 'mariadb',
  dialect: 'mysql',
  pool: {
    max: 10,
    min: 0,
    idle: 10000,
  },
  define: {
    underscored: false,
    freezeTableName: false,
    charset: 'utf8',
    dialectOptions: {
      collate: 'utf8_general_ci',
      useUTC: true,
      dateString: true,
      typeCast: true,
    },
    timestamps: true,
    paranoid: true,
    engine: 'InnoDB',
  },
  seederStorage: 'sequelize',
  logging: (!prod) && process.env.NODE_ENV !== 'test' ? log : false,
  benchmark: true,
  logQueryParameters: !prod,
};
