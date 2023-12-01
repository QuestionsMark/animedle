import { AnimedleTry } from "src/animedle/entities/animedle-try.entity";
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Gues extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn()
    createdAt: Date;

    @Column({
        type: 'varchar',
        length: 1000,
    })
    title: string;

    @Column()
    isCorrect: boolean;

    @Column({
        type: 'varchar',
        length: 10000,
    })
    answearsJSON: string;

    @ManyToOne(() => AnimedleTry, e => e.gueses)
    animedleTry: AnimedleTry;
}
