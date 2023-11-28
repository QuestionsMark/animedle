import { FileItem } from "src/file/entities/file.entity";
import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

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

    @OneToOne(() => FileItem)
    @JoinColumn()
    avatar: FileItem;
}
