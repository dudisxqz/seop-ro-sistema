package com.edusync.api.grade.model.dto;

import com.edusync.api.aluno.model.Materia;
import com.edusync.api.grade.model.GradeHoraria.DiaSemana;
import com.edusync.api.grade.model.GradeHoraria.HorarioAula;

public record GradeHorariaDTO(
        String turma,
        DiaSemana dia,
        HorarioAula horario,
        Materia materia
) {}