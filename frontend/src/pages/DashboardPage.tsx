import React, { useState, useEffect } from "react";
import { DashboardTemplate } from "../components/templates/DashboardTemplate";
import { ThemeToggle } from "../components/atoms/ThemeToggle";
import { getTasks } from "../services/api";

export const DashboardPage: React.FC = () => {
    const [tasks, setTasks] = useState<
        {
            id: string;
            title: string;
            description: string;
            priority: "alta" | "media" | "baja";
            status: "pendiente" | "en progreso" | "completada";
            date?: string;
        }[]
    >([]);

    const fetchTasks = async () => {
        const tasks = await getTasks();
        setTasks(tasks);
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    return (
        <>
            <ThemeToggle />
            <DashboardTemplate
                tasks={tasks}
                onAddTask={fetchTasks}
                onDeleteTask={fetchTasks}
            />
        </>
    );
};
