import { BaseEntity } from "src/common/bases/base.entity"
import { Entity,  Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from "typeorm"
import { AccountUserEntity } from "../account-users/accountUser.entity";

@Entity({name:'InformationUsers'})
export class InformationUserEntity extends BaseEntity { 
    @PrimaryGeneratedColumn()
    infor_id: number;

    @OneToOne(() => AccountUserEntity)
    @JoinColumn()
    account: AccountUserEntity;

    @Column({nullable: false})
    first_name: string;

    @Column()
    last_name: string;

    @Column()
    gender: string;

    @Column()
    birthday: Date;

    @Column()
    address: string;

    @Column({nullable: false})
    phone: string;

    @Column()
    education: string;





}