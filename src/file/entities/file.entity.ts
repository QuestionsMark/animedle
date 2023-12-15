import { User } from "src/user/entities/user.entity";
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class FileItem extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        unique: true,
    })
    filename: string;

    @CreateDateColumn()
    createdAt: Date;

    @OneToMany(() => User, e => e.avatar)
    users: User[];

    @ManyToMany(() => User, e => e.skins)
    usersSkins: User[];
}