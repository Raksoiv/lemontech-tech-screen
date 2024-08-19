import { Injectable } from '@nestjs/common';
import { TargetsService } from '../targets/targets.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { dateConstants, liveScoreConstants } from '../constants';
import { Notification } from './entities/notification.entity';

function parseIncident(
  notifications: Notification[],
  incident: any,
  teams: { [key: number]: string },
) {
  if (incident.IT === 36) {
    var min = String(incident.Min);
    if (incident.MinEx) {
      min += '+' + String(incident.MinEx);
    }
    if (incident.Nm === 1) {
      notifications.push({
        text: liveScoreConstants.GOAL_TEMPLATE(
          teams[1],
          teams[2],
          incident.Pn,
          incident.Sc[0],
          incident.Sc[1],
          min,
        ),
        new: true,
      });
    } else {
      notifications.push({
        text: liveScoreConstants.GOAL_TEMPLATE(
          teams[2],
          teams[1],
          incident.Pn,
          incident.Sc[1],
          incident.Sc[0],
          min,
        ),
        new: true,
      });
    }
  } else if (incident.IT === 37) {
    var min = String(incident.Min);
    if (incident.MinEx) {
      min += '+' + String(incident.MinEx);
    }
    if (incident.Nm === 1) {
      notifications.push({
        text: liveScoreConstants.PENALTY_SCORED_TEMPLATE(
          teams[1],
          teams[2],
          incident.Pn,
          incident.Sc[0],
          incident.Sc[1],
          min,
        ),
        new: true,
      });
    } else {
      notifications.push({
        text: liveScoreConstants.PENALTY_SCORED_TEMPLATE(
          teams[2],
          teams[1],
          incident.Pn,
          incident.Sc[1],
          incident.Sc[0],
          min,
        ),
        new: true,
      });
    }
  } else if (incident.IT === 38) {
    var min = String(incident.Min);
    if (incident.MinEx) {
      min += '+' + String(incident.MinEx);
    }
    if (incident.Nm === 1) {
      notifications.push({
        text: liveScoreConstants.PENALTY_MISSED_TEMPLATE(
          teams[1],
          teams[2],
          incident.Pn,
          incident.Sc[0],
          incident.Sc[1],
          min,
        ),
        new: true,
      });
    } else {
      notifications.push({
        text: liveScoreConstants.PENALTY_MISSED_TEMPLATE(
          teams[2],
          teams[1],
          incident.Pn,
          incident.Sc[1],
          incident.Sc[0],
          min,
        ),
        new: true,
      });
    }
  } else if (incident.Incs) {
    var scorer, teamScoring, assist;
    var min = '';
    for (const subIncident of incident.Incs) {
      var min = String(subIncident.Min);
      if (subIncident.MinEx) {
        min += '+' + String(subIncident.MinEx);
      }
      if (subIncident.IT === 36) {
        scorer = subIncident.Pn;
        teamScoring = subIncident.Nm;
      } else if (subIncident.IT === 63) {
        assist = subIncident.Pn;
      }
    }
    if (teamScoring === 1) {
      notifications.push({
        text: liveScoreConstants.GOAL_ASSIST_TEMPLATE(
          teams[1],
          teams[2],
          scorer,
          assist,
          incident.Sc[0],
          incident.Sc[1],
          min,
        ),
        new: true,
      });
    } else if (teamScoring === 2) {
      notifications.push({
        text: liveScoreConstants.GOAL_ASSIST_TEMPLATE(
          teams[2],
          teams[1],
          scorer,
          assist,
          incident.Sc[1],
          incident.Sc[0],
          min,
        ),
        new: true,
      });
    }
  } else if (incident.IT === 40) {
    if (incident.Nm === 1) {
      notifications.push({
        text: liveScoreConstants.PENALTY_PHASE_ATTEMPT_MISSED_TEMPLATE(
          teams[1],
          teams[2],
          incident.Pn,
          incident.Sc[0],
          incident.Sc[1],
        ),
        new: true,
      });
    } else {
      notifications.push({
        text: liveScoreConstants.PENALTY_PHASE_ATTEMPT_MISSED_TEMPLATE(
          teams[2],
          teams[1],
          incident.Pn,
          incident.Sc[1],
          incident.Sc[0],
        ),
        new: true,
      });
    }
  } else if (incident.IT == 41) {
    if (incident.Nm === 1) {
      notifications.push({
        text: liveScoreConstants.PENALTY_PHASE_ATTEMPT_SCORED_TEMPLATE(
          teams[1],
          teams[2],
          incident.Pn,
          incident.Sc[0],
          incident.Sc[1],
        ),
        new: true,
      });
    } else {
      notifications.push({
        text: liveScoreConstants.PENALTY_PHASE_ATTEMPT_SCORED_TEMPLATE(
          teams[2],
          teams[1],
          incident.Pn,
          incident.Sc[1],
          incident.Sc[0],
        ),
        new: true,
      });
    }
  } else if (incident.IT === 43) {
    var min = String(incident.Min);
    if (incident.MinEx) {
      min += '+' + String(incident.MinEx);
    }
    notifications.push({
      text: liveScoreConstants.YELLOW_CARD_TEMPLATE(
        teams[incident.Nm],
        incident.Pn,
        min,
      ),
      new: true,
    });
  } else if (incident.IT === 45) {
    var min = String(incident.Min);
    if (incident.MinEx) {
      min += '+' + String(incident.MinEx);
    }
    notifications.push({
      text: liveScoreConstants.RED_CARD_TEMPLATE(
        teams[incident.Nm],
        incident.Pn,
        min,
      ),
      new: true,
    });
  }
}

