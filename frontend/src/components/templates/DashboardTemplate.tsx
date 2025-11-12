import React, { useState } from "react";
import { TaskForm } from "../molecules/TaskForm";
import { TaskList } from "../organisms/TaskList";
import {
    FaTasks,
    FaUser,
    FaSignOutAlt,
    FaClipboardList,
    FaFilter,
} from "react-icons/fa";
import { Modal } from "../atoms/Modal";

interface DashboardTemplateProps {
    tasks: {
        id: string;
        title: string;
        description: string;
        completed: boolean;
        date?: string; // Assuming tasks have a date property
    }[];
    onAddTask: () => void;
    onDeleteTask: () => void;
}

export const DashboardTemplate: React.FC<DashboardTemplateProps> = ({
    tasks,
    onAddTask,
    onDeleteTask,
}) => {
    const username = localStorage.getItem("username");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [modalMessage, setModalMessage] = useState("");
    const [modalIcon, setModalIcon] = useState<React.ReactNode | null>(null);
    const [sortByDate, setSortByDate] = useState<"recent" | "oldest">("recent");

    const handleShowModal = (
        title: string,
        message: string,
        icon: React.ReactNode
    ) => {
        setModalTitle(title);
        setModalMessage(message);
        setModalIcon(icon);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("username");
        window.location.href = "/login";
    };

    const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSortByDate(event.target.value as "recent" | "oldest");
    };

    const sortedTasks =
        sortByDate === "recent"
            ? [...tasks].sort(
                  (a, b) =>
                      new Date(b.date!).getTime() - new Date(a.date!).getTime()
              )
            : [...tasks].sort(
                  (a, b) =>
                      new Date(a.date!).getTime() - new Date(b.date!).getTime()
              );

    const pendingTasks = sortedTasks.filter((task) => !task.completed);
    const completedTasks = sortedTasks.filter((task) => task.completed);

    return (
        <section className="min-h-screen min-w-screen  bg-sky-100/80 dark:bg-gray-900 dark:text-white">
            <div className="p-6 max-w-4xl mx-auto ">
                <div className="flex items-end justify-between mb-6">
                    <p className="flex text-sky-300 items-center text-2xl font-bold dark:text-white">
                        <FaTasks className="mr-2" /> To do app
                    </p>
                    <button
                        onClick={handleLogout}
                        className="flex items-center text-lg font-bold  cursor-pointer"
                    >
                        Cerrar sesión <FaSignOutAlt className="mx-2" />
                    </button>
                </div>
                <div className="flex items-end justify-between mb-6">
                    <button
                        type="button"
                        className="flex items-center text-md font-bold text-gray-500 dark:text-gray-300"
                    >
                        <FaUser className="mr-2" /> {username}
                    </button>
                </div>

                <div className="w-full bg-white rounded-lg shadow-lg shadow-sky-200 dark:border  dark:bg-gray-800 dark:border-gray-700 dark:shadow-gray-500">
                    <div className="py-2 sm:pt-6">
                        <h1 className="flex items-center justify-center text-xl font-bold leading-tight tracking-tight text-sky-300 md:text-2xl dark:text-white">
                            Agrega una tarea
                        </h1>
                    </div>
                    <TaskForm onTaskCreated={onAddTask} />
                </div>
                <div className="mt-10 p-6 w-full bg-white rounded-lg shadow-lg shadow-sky-200 dark:border  dark:bg-gray-800 dark:border-gray-700 dark:shadow-gray-500">
                    <div className="flex items-end justify-between mb-6">
                        <div>
                            <h2 className="flex items-center text-xl font-semibold mb-4 text-sky-300  dark:text-white">
                                <FaClipboardList className="text-2xl mr-2 text-sky-300 dark:text-white" />
                                Lista de Tareas
                            </h2>
                        </div>
                        <div className="flex items-center">
                            <div className="relative">
                                <FaFilter className="absolute left-5 top-3 text-sm text-sky-300 dark:text-white" />
                                <select
                                    value={sortByDate}
                                    onChange={handleSortChange}
                                    className="text-sm py-2 bg-gray-500 text-white py-2 pr-2 pl-8 mx-2 rounded-lg cursor-pointer"
                                >
                                    <option value="recent">
                                        Más recientes
                                    </option>
                                    <option value="oldest">Más antiguos</option>
                                </select>
                            </div>
                            <div className="text-sm bg-gray-500 text-white py-2 px-7 mx-2 rounded-lg">
                                Pendientes ({pendingTasks.length})
                            </div>
                            <div className="text-sm bg-green-100 text-green-800 py-2 px-4 mx-2 rounded-lg border border-green-400">
                                Completadas ({completedTasks.length})
                            </div>
                        </div>
                    </div>
                    <TaskList
                        tasks={sortedTasks}
                        onTaskUpdated={onDeleteTask}
                        onShowModal={handleShowModal}
                    />
                </div>
            </div>
            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={modalTitle}
                message={modalMessage}
                icon={modalIcon}
            />
        </section>
    );
};
