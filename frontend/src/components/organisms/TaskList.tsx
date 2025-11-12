import React from "react";
import { TaskCard } from "../molecules/TaskCard";
import { FaClipboardList, FaClock, FaCheckCircle } from "react-icons/fa";

interface Task {
    id: string;
    title: string;
    description: string;
    priority: string;
    status: "pendiente" | "en progreso" | "completada";
}

interface TaskListProps {
    tasks: Task[];
    onTaskUpdated: () => void;
    onShowModal: (
        title: string,
        message: string,
        icon: React.ReactNode
    ) => void;
}

export const TaskList: React.FC<TaskListProps> = ({
    tasks,
    onTaskUpdated,
    onShowModal,
}) => {
    const pendingTasks = tasks.filter((task) => task.status === "pendiente");
    const inProgressTasks = tasks.filter((task) => task.status === "en progreso");
    const completedTasks = tasks.filter((task) => task.status === "completada");
    return (
        <div className="space-y-6">
            {tasks.length === 0 ? (
                <div className="flex flex-col items-center">
                    <FaClipboardList className="w-12 h-12 text-sky-300 dark:text-white" />
                    <p className="text-center text-gray-500 mt-4">
                        ¡Agrega una tarea para comenzar!
                    </p>
                </div>
            ) : (
                <>
                    {/* Pendientes */}
                    <div>
                        <h3 className="flex items-center mb-2 text-lg font-semibold text-gray-700 dark:text-white">
                            <FaClock className="text-md mr-2 mt-1.5 text-sky-300 dark:text-white" />
                            Pendientes ({pendingTasks.length})
                        </h3>
                        {pendingTasks.map((task) => (
                            <TaskCard
                                key={task.id}
                                id={task.id}
                                title={task.title}
                                description={task.description}
                                priority={task.priority}
                                status={task.status}
                                onTaskUpdated={onTaskUpdated}
                                onTaskEdited={onTaskUpdated}
                                onShowModal={onShowModal}
                            />
                        ))}
                    </div>

                    {/* En progreso */}
                    <div>
                        <h3 className="flex items-center mb-2 text-lg font-semibold text-gray-700 dark:text-white">
                            <FaClock className="text-md mr-2 mt-1.5 text-yellow-400 dark:text-white" />
                            En progreso ({inProgressTasks.length})
                        </h3>
                        {inProgressTasks.map((task) => (
                            <TaskCard
                                key={task.id}
                                id={task.id}
                                title={task.title}
                                description={task.description}
                                priority={task.priority}
                                status={task.status}
                                onTaskUpdated={onTaskUpdated}
                                onTaskEdited={onTaskUpdated}
                                onShowModal={onShowModal}
                            />
                        ))}
                    </div>

                    {/* Completadas */}
                    <div>
                        <h3 className="flex items-center mb-2 text-lg font-semibold text-gray-700 dark:text-white">
                            <FaCheckCircle className="text-md mr-2 mt-1.5 text-green-400 dark:text-white" />
                            Completadas ({completedTasks.length})
                        </h3>
                        {completedTasks.map((task) => (
                            <TaskCard
                                key={task.id}
                                id={task.id}
                                title={task.title}
                                description={task.description}
                                priority={task.priority}
                                status={task.status}
                                onTaskUpdated={onTaskUpdated}
                                onTaskEdited={onTaskUpdated}
                                onShowModal={onShowModal}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};
