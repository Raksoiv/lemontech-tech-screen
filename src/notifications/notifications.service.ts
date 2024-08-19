import { Inject, Injectable } from '@nestjs/common';
import { TargetsService } from '../targets/targets.service';
import {
  cacheConstants,
  dateConstants,
  liveScoreConstants,
} from '../constants';
import { Notification } from './entities/notification.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

function parseIncident(
  notifications: Notification[],
  incident: any,
  teams: { [key: number]: string },
) {
  if (incident.IT === 36) {
    let min = String(incident.Min);
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
    let min = String(incident.Min);
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
    let min = String(incident.Min);
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
    let scorer, teamScoring, assist;
    let min = '';
    for (const subIncident of incident.Incs) {
      min = String(subIncident.Min);
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
    let min = String(incident.Min);
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
    let min = String(incident.Min);
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
  constructor(
    private readonly targetsService: TargetsService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  //   @Cron(CronExpression.EVERY_MINUTE)
  async sendNotifications() {
    const targets = await this.targetsService.findAllActiveSubscriptions();
    const eventNotifications: { [key: number]: Notification[] } = {};

    for (const target of targets) {
      const events = await this.targetsService.get_events(target.id);
      for (const event of events) {
        console.log(`Creating notification for event ${event}`);
        const scoreResult = await fetch(
          liveScoreConstants.EVENT_SCORE_API_GEN(event),
        );
        const scoreData = await scoreResult.json();

        const teams: { [key: number]: string } = {
          1: scoreData.T1[0].Nm,
          2: scoreData.T2[0].Nm,
        };

        const startTime = dateConstants.LIVESCORE_DATE(String(scoreData.Esd));
        const now = new Date();
        if (startTime > now) {
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

        const savedNotifications =
          await this.cacheManager.get<Notification[]>(event);
        const newNotifications = notifications.filter((n) => {
          const foundNotification = savedNotifications?.find(
            (sn) => sn.text === n.text,
          );
          if (foundNotification) {
            n.new = foundNotification.new;
            return false;
          }
          return true;
        });

        // Send email notifications for new notifications
        // for (const notification of newNotifications) {
        //   await this.targetsService.sendEmailNotification(target.email, notification.text);
        // }

        // Send push notifications for new notifications
        // for (const notification of newNotifications) {
        //   await this.targetsService.sendPushNotification(target.pushToken, notification.text);
        // }

        // Save notifications to cache for 4 hours
        await this.cacheManager.set(
          event,
          notifications,
          cacheConstants.NOTIFICATIONS_CACHE_TTL,
        );

        eventNotifications[event] = newNotifications;
      }
    }

    return eventNotifications;
  }

  async getNotifications(user_id: number) {
    const targets =
      await this.targetsService.findAllActiveUserSubscriptions(user_id);
    const eventNotifications: { [key: number]: Notification[] } = {};

    for (const target of targets) {
      const events = await this.targetsService.get_events(target.id);
      for (const event of events) {
        const notifications =
          await this.cacheManager.get<Notification[]>(event);
        if (notifications) {
          eventNotifications[event] = [...notifications];

          // Mark notifications as new = false and save to cache
          const updatedNotifications = notifications.map((n) => {
            n.new = false;
            return n;
          });
          this.cacheManager.set(
            event,
            updatedNotifications,
            cacheConstants.NOTIFICATIONS_CACHE_TTL,
          );
        }
      }
    }

    return eventNotifications;
  }
}
