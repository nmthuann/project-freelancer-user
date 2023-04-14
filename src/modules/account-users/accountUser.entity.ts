import { BaseEntity } from "src/common/bases/base.entity"
import { Role } from "src/common/enums/role.enum";
import { Entity,  Column, CreateDateColumn, DeepPartial, PrimaryColumn, BeforeInsert, JoinColumn, OneToOne, AfterUpdate, AfterInsert } from "typeorm"
import { InformationUserEntity } from "../infor-users/inforUser.entity";

@Entity({name:'AccountUsers'})
export class AccountUserEntity extends BaseEntity { 
    @PrimaryColumn()
    email: string

    @Column({nullable: false})
    password: string

    @Column({ default: 'active' })
    status: string;

    @Column({default: null})
    refresh_token: string;

    @Column({type: 'enum', enum: Role, default: Role.User})
    role: Role

    @OneToOne(() => InformationUserEntity, (infor) => infor.account, { cascade: true })
    @JoinColumn()
    infor: InformationUserEntity;

    @BeforeInsert()
    emailToLowerCase(){
        this.email = this.email.toLowerCase();
    } 

    
}