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
    return (
        <form onSubmit={handleSubmit} className="px-8 py-4">
            <div>
                <Input
                    type="text"
                    name="title"
                    placeholder="Nuevo título"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                {errors.title && (
                    <p className="text-red-500 text-sm">{errors.title}</p>
                )}
            </div>
            <div>
                <Input
                    type="text"
                    name="description"
                    placeholder="Nueva descripción"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    isTextarea={true}
                />
                {errors.description && (
                    <p className="text-red-500 text-sm">{errors.description}</p>
                )}
            </div>
            <div>
                <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                    <option value="alta">Alta</option>
                    <option value="media">Media</option>
                    <option value="baja">Baja</option>
                </select>

                <select value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="pendiente">Pendiente</option>
                    <option value="pendiente">En Progreso</option>
                    <option value="completada">Completada</option>
                </select>
            </div>
            <Button type="submit">
                <FaEdit className="mr-2" /> Actualizar Tarea
            </Button>
        </form>
    );
};
