import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { env } from 'process';
import { json, urlencoded } from 'express';
import { readFileSync } from 'fs';
import { join } from 'path';
import { PackageMainDto } from './domain/shared/dtos/package.dto';

function parseJsonFile<T>(path: string): T {
  return JSON.parse(readFileSync(path, 'utf8')) as T;
}

async function bootstrap(): Promise<void> {
  const logger: Logger = new Logger('Bootstrap');
  const packageJson = parseJsonFile<PackageMainDto>(
    join(__dirname, '..', 'package.json'),
  );

  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));
  const config = new DocumentBuilder()
    .setTitle('Information synchronization service')
    .setDescription(
      'API for synchronizing and managing shared data across the entire platform ecosystem',
    )
    .setVersion(packageJson.version)
    .addBearerAuth()
    .build();
  const port: number = Number(env.DS_PORT);
  const document = SwaggerModule.createDocument(app, config);
  const swaggerPath: string = 'swagger';
  SwaggerModule.setup(swaggerPath, app, document);
  await app
    .listen(port)
    .then(() => {
      logger.debug(`Application is running http://localhost:${port}`);
      logger.debug(
        `Documentation is running http://localhost:${port}/${swaggerPath}`,
      );
    })
    .catch((err) => {
      const portValue: number | string = port || '<Not defined>';
      logger.error(`Application failed to start on port ${portValue}`);
      logger.error(err);
    });
}

void bootstrap();
