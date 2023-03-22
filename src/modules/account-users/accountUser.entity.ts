import { BaseEntity } from "src/common/bases/base.entity"
import { Entity,  Column, CreateDateColumn, DeepPartial, PrimaryColumn, BeforeInsert } from "typeorm"

@Entity({name:'AccountUsers'})
export class AccountUserEntity extends BaseEntity { 
    @PrimaryColumn()
    email: string

    @Column({nullable: false})
    password: string

    @Column({ default: 'active' })
    status: string;

    @BeforeInsert()
    emailToLowerCase(){
        this.email = this.email.toLowerCase();
    }

}