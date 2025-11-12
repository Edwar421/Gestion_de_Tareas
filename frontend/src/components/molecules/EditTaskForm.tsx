import React, { useState } from "react";
import { Input } from "../atoms/Input";
import { Button } from "../atoms/Button";
import { FaEdit } from "react-icons/fa";

interface EditTaskFormProps {
    id: string;
    currentTitle: string;
    currentDescription: string;
    currentPriority: string;
    currentStatus: string;
    onTaskUpdated: () => void;
    onClose: () => void;
    onEdit: (newTitle: string, newDescription: string, newPriority: string, newStatus: string) => void;
}

export const EditTaskForm: React.FC<EditTaskFormProps> = ({
    currentTitle,
    currentDescription,
    currentStatus,
    currentPriority,
    onTaskUpdated,
    onClose,
    onEdit,
}) => {
    const [title, setTitle] = useState(currentTitle);
    const [description, setDescription] = useState(currentDescription);
    const [priority, setPriority] = useState("media"); 
    const [status, setStatus] = useState("pendiente");
    const [errors, setErrors] = useState<{
        title?: string;
        description?: string;
    }>({});

    const isCompleted = currentStatus === "completada";

    const validate = () => {
        const newErrors: { title?: string; description?: string } = {};
        if (title.length < 3 || title.length > 50) {
            newErrors.title = "El título debe tener entre 3 y 50 caracteres.";
        }
        if (description.length < 5 || description.length > 200) {
            newErrors.description =
                "La descripción debe tener entre 5 y 200 caracteres.";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        await onEdit(title, description, priority, status);
        onTaskUpdated();
        onClose();
    };

    // 🔄 Opciones de cambio de estado válidas
    const nextStatusOptions = (() => {
        switch (currentStatus) {
            case "pendiente":
                return ["pendiente", "en progreso"];
            case "en progreso":
                return ["en progreso", "completada"];
            case "completada":
                return ["completada"];
            default:
                return ["pendiente"];
        }
    })();

    return (
        <form onSubmit={handleSubmit} className="px-8 py-4">
            <div>
                <Input
                    type="text"
                    name="title"
                    placeholder="Nuevo título"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    disabled={isCompleted} // Bloquear si está completada
                />
                {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
            </div>
            <div>
                <Input
                    type="text"
                    name="description"
                    placeholder="Nueva descripción"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    isTextarea={true}
                    disabled={isCompleted} // Bloquear si está completada
                />
                {errors.description && (
                    <p className="text-red-500 text-sm">{errors.description}</p>
                )}
            </div>
            <div className="my-4 flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                    Prioridad:
                </label>
                <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    disabled={isCompleted} // Bloquear si está completada
                    className="border border-gray-300 dark:border-gray-600 rounded-lg p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 disabled:opacity-50 disabled:cursor-not-allowed [&>option]:bg-white [&>option]:dark:bg-gray-700 [&>option]:text-gray-900 [&>option]:dark:text-gray-100"
                >
                    <option value="alta">Alta</option>
                    <option value="media">Media</option>
                    <option value="baja">Baja</option>
                </select>

                <label className="text-sm font-semibold text-gray-600 dark:text-gray-300 mt-2">
                    Estado:
                </label>
                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    disabled={isCompleted} // Bloquear si está completada
                    className="border border-gray-300 dark:border-gray-600 rounded-lg p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 disabled:opacity-50 disabled:cursor-not-allowed [&>option]:bg-white [&>option]:dark:bg-gray-700 [&>option]:text-gray-900 [&>option]:dark:text-gray-100"
                >
                    {nextStatusOptions.map((s) => (
                        <option key={s} value={s}>
                            {s.charAt(0).toUpperCase() + s.slice(1)}
                        </option>
                    ))}
                </select>
            </div>
            {!isCompleted ? (
                <Button type="submit">
                    <FaEdit className="mr-2" /> Actualizar Tarea
                </Button>
            ) : (
                <p className="text-gray-500 italic mt-3 text-center">
                    Esta tarea está completada y no se puede editar.
                </p>
            )}
        </form>
    );
};