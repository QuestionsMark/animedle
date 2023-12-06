import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Animedle as AnimedleNamespace } from "../../types";
import { AnimedleTry } from "./animedle-try.entity";

@Entity()
export class Animedle extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn()
    createdAt: Date;

    @Column()
    anime: string;

    @Column({
        type: 'mediumint',
        unsigned: true,
    })
    animeId: number;

    @Column({
        type: 'simple-array',
        nullable: false,
    })
    hintsToChoose: AnimedleNamespace.HintType[];

    @OneToMany(() => AnimedleTry, e => e.animedle)
    animedleTries: AnimedleTry[];
}
