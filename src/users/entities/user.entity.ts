import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Code } from "./code.entity";

@Entity({ name: "user_account" })
export class User {
    // Minimum eight characters, at least one letter and one number
    static readonly passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ update: false, unique: true })
    email: string;

    @Column()
    password: string;

    @Column({ nullable: true })
    refreshToken: string;

    @Column({ default: false })
    isActive: boolean;

    @OneToOne(() => Code, (code) => code.user)
    code: Code;
}
