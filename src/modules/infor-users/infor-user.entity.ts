import { BaseEntity } from 'src/common/base.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { AccountUserEntity } from '../account-users/account-user.entity';
import { ProfileUserEntity } from '../profile-users/profile-user.entity';

@Entity({ name: 'InformationUsers' })
export class InformationUserEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  infor_id: number;

  @Column({ nullable: false })
  first_name: string;

  @Column()
  last_name: string;

  @Column()
  gender: string;

  @Column({ nullable: false })
  birthday: Date;

  @Column()
  address: string;

  @Column({ nullable: false })
  phone: string;

  @Column()
  education: string;

  @OneToOne(() => AccountUserEntity, (account) => account.infor)
  @JoinColumn() // fix here
  account: AccountUserEntity;

  @OneToOne(() => ProfileUserEntity, (profile) => profile.infor, {
    cascade: true,
  })
  @JoinColumn()
  profile: ProfileUserEntity;
}
