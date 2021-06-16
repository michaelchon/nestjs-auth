import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./user.entity";

@Entity()
export class Code {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ update: false, unique: true })
    code: string;

    @CreateDateColumn()
    createDate: Date;

    @OneToOne(() => User, (user) => user.code, { onDelete: "CASCADE" })
    @JoinColumn()
    user: User;
}
