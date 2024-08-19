import { Injectable } from '@nestjs/common';
import { liveScoreConstants } from './constants';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  async search(q: string) {
    const url = liveScoreConstants.SEARCH_API_GEN(q);
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

    for (const team of data.Teams) {
      result.Teams.push({
        path: team.ID,
        name: team.Nm,
        country: team.CoNm,
        type: 'team',
      });
    }

    return result;
  }
}
