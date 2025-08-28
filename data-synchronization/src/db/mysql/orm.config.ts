import 'dotenv/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { env } from 'process';
import { dataSourceTarget } from './enum/data-source-target.enum';

/**
 *
 * @param target
 * @returns
 */
export const getDataSource = (
  target: dataSourceTarget,
  shouldProcess: boolean = false,
): DataSource | DataSourceOptions => {
  const { database, host, name, password, username, entities } =
    getConfigForDB(target);

  const dataSourceOptions: DataSourceOptions = {
    name: name,
    type: 'mysql',
    host: host,
    port: Number(env.DB_PORT),
    username: username,
    password: password,
    database: database,
    entities: entities,
    synchronize: false,
    migrationsRun: false,
    bigNumberStrings: false,
    logging: false,
    migrations: [`${__dirname}/../../migrations/**/*{.ts,.js}`],
    migrationsTableName: 'migrations',
    metadataTableName: 'orm_metadata',
    extra: {
      namedPlaceholders: true,
      charset: 'utf8mb4_unicode_520_ci',
    },
  };

  if (shouldProcess) {
    return new DataSource(dataSourceOptions);
  } else {
    return dataSourceOptions;
  }
};

const getConfigForDB = (target: dataSourceTarget) => {
  const tempConfig = new DBCustomConfigDto();
  switch (target) {
    case dataSourceTarget.STAR:
      tempConfig.name = 'STAR';
      tempConfig.host = String(env.DS_STAR_DB_HOST);
      tempConfig.database = String(env.DS_STAR_DB_NAME);
      tempConfig.username = String(env.DS_STAR_DB_USER);
      tempConfig.password = String(env.DS_STAR_DB_PASSWORD);
      tempConfig.entities = [
        `${__dirname}/../../domain/connections/star-main-app/entities/**/*.entity{.ts,.js}`,
      ];
      break;
    case dataSourceTarget.AICCRA:
      tempConfig.name = 'AICCRA';
      tempConfig.host = String(env.DS_AICCRA_DB_HOST);
      tempConfig.database = String(env.DS_AICCRA_DB_NAME);
      tempConfig.username = String(env.DS_AICCRA_DB_USER);
      tempConfig.password = String(env.DS_AICCRA_DB_PASSWORD);
      tempConfig.entities = [
        `${__dirname}/../../domain/connections/aiccra/entities/**/*.entity{.ts,.js}`,
      ];
      break;
    case dataSourceTarget.TEST:
      tempConfig.name = String(env.ARIM_TEST_MYSQL_NAME);
      tempConfig.host = String(env.ARIM_TEST_MYSQL_HOST);
      tempConfig.username = String(env.ARIM_TEST_MYSQL_USER_NAME);
      tempConfig.password = String(env.ARIM_TEST_MYSQL_USER_PASS);
      tempConfig.entities = [
        `${__dirname}/../../domain/connections/entities/**/*.entity{.ts,.js}`,
      ];
      break;
    case dataSourceTarget.STAR_PROD:
      tempConfig.name = 'STAR_PROD';
      tempConfig.host = String(env.DS_STAR_PROD_DB_HOST);
      tempConfig.database = String(env.DS_STAR_PROD_DB_NAME);
      tempConfig.username = String(env.DS_STAR_PROD_DB_USER);
      tempConfig.password = String(env.DS_STAR_PROD_DB_PASSWORD);
      tempConfig.entities = [
        `${__dirname}/../../domain/connections/star-main-app/entities/**/*.entity{.ts,.js}`,
      ];
  }

  return tempConfig;
};

export class DBCustomConfigDto {
  public name: string;
  public host: string;
  public username: string;
  public password: string;
  public database: string;
  public entities: string[] = [];
}
