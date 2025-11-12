import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
} from "typeorm";
import { User } from "./User";

export enum TaskPriority {
    LOW = "baja",
    MEDIUM = "media",
    HIGH = "alta",
}

export enum TaskStatus {
    PENDING = "pendiente",
    IN_PROGRESS = "en progreso",
    COMPLETED = "completada",
}

@Entity()
export class Task {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    title!: string;

    @Column({ type: "text", nullable: true })
    description?: string;

    @Column({
        type: "enum",
        enum: TaskPriority,
        default: TaskPriority.MEDIUM,
    })
    priority!: TaskPriority;

    @Column({
        type: "enum",
        enum: TaskStatus,
        default: TaskStatus.PENDING,
    })
    status!: TaskStatus;

    @ManyToOne(() => User, (user) => user.tasks, { onDelete: "CASCADE" })
    user!: User;

    @CreateDateColumn({ type: "timestamp" })
    createdAt!: Date;

    @UpdateDateColumn({ type: "timestamp" })
    updatedAt!: Date;
}
