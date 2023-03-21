import { BaseEntity } from "src/common/bases/base.entity"
import { Entity,  Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from "typeorm"
import { InformationUserEntity } from "../infor-users/inforUser.entity";

@Entity({name:'ProfileUsers'})
export class ProfileUserEntity extends BaseEntity { 

    @PrimaryGeneratedColumn()
    profile_id: number;

    @OneToOne(() =>InformationUserEntity)
    @JoinColumn()
    infor: InformationUserEntity;

    @Column()
    avatar: string;

    @Column({nullable: false})
    occupation: string;

    @Column()
    myskill: string;

    @Column({default: "new seller"})
    level: string;
}