import { Controller, Get, Request } from '@nestjs/common';
import { liveScoreConstants } from './constants';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('search')
  async search(@Request() req: any) {
    return this.appService.search(req.query.q);
  }
}
