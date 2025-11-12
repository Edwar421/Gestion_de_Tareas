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
        await createTask(title, description);
        setTitle("");
        setDescription("");
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
            <Button type="submit">
                <FaPlusCircle className="mr-2" /> Agregar Tarea
            </Button>
        </form>
    );
};
