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
        type: 'simple-array',
        nullable: false,
    })
    hintsToChoose: AnimedleNamespace.HintType[];

    @Column({
        type: 'simple-array',
        nullable: false,
    })
    genres: string[];

    @Column()
    year: number;

    @Column({
        type: 'enum',
        enum: AnimedleNamespace.Season,
    })
    season: AnimedleNamespace.Season;

    @Column()
    episodes: number;

    @Column()
    familiarAnime: number;

    @Column()
    studio: string;

    @Column({
        type: 'enum',
        enum: AnimedleNamespace.Format,
    })
    format: AnimedleNamespace.Format;

    @Column()
    averageRate: number;

    @Column()
    popularity: number;

    @OneToMany(() => AnimedleTry, e => e.animedle)
    animedleTries: AnimedleTry[];
}
