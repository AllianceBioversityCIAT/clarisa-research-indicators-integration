import { Controller, Get, HttpStatus, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { Request } from 'express';
import { ResponseUtils } from './domain/shared/utils/response.utils';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Info')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('status')
  mainPage(@Req() req: Request) {
    return ResponseUtils.format({
      description: 'Aliance Management',
      status: HttpStatus.OK,
      data: {
        message: 'Welcome to the Aliance Management API',
        author: 'One CGIAR - IBD',
        ip: req.ip,
        client: req.headers['user-agent'],
      },
    });
  }
}
