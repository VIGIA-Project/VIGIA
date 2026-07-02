package com.uce.prueba.evaluacion.dominio.eventos;

import com.uce.prueba.evaluacion.dominio.model.Respuesta;
import lombok.Value;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Evento de Dominio que se publica cuando un Evaluado termina su test.
 * Transporta los datos necesarios para que el Motor de Diagnóstico inicie el
 * cálculo.
 * Vinculado a subtarea KAN-28.
 */
@Value
public class ExamenFinalizado {
    Long evaluadoId; // Identidad del estudiante (Frontera con BC_Acceso)
    List<Respuesta> respuestas; // Lista de Value Objects con las respuestas dadas
    LocalDateTime fechaFinalizacion;

    public ExamenFinalizado(Long evaluadoId, List<Respuesta> respuestas) {
        if (evaluadoId == null) {
            throw new IllegalArgumentException("El ID del evaluado es obligatorio para el evento");
        }
        if (respuestas == null || respuestas.isEmpty()) {
            throw new IllegalArgumentException("El evento debe contener al menos una respuesta para ser procesado");
        }
        this.evaluadoId = evaluadoId;
        this.respuestas = List.copyOf(respuestas); // Mantenemos la inmutabilidad
        this.fechaFinalizacion = LocalDateTime.now();
    }
}