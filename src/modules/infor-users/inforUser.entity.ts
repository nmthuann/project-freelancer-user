import { BaseEntity } from "src/common/bases/base.entity"
import { Entity,  Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, PrimaryColumn, AfterInsert, In, getConnection } from "typeorm"
import { AccountUserEntity } from "../account-users/accountUser.entity";
import { ProfileUserEntity } from "../profile-users/profileUser.entity";

@Entity({name:'InformationUsers'})
export class InformationUserEntity extends BaseEntity { 
    @PrimaryGeneratedColumn()
    infor_id: number;

    @Column({nullable: false})
    first_name: string;

    @Column()
    last_name: string;

    @Column()
    gender: string;

    @Column({nullable: false})
    birthday: Date;

    @Column()
    address: string;

    @Column({nullable: false})
    phone: string;

    @Column()
    education: string;
    

    @OneToOne(() => AccountUserEntity,  (account) =>  account.infor)
    @JoinColumn()
    account: AccountUserEntity;


    @OneToOne(() => ProfileUserEntity, (profile) => profile.infor, { cascade: true })
    @JoinColumn()
    profile: ProfileUserEntity;
}