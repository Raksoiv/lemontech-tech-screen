import { Controller, Get, Request } from '@nestjs/common';
import { liveScoreConstants } from './constants';

@Controller()
export class AppController {
  @Get('search')
  async search(@Request() req: any) {
    const url = `${liveScoreConstants.SEARCH_API}?query=${req.query.q}&limit=10&locale=en&countryCode=CL&categories=true&stages=true&teams=true`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result: { [k: string]: any } = {
      Teams: [],
    };
    const data = await response.json();

    data.Teams.forEach((team: any) => {
      result.Teams.push({
        path: team.ID,
        name: team.Nm,
        type: 'team',
      });
    });

    return result;
  }
}
