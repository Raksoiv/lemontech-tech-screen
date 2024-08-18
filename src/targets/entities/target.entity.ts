import { Subscription } from '../../subscriptions/entities/subscription.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

export enum TargetType {
  TEAM = 'team',
  STAGE = 'stage',
}

@Entity()
export class Target {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  path: string;

  @Column({
    type: 'enum',
    enum: TargetType,
  })
  sType: TargetType;

  @OneToMany(() => Subscription, (subscription) => subscription.target)
  subscriptions: Subscription[];
}
