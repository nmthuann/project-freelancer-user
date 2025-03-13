import { BaseEntity } from 'src/common/base.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { InformationUserEntity } from '../infor-users/infor-user.entity';

@Entity({ name: 'ProfileUsers' })
export class ProfileUserEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  profile_id: number;

  @Column({ nullable: false })
  avatar: string;

  @Column()
  occupation: string;

  @Column()
  my_skill: string;

  @Column({ default: 'new seller' })
  level: string;

  @OneToOne(() => InformationUserEntity, (infor) => infor.profile)
  @JoinColumn() // fix here
  infor: InformationUserEntity;
}
