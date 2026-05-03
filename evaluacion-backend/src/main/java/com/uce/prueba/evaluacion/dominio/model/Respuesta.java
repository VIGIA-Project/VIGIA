package com.uce.prueba.evaluacion.dominio.model;

import lombok.Value;

/**
 * Value Object que representa la respuesta dada por un evaluado.
 * Vinculado a subtarea KAN-10.
 */
@Value
public class Respuesta {
    Long reactivoId; // Referencia al reactivo
    String opcionSeleccionada;

    public Respuesta(Long reactivoId, String opcionSeleccionada) {
        if (reactivoId == null) {
            throw new IllegalArgumentException(
                    "La respuesta debe estar vinculada a un reactivo (reactivoId no puede ser nulo)");
        }
        if (opcionSeleccionada == null || opcionSeleccionada.trim().isEmpty()) {
            throw new IllegalArgumentException("La opción seleccionada no puede estar vacía");
        }
        this.reactivoId = reactivoId;
        this.opcionSeleccionada = opcionSeleccionada;
    }
}