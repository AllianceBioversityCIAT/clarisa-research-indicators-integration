import { Routes } from '@nestjs/core';
import { StarModule } from '../connections/star-main-app/star.module';
import { AppModule } from '../../app.module';
import { AiccraModule } from '../connections/aiccra/aiccra.module';

export const routes: Routes = [
  {
    path: 'api',
    module: AppModule,
    children: [
      {
        path: 'star',
        module: StarModule,
      },
      {
        path: 'aiccra',
        module: AiccraModule,
      },
    ],
  },
];
