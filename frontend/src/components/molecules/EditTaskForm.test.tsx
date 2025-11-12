import { render, screen, fireEvent, act } from "@testing-library/react";
import { EditTaskForm } from "./EditTaskForm";
import React from "react";

describe("EditTaskForm Component", () => {
    const defaultProps = {
        id: "1",
        currentTitle: "Tarea original",
        currentDescription: "Descripción original",
        currentPriority: "media",
        currentStatus: "pendiente",
        onTaskUpdated: jest.fn(),
        onClose: jest.fn(),
        onEdit: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("renders the form with initial values", () => {
        render(<EditTaskForm {...defaultProps} />);

        expect(screen.getByDisplayValue("Tarea original")).toBeInTheDocument();
        expect(screen.getByDisplayValue("Descripción original")).toBeInTheDocument();
        expect(screen.getByDisplayValue("Media")).toBeInTheDocument();
        expect(screen.getByDisplayValue("Pendiente")).toBeInTheDocument();
    });

    it("shows validation errors for invalid title and description", async () => {
        render(<EditTaskForm {...defaultProps} />);

        await act(async () => {
            fireEvent.change(screen.getByPlaceholderText("Nuevo título"), {
                target: { value: "a" },
            });
            fireEvent.change(screen.getByPlaceholderText("Nueva descripción"), {
                target: { value: "1234" },
            });
            fireEvent.submit(screen.getByRole("button", { name: /Actualizar Tarea/i }));
        });

        expect(
            await screen.findByText("El título debe tener entre 3 y 50 caracteres.")
        ).toBeInTheDocument();
        expect(
            await screen.findByText("La descripción debe tener entre 5 y 200 caracteres.")
        ).toBeInTheDocument();
    });

    it("calls onEdit, onTaskUpdated y onClose con datos correctos al actualizar", async () => {
        render(<EditTaskForm {...defaultProps} />);

        await act(async () => {
            fireEvent.change(screen.getByPlaceholderText("Nuevo título"), {
                target: { value: "Tarea modificada" },
            });
            fireEvent.change(screen.getByPlaceholderText("Nueva descripción"), {
                target: { value: "Descripción modificada" },
            });
            fireEvent.change(screen.getByLabelText("Prioridad:"), {
                target: { value: "alta" },
            });
            fireEvent.change(screen.getByLabelText("Estado:"), {
                target: { value: "en progreso" },
            });

            fireEvent.submit(screen.getByRole("button", { name: /Actualizar Tarea/i }));
        });

        expect(defaultProps.onEdit).toHaveBeenCalledWith(
            "Tarea modificada",
            "Descripción modificada",
            "alta",
            "en progreso"
        );
        expect(defaultProps.onTaskUpdated).toHaveBeenCalledTimes(1);
        expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
    });

    it("bloquea los campos y no muestra el botón si la tarea está completada", () => {
    render(
        <EditTaskForm
            {...defaultProps}
            currentStatus="completada"
        />
    );

    expect(screen.getByPlaceholderText("Nuevo título")).toBeDisabled();
    expect(screen.getByPlaceholderText("Nueva descripción")).toBeDisabled();
    expect(screen.getByLabelText("Prioridad:")).toBeDisabled();
    expect(screen.getByLabelText("Estado:")).toBeDisabled();

    // Botón NO se renderiza
    expect(
        screen.queryByRole("button", { name: /actualizar tarea/i })
    ).not.toBeInTheDocument();

    // Mensaje informativo
    expect(
        screen.getByText(/esta tarea está completada y no se puede editar/i)
    ).toBeInTheDocument();
});


    it("muestra las opciones correctas de estado según el estado actual", () => {
        const { rerender } = render(
            <EditTaskForm {...defaultProps} currentStatus="pendiente" />
        );

        // Estado 'pendiente' → debe mostrar 'Pendiente' y 'En progreso'
        expect(screen.getByRole("option", { name: /pendiente/i })).toBeInTheDocument();
        expect(screen.getByRole("option", { name: /en progreso/i })).toBeInTheDocument();
        expect(screen.queryByRole("option", { name: /completada/i })).not.toBeInTheDocument();

        // Estado 'en progreso' → debe mostrar 'En progreso' y 'Completada'
        rerender(<EditTaskForm {...defaultProps} currentStatus="en progreso" />);
        expect(screen.getByRole("option", { name: /en progreso/i })).toBeInTheDocument();
        expect(screen.getByRole("option", { name: /completada/i })).toBeInTheDocument();
        expect(screen.queryByRole("option", { name: /pendiente/i })).not.toBeInTheDocument();

        // Estado 'completada' → solo debe mostrar 'Completada'
        rerender(<EditTaskForm {...defaultProps} currentStatus="completada" />);
        expect(screen.getByRole("option", { name: /completada/i })).toBeInTheDocument();
        expect(screen.queryByRole("option", { name: /pendiente/i })).not.toBeInTheDocument();
        expect(screen.queryByRole("option", { name: /en progreso/i })).not.toBeInTheDocument();
    });

});
