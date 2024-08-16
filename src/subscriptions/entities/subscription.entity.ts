import { Event } from '../../events/entities/event.entity';
import { User } from '../../users/entities/user.entity';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

export enum SubscriptionType {
  TEAM = 'team',
  STAGE = 'stage',
}

@Entity()
export class Subscription {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  path: string;

  @Column({
    type: 'enum',
    enum: SubscriptionType,
  })
  sType: SubscriptionType;

  @ManyToOne(() => User, (user) => user.subscriptions)
  user: User;

  @OneToMany(() => Event, (event) => event.subscription)
  events: Event[];
}
