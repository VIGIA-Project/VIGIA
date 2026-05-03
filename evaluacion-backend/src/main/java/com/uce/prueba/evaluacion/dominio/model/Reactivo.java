package com.uce.prueba.evaluacion.dominio.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import java.util.List;

/**
 * Entidad que representa una pregunta del test.
 * Vinculado a subtarea KAN-9.
 */
@Getter
@AllArgsConstructor
public class Reactivo {
    private final Long id;
    private final String enunciado;
    private final List<String> opciones;
    private final Integer peso; // El peso para el cálculo de la nota final
}