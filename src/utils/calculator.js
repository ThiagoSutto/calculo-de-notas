import { DEFAULT_SUBJECTS, round2, num, avg } from '../data/defaultSubjects.js';

export const STORAGE_KEY_APP = 'grade_calc_app_v2';
export const STORAGE_KEY_SETTINGS = 'grade_calc_settings_v2';

export const DEFAULT_SETTINGS = {
  academicYear: '2026',
  studentName: '',
  darkMode: false,
};

// Obter valor de campo por caminho (ex: 'provas.p1')
export function getFieldValue(gradesObj, path) {
  if (!gradesObj || !path) return 0;
  const parts = path.split('.');
  let curr = gradesObj;
  for (const p of parts) {
    if (curr === undefined || curr === null) return 0;
    curr = curr[p];
  }
  return curr !== undefined && curr !== null ? curr : 0;
}

// Setar valor de campo por caminho retornando novo objeto
export function setFieldValue(gradesObj, path, value) {
  const parts = path.split('.');
  const newObj = JSON.parse(JSON.stringify(gradesObj || {}));
  let curr = newObj;
  for (let i = 0; i < parts.length - 1; i++) {
    const p = parts[i];
    if (!curr[p] || typeof curr[p] !== 'object') {
      curr[p] = {};
    }
    curr = curr[p];
  }
  curr[parts[parts.length - 1]] = value;
  return newObj;
}

// Calcular resultados de uma matéria qualquer (pré-definida ou customizada)
export function calculateSubjectResult(subject) {
  if (!subject) return { mf: 0, mp: 0, mt: 0, subresults: [] };

  // Se tiver função calculate no objeto (matérias originais de Engenharia)
  if (typeof subject.calculate === 'function') {
    try {
      return subject.calculate(subject.grades || {});
    } catch (e) {
      console.error('Erro ao calcular matéria:', subject.id, e);
    }
  }

  // Matéria customizada (para qualquer ano ou qualquer outra faculdade)
  const customConfig = subject.customConfig || {
    type: 'weighted_blocks',
    provasWeight: 70,
    trabalhosWeight: 30,
  };

  const grades = subject.grades || {};

  if (customConfig.type === 'simple_avg') {
    const items = subject.sections?.[0]?.fields || [];
    const values = items.map((it) => num(getFieldValue(grades, it.key)));
    const mf = avg(values);
    return {
      mf: round2(mf),
      subresults: [
        {
          label: 'Média Simples',
          value: round2(mf),
          formula: `${items.length} avaliações com mesmo peso`,
        },
      ],
    };
  }

  if (customConfig.type === 'weighted_items') {
    const items = subject.sections?.[0]?.fields || [];
    let sumWeight = 0;
    let sumProd = 0;
    items.forEach((it) => {
      const w = num(it.weightVal) || 1;
      const v = num(getFieldValue(grades, it.key));
      sumWeight += w;
      sumProd += v * w;
    });
    const mf = sumWeight > 0 ? sumProd / sumWeight : 0;
    return {
      mf: round2(mf),
      subresults: [
        {
          label: 'Média Ponderada',
          value: round2(mf),
          formula: `Soma dos produtos / Soma dos pesos (${sumWeight})`,
        },
      ],
    };
  }

  // Padrão: Blocos de Provas + Trabalhos
  const pWeight = num(customConfig.provasWeight) || 70;
  const tWeight = num(customConfig.trabalhosWeight) || 30;
  const totalWeight = pWeight + tWeight;

  const provasItems = (subject.sections?.[0]?.fields || []).map((f) =>
    num(getFieldValue(grades, f.key))
  );
  const trabalhosItems = (subject.sections?.[1]?.fields || []).map((f) =>
    num(getFieldValue(grades, f.key))
  );

  const mp = avg(provasItems);
  const mt = avg(trabalhosItems);
  const mf = totalWeight > 0 ? (mp * pWeight + mt * tWeight) / totalWeight : 0;

  return {
    mp: round2(mp),
    mt: round2(mt),
    mf: round2(mf),
    subresults: [
      { label: `Média Provas (${pWeight}%)`, value: round2(mp), formula: 'Média das provas' },
      { label: `Média Trabalhos (${tWeight}%)`, value: round2(mt), formula: 'Média dos trabalhos' },
    ],
  };
}

