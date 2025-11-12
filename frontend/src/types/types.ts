export interface Task {
    id: number;
    title: string;
    description: string;
    priority: "alta" | "media" | "baja";
    status: "pendiente" | "en progreso" | "completada";
    date?: string;
}
