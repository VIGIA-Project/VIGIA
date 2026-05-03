package com.uce.prueba.evaluacion.dominio.model;

import java.util.Optional;

/**
 * Puerto (Interface) para la persistencia del dominio de Evaluación.
 * Define cómo se guardan y recuperan los resultados sin mencionar JPA o SQL.
 * Vinculado a subtarea KAN-29.
 */
public interface EvaluacionRepository {

    /**
     * Guarda un reactivo en el sistema.
     */
    void guardarReactivo(Reactivo reactivo);

    /**
     * Busca un reactivo por su identificador único.
     */
    Optional<Reactivo> buscarReactivoPorId(Long id);

    /**
     * Persiste la nota final calculada para un evaluado.
     * Regla de Negocio: Inmutabilidad del Diagnóstico.
     */
    void guardarNota(Long evaluadoId, Nota nota);
}