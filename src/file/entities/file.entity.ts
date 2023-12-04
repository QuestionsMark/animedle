import { User } from "src/user/entities/user.entity";
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";

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

    @OneToOne(() => User, e => e.avatar)
    user: User;

    @ManyToOne(() => User, e => e.skins)
    userSkin: User;
}