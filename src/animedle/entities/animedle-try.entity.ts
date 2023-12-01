import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Animedle as AnimedleNamespace } from "../../types";
import { Animedle } from "./animedle.entity";
import { User } from "src/user/entities/user.entity";
import { Gues } from "src/user/entities/gues.entity";

@Entity()
export class AnimedleTry extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn()
    createdAt: Date;

    @Column({
        type: 'enum',
        enum: AnimedleNamespace.HintType,
        nullable: true,
        default: null,
    })
    hintType: AnimedleNamespace.HintType | null;

    @Column({
        type: 'varchar',
        length: 1000,
        nullable: true,
        default: null,
    })
    hint: string | null;

    @OneToMany(() => Gues, e => e.animedleTry)
    gueses: Gues[];

    @ManyToOne(() => Animedle, e => e.animedleTries)
    animedle: Animedle;

    @ManyToOne(() => User, e => e.animedleTries)
    user: User;
}
