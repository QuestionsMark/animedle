import { AnimedleTry } from "src/animedle/entities/animedle-try.entity";
import { FileItem } from "src/file/entities/file.entity";
import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn()
    createdAt: Date;

    @Column({
        unique: true,
        length: 255,
    })
    email: string;

    @Column({
        length: 100,
    })
    username: string;

    @Column()
    passwordHash: string;

    @Column({
        nullable: true,
        default: null,
    })
    currentTokenId: string | null;

    @Column({
        type: 'smallint',
        unsigned: true,
    })
    streak: number;

    @Column({
        type: 'smallint',
        unsigned: true,
    })
    winStreak: number;

    @OneToOne(() => FileItem)
    @JoinColumn()
    avatar: FileItem;

    @OneToMany(() => AnimedleTry, e => e.user)
    animedleTries: AnimedleTry[];

    @OneToMany(() => FileItem, e => e.userSkin)
    skins: FileItem[];
}
