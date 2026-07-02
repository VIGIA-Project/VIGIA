package com.uce.prueba.evaluacion.dominio.model;

/**
 * Enum que representa el nivel cualitativo de conocimiento alcanzado.
 * Basado en el Glosario de Lenguaje Ubicuo.
 * Vinculado a subtarea KAN-27.
 */
public enum NivelComprension {
    BASICO("Nivel inicial de conocimiento en la materia."),
    INTERMEDIO("Conocimiento sólido con capacidad de aplicación práctica."),
    AVANZADO("Dominio experto y capacidad de resolución de problemas complejos.");

    private final String descripcion;

    NivelComprension(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getDescripcion() {
        return descripcion;
    }
}