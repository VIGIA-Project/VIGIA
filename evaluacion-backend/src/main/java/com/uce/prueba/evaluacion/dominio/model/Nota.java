package com.uce.prueba.evaluacion.dominio.model;

import lombok.Value;
import java.time.LocalDateTime;

/**
 * Entidad de Dominio que representa la calificación final.
 * Regla de Negocio: Inmutabilidad del Diagnóstico una vez procesado.
 * Vinculado a subtarea KAN-26.
 */
@Value
public class Nota {
    Double valor; // El puntaje final calculado
    LocalDateTime fechaGeneracion;
    String observaciones; // Detalles adicionales del desempeño

    public Nota(Double valor) {
        if (valor < 0 || valor > 10) { // Ejemplo de validación de rango académico
            throw new IllegalArgumentException("La nota debe estar en un rango válido (0-10)");
        }
        this.valor = valor;
        this.fechaGeneracion = LocalDateTime.now();
        this.observaciones = "Diagnóstico generado automáticamente por el sistema.";
    }
}