@Injectable()
export class NotificationsService {
  constructor(private readonly targetsService: TargetsService) {}

  //   @Cron(CronExpression.EVERY_MINUTE)
  async sendNotifications() {
    const targets = await this.targetsService.findAllActiveSubscriptions();
    const eventNotifications: { [key: number]: Notification[] } = {};

    for (const target of targets) {
      const events = await this.targetsService.get_events(target.id);
      for (var event of events) {
        console.log(`Creating notification for event ${event}`);
        var scoreResult = await fetch(
          liveScoreConstants.EVENT_SCORE_API_GEN(event),
        );
        var scoreData = await scoreResult.json();

        var teams: { [key: number]: string } = {
          1: scoreData.T1[0].Nm,
          2: scoreData.T2[0].Nm,
        };

        const startTime = dateConstants.LIVESCORE_DATE(String(scoreData.Esd));
        const now = new Date();
        if (startTime > now) {
          console.log([startTime, now]);
          console.log('Event has not started yet - skipping');
          continue;
        }

        const notifications: Notification[] = [];
        const incResult = await fetch(
          liveScoreConstants.EVENT_INCIDENTS_API_GEN(event),
        );
        const incData = await incResult.json();

        notifications.push({
          text: `El partido entre ${teams[1]} y ${teams[2]} ha comenzado`,
          new: true,
        });

        if (incData.Incs['1']) {
          // First Half
          for (const incident of incData.Incs['1']) {
            parseIncident(notifications, incident, teams);
          }
        }

        if (incData.Incs['2']) {
          // Second Half
          for (const incident of incData.Incs['2']) {
            parseIncident(notifications, incident, teams);
          }
        }

        if (incData.Incs['3']) {
          // Extra Time
          for (const incident of incData.Incs['3']) {
            parseIncident(notifications, incident, teams);
          }
        }

        if (incData.Incs['4']) {
          // Penalties
          for (const incident of incData.Incs['4']) {
            parseIncident(notifications, incident, teams);
          }
        }

        eventNotifications[event] = notifications;
      }
    }

    return eventNotifications;
  }
}
