import { Entity, PrimaryColumn, Column, OneToMany } from "typeorm";
import { Task } from "./Task";

@Entity()
export class User {
  @PrimaryColumn()
  email!: string;

  @Column()
  username!: string;

  @Column()
  password!: string;

  @OneToMany(() => Task, (task) => task.user, { cascade: true })
  tasks!: Task[];
}
