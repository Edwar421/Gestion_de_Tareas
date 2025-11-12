import React, { useState } from "react";
import { FaTrash, FaEdit, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { deleteTask, updateTask } from "../../services/api";
import { EditTaskForm } from "../molecules/EditTaskForm";
import { Modal } from "../atoms/Modal";

interface TaskCardProps {
    id: string;
    title: string;
    description: string;
    priority: string;
    status: string;
    onTaskUpdated: () => void;
    onTaskEdited: () => void;
    onShowModal: (
        title: string,
        message: string,
        icon: React.ReactNode
    ) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
    id,
    title,
    description,
    priority,
    status,
    onTaskUpdated,
    onTaskEdited,
    onShowModal,
}) => {
    const [isChecked, setIsChecked] = useState(status === "completada");
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const handleCheckboxChange = async () => {
        const newStatus = isChecked ? "pendiente" : "completada";
        setIsChecked(!isChecked);
        await updateTask(parseInt(id), title, description, priority, newStatus);
        onTaskUpdated();
    };
    const handleDelete = async () => {
        try {
            await deleteTask(parseInt(id));
            onShowModal(
                "Éxito",
                "Tarea eliminada correctamente.",
                <FaCheckCircle className="w-12 h-12 text-sky-400 dark:text-white" />
            );
            onTaskUpdated();
        } catch (error) {
            console.log("Error eliminando la tarea", error);
            onShowModal(
                "Error",
                "Error al eliminar la tarea.",
                <FaTimesCircle className="w-12 h-12 text-sky-400 dark:text-white" />
            );
        }
    };

    const handleEdit = async (newTitle: string, newDescription: string, newPriority: string, newStatus: string
    ) => {
        try {
            await updateTask(parseInt(id), newTitle, newDescription, newPriority, newStatus);
            onShowModal(
                "Éxito",
                "Tarea editada correctamente.",
                <FaCheckCircle className="w-12 h-12 text-sky-400 dark:text-white" />
            );
            onTaskUpdated();
            onTaskEdited();
        } catch (error) {
            console.log("Error editando la tarea", error);
            onShowModal(
                "Error",
                "Error al editar la tarea.",
                <FaTimesCircle className="w-12 h-12 text-sky-400 dark:text-white" />
            );
        } finally {
            setIsEditModalOpen(false);
        }
    };

    const handleOpenEditModal = () => {
        setIsEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
    };

    return (
        <div className="relative m-4 p-4 border rounded-lg border-gray-200 hover:border-gray-400 hover:bg-gray-100 shadow-sm group dark:border-gray-600 dark:hover:border-gray-200 dark:hover:bg-gray-700">
            <div className="flex items-start">
                <div className="flex items-center h-full mx-2 mt-2.5">
                    <button
                        onClick={handleCheckboxChange}
                        className={`w-4 h-4 rounded-full flex items-center justify-center ${isChecked
                            ? "bg-green-500 text-white border border-green-500"
                            : "bg-gray-300 text-gray-700"
                            }`}
                    >
                        {isChecked && <FaCheckCircle className="w-3 h-3" />}
                    </button>
                </div>

                <div className="flex-grow min-w-0 break-words">
                    <h3
                        className={`text-lg font-semibold ${isChecked ? "line-through" : ""
                            }`}
                    >
                        {title}
                    </h3>
                    <p
                        className={`text-gray-600 ${isChecked ? "line-through" : ""
                            }`}
                    >
                        {description}
                    </p>
                </div>
                <div className="flex items-center ml-2 mt-2.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={handleOpenEditModal}
                        className="text-gray-400 hover:text-sky-300 dark:hover:text-white p-1"
                    >
                        <FaEdit />
                    </button>
                    <button
                        onClick={handleDelete}
                        className="text-gray-400 hover:text-sky-300 dark:hover:text-white p-1 ml-2"
                    >
                        <FaTrash />
                    </button>
                </div>
            </div>

            <Modal
                isOpen={isEditModalOpen}
                onClose={handleCloseEditModal}
                title="Editar Tarea"
                message=""
            >
                <EditTaskForm
                    id={id}
                    currentTitle={title}
                    currentDescription={description}
                    currentPriority={priority}
                    currentStatus={status}
                    onTaskUpdated={onTaskUpdated}
                    onClose={handleCloseEditModal}
                    onEdit={handleEdit}
                />
            </Modal>
        </div>
    );
};
