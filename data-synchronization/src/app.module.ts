import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_FILTER, APP_INTERCEPTOR, RouterModule } from '@nestjs/core';
import { routes } from './domain/routes/main.routes';
import { StarModule } from './domain/connections/star-main-app/star.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';
import { getDataSource } from './db/mysql/orm.config';
import { dataSourceTarget } from './db/mysql/enum/data-source-target.enum';
import { ResponseInterceptor } from './domain/shared/Interceptors/response.interceptor';
import { GlobalExceptions } from './domain/shared/error-management/global.exception';

@Module({
  imports: [
    RouterModule.register(routes),
    TypeOrmModule.forRoot(
      <DataSourceOptions>getDataSource(dataSourceTarget.STAR, false),
    ),
    StarModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: GlobalExceptions,
    },
  ],
})
export class AppModule {}