// Status de aprovação de uma disciplina
export function getSubjectStatus(subject, passingGrade = 6.0) {
  const result = calculateSubjectResult(subject);
  const mf = result.mf;

  // Verificar se há simulação de nota pendente
  let sim = null;
  if (typeof subject.simulatePending === 'function') {
    sim = subject.simulatePending(subject.grades || {}, passingGrade);
  }

  if (mf >= passingGrade) {
    return {
      type: 'approved',
      label: 'Aprovado',
      badgeClass:
        'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
      description: `Média final de ${mf.toFixed(2)} atingiu a meta de ${passingGrade.toFixed(1)}!`,
      simulation: sim,
    };
  }

  if (sim && !sim.isPossible) {
    return {
      type: 'failed',
      label: 'Risco Alto',
      badgeClass:
        'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 border-rose-200 dark:border-rose-800',
      description: `Necessita nota superior a 10.0 (${sim.neededValue.toFixed(2)}) para aprovação direta.`,
      simulation: sim,
    };
  }

  if (sim && sim.neededValue > 0) {
    return {
      type: 'pending',
      label: 'Em Andamento',
      badgeClass:
        'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border-amber-200 dark:border-amber-800',
      description: `Precisa tirar ${sim.neededValue.toFixed(2)} em ${sim.label} para passar.`,
      simulation: sim,
    };
  }

  return {
    type: 'pending',
    label: 'Em Curso',
    badgeClass:
      'bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    description: `Média atual: ${mf.toFixed(2)}. Faltam avaliações.`,
    simulation: sim,
  };
}

// Associar funções de cálculo às matérias padrão conhecidas
export function bindSubjectFunctions(subjectList) {
  if (!Array.isArray(subjectList)) return [];
  return subjectList.map((s) => {
    const original = DEFAULT_SUBJECTS.find((d) => d.id === s.id);
    if (original) {
      // Mesclar notas garantindo que novas chaves/campos do modelo padrão existam sem perder notas já digitadas
      const mergedGrades = JSON.parse(JSON.stringify(original.grades || {}));
      if (s.grades && typeof s.grades === 'object') {
        Object.keys(s.grades).forEach((groupKey) => {
          if (
            typeof s.grades[groupKey] === 'object' &&
            s.grades[groupKey] !== null &&
            !Array.isArray(s.grades[groupKey])
          ) {
            mergedGrades[groupKey] = {
              ...(mergedGrades[groupKey] || {}),
              ...s.grades[groupKey],
            };
          } else {
            mergedGrades[groupKey] = s.grades[groupKey];
          }
        });
      }

      return {
        ...original,
        ...s,
        grades: mergedGrades,
        description: original.description,
        sections: original.sections,
        formulaDescription: original.formulaDescription,
        calculate: original.calculate,
        simulatePending: original.simulatePending,
      };
    }
    return s;
  });
}

// Inicializar dados do app com suporte multi-ano
export function getInitialAppData() {
  const defaultYear = {
    id: '2026',
    label: 'Ano Letivo 2026 (Engenharia)',
    passingGrade: 6.0,
    institution: 'Faculdade de Engenharia',
    subjects: DEFAULT_SUBJECTS.map((s) => ({
      ...s,
      grades: JSON.parse(JSON.stringify(s.grades)),
    })),
  };

  return {
    activeYearId: '2026',
    years: [defaultYear],
  };
}

// Carregar App Data com migração transparente
export function loadAppData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_APP);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.years) && parsed.years.length > 0) {
        // Vincular funções de cálculo para cada ano
        const yearsWithFn = parsed.years.map((y) => {
          const currentPassingGrade =
            y.passingGrade === 5.0 || !y.passingGrade ? 6.0 : y.passingGrade;
          return {
            ...y,
            passingGrade: currentPassingGrade,
            subjects: bindSubjectFunctions(y.subjects || []),
          };
        });
        return {
          activeYearId: parsed.activeYearId || parsed.years[0].id,
          years: yearsWithFn,
        };
      }
    }

    // Verificar se existe a versão antiga grade_calc_subjects_v1 para migrar
    const legacyRaw = localStorage.getItem('grade_calc_subjects_v1');
    if (legacyRaw) {
      const legacySubjects = JSON.parse(legacyRaw);
      const appData = getInitialAppData();
      appData.years[0].subjects = bindSubjectFunctions(legacySubjects);
      saveAppData(appData);
      return appData;
    }
  } catch (err) {
    console.warn('Erro ao carregar do localStorage, usando valores iniciais:', err);
  }

  return getInitialAppData();
}

// Salvar App Data (remove funções antes de serializar)
export function saveAppData(appData) {
  try {
    const cleanYears = appData.years.map((year) => ({
      ...year,
      subjects: (year.subjects || []).map((s) => {
        const copy = { ...s };
        delete copy.calculate;
        delete copy.simulatePending;
        return copy;
      }),
    }));

    const payload = {
      activeYearId: appData.activeYearId,
      years: cleanYears,
    };

    localStorage.setItem(STORAGE_KEY_APP, JSON.stringify(payload));
  } catch (err) {
    console.error('Falha ao salvar no localStorage:', err);
  }
}

// Carregar e salvar configurações globais
export function loadSavedSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SETTINGS);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings) {
  try {
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
  } catch (err) {
    console.error('Falha ao salvar configurações:', err);
  }
}
