import { render, screen, fireEvent, act } from "@testing-library/react";
import { TaskForm } from "./TaskForm";
import * as api from "../../services/api";

jest.mock("../../services/api");

describe("TaskForm Component", () => {
    it("renders the form fields", () => {
        render(<TaskForm onTaskCreated={jest.fn()} />);
        expect(
            screen.getByPlaceholderText("Título de la tarea")
        ).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Descripción")).toBeInTheDocument();
    });

    it("shows validation errors for invalid input", async () => {
        render(<TaskForm onTaskCreated={jest.fn()} />);
        await act(async () => {
            fireEvent.submit(
                screen.getByRole("button", { name: /Agregar Tarea/i })
            );
        });
        expect(
            await screen.findByText(
                "El título debe tener entre 3 y 50 caracteres."
            )
        ).toBeInTheDocument();
        expect(
            await screen.findByText(
                "La descripción debe tener entre 5 y 200 caracteres."
            )
        ).toBeInTheDocument();
    });

    it("calls onTaskCreated when the form is submitted with valid input", async () => {
        const onTaskCreated = jest.fn();
        (api.createTask as jest.Mock).mockResolvedValueOnce({});

        render(<TaskForm onTaskCreated={onTaskCreated} />);
        await act(async () => {
            fireEvent.change(
                screen.getByPlaceholderText("Título de la tarea"),
                {
                    target: { value: "Nueva tarea" },
                }
            );
            fireEvent.change(screen.getByPlaceholderText("Descripción"), {
                target: { value: "Descripción de la tarea" },
            });
            fireEvent.submit(
                screen.getByRole("button", { name: /Agregar Tarea/i })
            );
        });

        expect(await api.createTask).toHaveBeenCalledWith(
            "Nueva tarea",
            "Descripción de la tarea"
        );
        expect(onTaskCreated).toHaveBeenCalledTimes(1);
    });
});
