import { BaseEntity } from "src/common/bases/base.entity"
import { Entity,  Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, Generated } from "typeorm"
import { InformationUserEntity } from "../infor-users/inforUser.entity";

@Entity({name:'ProfileUsers'})
export class ProfileUserEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    profile_id: number;

    @OneToOne(() =>InformationUserEntity)
    @JoinColumn()
    infor: InformationUserEntity;

    @Column({nullable: false})
    avatar: string;

    @Column()
    occupation: string;

    @Column()
    my_skill: string;

    @Column({default: "new seller"})
    level: string;
}