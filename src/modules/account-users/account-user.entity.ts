import { BaseEntity } from 'src/common/base.entity';
import {
  Entity,
  Column,
  PrimaryColumn,
  BeforeInsert,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { InformationUserEntity } from '../infor-users/infor-user.entity';
import { Role } from 'src/common/enums/role.enum';

@Entity({ name: 'AccountUsers' })
export class AccountUserEntity extends BaseEntity {
  @PrimaryColumn()
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ default: 'active' })
  status: string;

  @Column({ default: null })
  refresh_token: string;

  @Column({ type: 'enum', enum: Role, default: Role.User })
  role: Role;

  @OneToOne(() => InformationUserEntity, (infor) => infor.account, {
    cascade: true,
  })
  @JoinColumn()
  infor: InformationUserEntity;

  @BeforeInsert()
  emailToLowerCase() {
    this.email = this.email.toLowerCase();
  }
}
