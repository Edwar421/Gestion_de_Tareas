import { render, screen, fireEvent, act } from "@testing-library/react";
import { TaskForm } from "./TaskForm";
import * as api from "../../services/api";

jest.mock("../../services/api");

describe("TaskForm Component", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("renders all form fields", () => {
        render(<TaskForm onTaskCreated={jest.fn()} />);

        expect(screen.getByPlaceholderText("Título de la tarea")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Descripción")).toBeInTheDocument();
        expect(screen.getByLabelText("Prioridad")).toBeInTheDocument();
        expect(screen.getByLabelText("Estado")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /Agregar Tarea/i })).toBeInTheDocument();
    });

    it("shows validation errors for invalid input", async () => {
        render(<TaskForm onTaskCreated={jest.fn()} />);

        await act(async () => {
            fireEvent.submit(screen.getByRole("button", { name: /Agregar Tarea/i }));
        });

        expect(await screen.findByText("El título debe tener entre 3 y 50 caracteres.")).toBeInTheDocument();
        expect(await screen.findByText("La descripción debe tener entre 5 y 200 caracteres.")).toBeInTheDocument();
        expect(await screen.findByText("Debes seleccionar una prioridad.")).toBeInTheDocument();
        expect(await screen.findByText("Debes seleccionar un estado.")).toBeInTheDocument();
    });

    it("submits valid data and calls onTaskCreated", async () => {
        const onTaskCreated = jest.fn();
        (api.createTask as jest.Mock).mockResolvedValueOnce({});

        render(<TaskForm onTaskCreated={onTaskCreated} />);

        await act(async () => {
            fireEvent.change(screen.getByPlaceholderText("Título de la tarea"), {
                target: { value: "Nueva tarea" },
            });
            fireEvent.change(screen.getByPlaceholderText("Descripción"), {
                target: { value: "Descripción válida de la tarea" },
            });
            fireEvent.change(screen.getByLabelText("Prioridad"), {
                target: { value: "alta" },
            });
            fireEvent.change(screen.getByLabelText("Estado"), {
                target: { value: "pendiente" },
            });
            fireEvent.submit(screen.getByRole("button", { name: /Agregar Tarea/i }));
        });

        expect(api.createTask).toHaveBeenCalledWith(
            "Nueva tarea",
            "Descripción válida de la tarea",
            "alta",
            "pendiente"
        );
        expect(onTaskCreated).toHaveBeenCalledTimes(1);
    });

    it("resets form after successful submission", async () => {
        (api.createTask as jest.Mock).mockResolvedValueOnce({});
        const onTaskCreated = jest.fn();

        render(<TaskForm onTaskCreated={onTaskCreated} />);

        await act(async () => {
            fireEvent.change(screen.getByPlaceholderText("Título de la tarea"), {
                target: { value: "Tarea temporal" },
            });
            fireEvent.change(screen.getByPlaceholderText("Descripción"), {
                target: { value: "Descripción temporal" },
            });
            fireEvent.change(screen.getByLabelText("Prioridad"), {
                target: { value: "baja" },
            });
            fireEvent.change(screen.getByLabelText("Estado"), {
                target: { value: "completada" },
            });
            fireEvent.submit(screen.getByRole("button", { name: /Agregar Tarea/i }));
        });

        // Verificar que los campos se limpian
        expect((screen.getByPlaceholderText("Título de la tarea") as HTMLInputElement).value).toBe("");
        expect((screen.getByPlaceholderText("Descripción") as HTMLInputElement).value).toBe("");
        expect((screen.getByLabelText("Prioridad") as HTMLSelectElement).value).toBe("");
        expect((screen.getByLabelText("Estado") as HTMLSelectElement).value).toBe("");
    });
});
