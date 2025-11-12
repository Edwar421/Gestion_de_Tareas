import React, { useState } from "react";
import { Input } from "../atoms/Input";
import { Button } from "../atoms/Button";
import { FaPlusCircle } from "react-icons/fa";
import { createTask } from "../../services/api";

interface TaskFormProps {
    onTaskCreated: () => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({ onTaskCreated }) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
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
        await createTask(title, description, priority, status);
        setTitle("");
        setDescription("");
        setPriority("media");
        setStatus("pendiente");
        setErrors({});
        onTaskCreated();
    };
    return (
        <form onSubmit={handleSubmit} className="px-8 py-4">
            <div>
                <Input
                    type="text"
                    name="title"
                    placeholder="Título de la tarea"
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
                    placeholder="Descripción"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    isTextarea={true}
                />
                {errors.description && (
                    <p className="text-red-500 text-sm">{errors.description}</p>
                )}
            </div>
            {/* Campo de Prioridad */}
            <div>
                <label className="block text-gray-700 text-sm font-bold mb-1">
                    Prioridad
                </label>
                <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                >
                    <option value="baja">Baja</option>
                    <option value="media">Media</option>
                    <option value="alta">Alta</option>
                </select>
            </div>

            {/* Campo de Estado */}
            <div>
                <label className="block text-gray-700 text-sm font-bold mb-1">
                    Estado
                </label>
                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                >
                    <option value="pendiente">Pendiente</option>
                    <option value="en progreso">En progreso</option>
                    <option value="completada">Completada</option>
                </select>
            </div>
            <Button type="submit">
                <FaPlusCircle className="mr-2" /> Agregar Tarea
            </Button>
        </form>
    );
};
