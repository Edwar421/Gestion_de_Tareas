import { Request, Response } from "express";
import { AppDataSource } from "../../ormconfig";
import { Task, TaskPriority, TaskStatus } from "../../entities/Task";

const taskRepository = AppDataSource.getRepository(Task);

const validateTaskFields = (title: string, description: string, priority?: TaskPriority, status?: TaskStatus) => {
    const errors: string[] = [];

    if (!title || title.length < 3 || title.length > 50) {
        errors.push("El título debe tener entre 3 y 50 caracteres.");
    }

    if (!description || description.length < 5 || description.length > 200) {
        errors.push("La descripción debe tener entre 5 y 200 caracteres.");
    }

    if (priority && !Object.values(TaskPriority).includes(priority)) {
        errors.push("La prioridad debe ser: baja, media o alta.");
    }

    if (status && !Object.values(TaskStatus).includes(status)) {
        errors.push("El estado debe ser: pendiente, en progreso o completada.");
    }

    return errors;
};

export const getTasks = async (req: Request, res: Response) => {
    try {
        const tasks = await taskRepository.find({
            where: { user: { email: (req as any).user.email } },
        });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({
            message: "Error fetching tasks",
            error: (error as Error).message,
        });
    }
};

export const createTask = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { title, description, priority, status } = req.body;

        const validationErrors = validateTaskFields(title, description);
        if (validationErrors.length > 0) {
            res.status(400).json({ errors: validationErrors });
            return;
        }

        const task = new Task();
        task.title = title;
        task.description = description;
        task.priority = priority || TaskPriority.MEDIUM;
        task.status = status || TaskStatus.PENDING;
        task.user = (req as any).user.email;
        await taskRepository.save(task);
        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({
            message: "Error creating task",
            error: (error as Error).message,
        });
    }
};

export const updateTask = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { title, description, priority, status } = req.body;

        const validationErrors = validateTaskFields(title, description);
        if (validationErrors.length > 0) {
            res.status(400).json({ errors: validationErrors });
            return;
        }

        const task = await taskRepository.findOne({
            where: {
                id: parseInt(id),
                user: { email: (req as any).user.email },
            },
        });
        if (!task) {
            res.status(404).json({ message: "Task not found" });
            return;
        }

        task.title = title;
        task.description = description;
        task.priority = (req.body.priority as TaskPriority) ?? task.priority;
        task.status = (req.body.status as TaskStatus) ?? task.status;
        //task.date = new Date();

        await taskRepository.save(task);
        res.json(task);
    } catch (error) {
        res.status(500).json({
            message: "Error updating task",
            error: (error as Error).message,
        });
    }
};

export const deleteTask = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const task = await taskRepository.findOne({
            where: {
                id: parseInt(id),
                user: { email: (req as any).user.email },
            },
        });
        if (!task) {
            res.status(404).json({ message: "Task not found" });
            return;
        }

        await taskRepository.delete(id);
        res.status(200).json({
            message: `Task with id ${id} has been deleted`,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error deleting task",
            error: (error as Error).message,
        });
    }
};
