// =======================================================================================
// GUIA DE PERSONALIZAÇÃO DOS NOMES DAS NOTAS:
// 
// Para mudar qualquer nome exibido na tela, basta editar o valor de "label" ou "title"!
// Exemplo:
//   label: 'Prova 1 (P1)'  --->  mude para:  label: 'P1 Teórica' ou 'Prova Presencial 1'
//   label: 'Atividade 1 (a1)' ---> mude para: label: 'Lista de Exercícios 1'
//   weight: 'Peso 2'       --->  mude para:  weight: 'Peso 20%'
//
// As fórmulas e cálculos matemáticos estão definidos na função "calculate" de cada matéria.
// =======================================================================================

export const INITIAL_PASSING_GRADE = 5.0;

// Funções utilitárias seguras de cálculo
export const num = (val) => {
  if (val === null || val === undefined || val === '') return 0;
  const parsed = typeof val === 'number' ? val : parseFloat(String(val).replace(',', '.'));
  return isNaN(parsed) ? 0 : parsed;
};

export const round2 = (val) => {
  if (typeof val !== 'number' || isNaN(val)) return 0;
  return Math.round((val + Number.EPSILON) * 100) / 100;
};

export const avg = (arr) => {
  if (!arr || arr.length === 0) return 0;
  const numbers = arr.map(num);
  const sum = numbers.reduce((a, b) => a + b, 0);
  return sum / numbers.length;
};

// =======================================================================================
// DEFINIÇÃO DAS MATÉRIAS COM DIVISÃO POR SEMESTRES / BIMESTRES
// =======================================================================================

export const DEFAULT_SUBJECTS = [
  // -------------------------------------------------------------------------------------
  // 1. RESMAT (Resistência dos Materiais)
  // -------------------------------------------------------------------------------------
  {
    id: 'resmat',
    code: 'RESMAT',
    name: 'Resistência dos Materiais',
    color: 'indigo',
    description: 'Provas P e Trabalhos T',
    isCustom: false,
    formulaDescription: 'MF = (MP + MT) / 2 | MP = (2·p1 + 2·p2 + 3·p3 + 3·p4)/10 | MT = (t1 + t2)/2',
    grades: {
      provas: { p1: 0, p2: 0, p3: 0, p4: 0 },
      t1_atividades: { a1: 0, a2: 0, a3: 0, a4: 0 },
      t2_atividades: { a5: 0, a6: 0, a7: 0, a8: 0 },
    },
    sections: [
      {
        id: 'sem1_resmat',
        semester: 1,
        title: '1º Semestre • Provas e Trabalhos',
        fields: [
          { key: 'provas.p1', label: 'Prova 1 (P1)', weight: 'Peso 2', max: 10 },
          { key: 'provas.p2', label: 'Prova 2 (P2)', weight: 'Peso 2', max: 10 },
          { key: 't1_atividades.a1', label: 'Atividade 1 ', weight: 't1', max: 10 },
          { key: 't1_atividades.a2', label: 'Atividade 2 ', weight: 't1', max: 10 },
          { key: 't1_atividades.a3', label: 'Atividade 3 ', weight: 't1', max: 10 },
          { key: 't1_atividades.a4', label: 'Atividade 4 ', weight: 't1', max: 10 },
        ],
      },
      {
        id: 'sem2_resmat',
        semester: 2,
        title: '2º Semestre • Provas e Trabalhos',
        fields: [
          { key: 'provas.p3', label: 'Prova 3 (P3)', weight: 'Peso 3', max: 10 },
          { key: 'provas.p4', label: 'Prova 4 (P4)', weight: 'Peso 3', max: 10 },
          { key: 't2_atividades.a5', label: 'Atividade 5 ', weight: 't2', max: 10 },
          { key: 't2_atividades.a6', label: 'Atividade 6 ', weight: 't2', max: 10 },
          { key: 't2_atividades.a7', label: 'Atividade 7 ', weight: 't2', max: 10 },
          { key: 't2_atividades.a8', label: 'Atividade 8 ', weight: 't2', max: 10 },
        ],
      },
    ],
    calculate: (g) => {
      const p1 = num(g.provas?.p1);
      const p2 = num(g.provas?.p2);
      const p3 = num(g.provas?.p3);
      const p4 = num(g.provas?.p4);
      const mp = (p1 * 2 + p2 * 2 + p3 * 3 + p4 * 3) / 10;

      const t1 = avg([
        g.t1_atividades?.a1,
        g.t1_atividades?.a2,
        g.t1_atividades?.a3,
        g.t1_atividades?.a4,
      ]);
      const t2 = avg([
        g.t2_atividades?.a5,
        g.t2_atividades?.a6,
        g.t2_atividades?.a7,
        g.t2_atividades?.a8,
      ]);
      const mt = (t1 + t2) / 2;
      const mf = (mp + mt) / 2;

      return {
        mp: round2(mp),
        mt: round2(mt),
        mf: round2(mf),
        subresults: [
          { label: 'Média Provas (MP)', value: round2(mp), formula: '(2·p1 + 2·p2 + 3·p3 + 3·p4)/10' },
          { label: 'Trabalho 1º Sem (t1)', value: round2(t1), formula: 'Média(a1..a4)' },
          { label: 'Trabalho 2º Sem (t2)', value: round2(t2), formula: 'Média(a5..a8)' },
          { label: 'Média Trabalhos (MT)', value: round2(mt), formula: '(t1 + t2)/2' },
        ],
      };
    },
    simulatePending: (g, targetMF = 6.0) => {
      const p1 = num(g.provas?.p1);
      const p2 = num(g.provas?.p2);
      const p3 = num(g.provas?.p3);
      const t1 = avg([g.t1_atividades?.a1, g.t1_atividades?.a2, g.t1_atividades?.a3, g.t1_atividades?.a4]);
      const t2 = avg([g.t2_atividades?.a5, g.t2_atividades?.a6, g.t2_atividades?.a7, g.t2_atividades?.a8]);
      const mt = (t1 + t2) / 2;
      const neededMP = 2 * targetMF - mt;
      const neededP4 = (neededMP * 10 - (p1 * 2 + p2 * 2 + p3 * 3)) / 3;
      return {
        fieldKey: 'provas.p4',
        label: 'Prova 4 (P4)',
        neededValue: round2(Math.max(0, neededP4)),
        isPossible: neededP4 <= 10,
        currentValue: num(g.provas?.p4),
      };
    },
  },

  // -------------------------------------------------------------------------------------
  // 2. PROGRAMAÇÃO
  // -------------------------------------------------------------------------------------
  {
    id: 'programacao',
    code: 'PROGRAMAÇÃO',
    name: 'Programação de Computadores',
    color: 'emerald',
    description: '8 Atividades Contínuas (80%) + Listas (20%)',
    isCustom: false,
    formulaDescription: 'MF = (ML·2 + MA·8) / 10 | MA = Média(a1..a8) | ML = Listas',
    grades: {
      atividades: {
        a1: 0,
        a2: 0,
        a3: 0,
        a4: 0,
        a5: 0,
        a6: 0,
        a7: 0,
        a8: 0,
      },
      laboratorio: { ml: 0 },
    },
    sections: [
      {
        id: 'sem1_prog',
        semester: 1,
        title: '1º Semestre • Atividades',
        fields: [
          { key: 'atividades.a1', label: 'Atividade 1 ', max: 10 },
          { key: 'atividades.a2', label: 'Atividade 2 ', max: 10 },
          { key: 'atividades.a3', label: 'Atividade 3 ', max: 10 },
          { key: 'atividades.a4', label: 'Atividade 4 ', max: 10 },
        ],
      },
      {
        id: 'sem2_prog',
        semester: 2,
        title: '2º Semestre • Atividades e Laboratório',
        fields: [
          { key: 'atividades.a5', label: 'Atividade 5 ', max: 10 },
          { key: 'atividades.a6', label: 'Atividade 6 ', max: 10 },
          { key: 'atividades.a7', label: 'Atividade 7 ', max: 10 },
          { key: 'atividades.a8', label: 'Atividade 8 ', max: 10 },
          { key: 'laboratorio.ml', label: 'Listas (ML)', weight: 'Peso 20%', max: 10 },
        ],
      },
    ],
    calculate: (g) => {
      const atvs = [
        g.atividades?.a1,
        g.atividades?.a2,
        g.atividades?.a3,
        g.atividades?.a4,
        g.atividades?.a5,
        g.atividades?.a6,
        g.atividades?.a7,
        g.atividades?.a8,
      ];
      const ma = avg(atvs);
      const ml = num(g.laboratorio?.ml);
      const mf = (ml * 2 + ma * 8) / 10;
      return {
        ma: round2(ma),
        ml: round2(ml),
        mf: round2(mf),
        subresults: [
          { label: 'Média Atividades (MA)', value: round2(ma), formula: 'Média(a1..a8)' },
          { label: 'Nota Laboratório (ML)', value: round2(ml), formula: 'Nota Direta' },
        ],
      };
    },
    simulatePending: (g, targetMF = 6.0) => {
      const ml = num(g.laboratorio?.ml);
      const first7 = [
        g.atividades?.a1,
        g.atividades?.a2,
        g.atividades?.a3,
        g.atividades?.a4,
        g.atividades?.a5,
        g.atividades?.a6,
        g.atividades?.a7,
      ].reduce((acc, val) => acc + num(val), 0);
      const neededA8 = 10 * targetMF - 2 * ml - first7;
      return {
        fieldKey: 'atividades.a8',
        label: 'Atividade 8 (a8)',
        neededValue: round2(Math.max(0, neededA8)),
        isPossible: neededA8 <= 10,
        currentValue: num(g.atividades?.a8),
      };
    },
  },

  // -------------------------------------------------------------------------------------
  // 3. MATCOMP (Matemática Computacional)
  // -------------------------------------------------------------------------------------
  {
    id: 'matcomp',
    code: 'MATCOMP',
    name: 'Matemática Computacional',
    color: 'blue',
    description: 'Módulo 1 / T1 (60%) e Módulo 2 / T2 (40%)',
    isCustom: false,
    formulaDescription: 'MF = (T1·6 + T2·4) / 10 | T1=(AG01+AG02+AI01+EAT01)/4 | T2=(AG03+AG04+AI02+EAT02)/4',
    grades: {
      t1: {
        ag01: 0,
        ag02: 0,
        ai01: 0,
        eat1_1: 0,
        eat1_2: 0,
        eat1_3: 0,
        eat1_4: 0,
      },
      t2: {
        ag03: 0,
        ag04: 0,
        ai02: 0,
        eat2_1: 0,
        eat2_2: 0,
        eat2_3: 0,
        eat2_4: 0,
      },
    },
    sections: [
      {
        id: 'sem1_matcomp',
        semester: 1,
        title: '1º Semestre • Módulo 1 (T1 - Peso 60%)',
        fields: [
          { key: 't1.ag01', label: 'AG01 + presença "C6"', max: 10 },
          { key: 't1.ag02', label: 'AG02 + presença "C6"', max: 10 },
          { key: 't1.ai01', label: 'AI01', max: 10 },
          { key: 't1.eat1_1', label: 'EAT01 - 1', max: 10 },
          { key: 't1.eat1_2', label: 'EAT01 - 2', max: 10 },
          { key: 't1.eat1_3', label: 'EAT01 - 3', max: 10 },
          { key: 't1.eat1_4', label: 'EAT01 - 4', max: 10 },
        ],
      },
      {
        id: 'sem2_matcomp',
        semester: 2,
        title: '2º Semestre • Módulo 2 (T2 - Peso 40%)',
        fields: [
          { key: 't2.ag03', label: 'AG03 + presença "C6"', max: 10 },
          { key: 't2.ag04', label: 'AG04 + presença "C6"', max: 10 },
          { key: 't2.ai02', label: 'AI02', max: 10 },
          { key: 't2.eat2_1', label: 'EAT02 - 1', max: 10 },
          { key: 't2.eat2_2', label: 'EAT02 - 2', max: 10 },
          { key: 't2.eat2_3', label: 'EAT02 - 3', max: 10 },
          { key: 't2.eat2_4', label: 'EAT02 - 4', max: 10 },
        ],
      },
    ],
    calculate: (g) => {
      const eat01 = avg([g.t1?.eat1_1, g.t1?.eat1_2, g.t1?.eat1_3, g.t1?.eat1_4]);
      const t1Val = (num(g.t1?.ag01) + num(g.t1?.ag02) + num(g.t1?.ai01) + eat01) / 4;

      const eat02 = avg([g.t2?.eat2_1, g.t2?.eat2_2, g.t2?.eat2_3, g.t2?.eat2_4]);
      const t2Val = (num(g.t2?.ag03) + num(g.t2?.ag04) + num(g.t2?.ai02) + eat02) / 4;

      const mf = (t1Val * 6 + t2Val * 4) / 10;
      return {
        t1: round2(t1Val),
        t2: round2(t2Val),
        mf: round2(mf),
        subresults: [
          { label: 'Média EAT01', value: round2(eat01), formula: 'Média(EAT01-1..4)' },
          { label: 'Nota Módulo 1 (T1)', value: round2(t1Val), formula: '(AG01+AG02+AI01+EAT01)/4' },
          { label: 'Média EAT02', value: round2(eat02), formula: 'Média(EAT02-1..4)' },
          { label: 'Nota Módulo 2 (T2)', value: round2(t2Val), formula: '(AG03+AG04+AI02+EAT02)/4' },
        ],
      };
    },
    simulatePending: (g, targetMF = 6.0) => {
      const eat01 = avg([g.t1?.eat1_1, g.t1?.eat1_2, g.t1?.eat1_3, g.t1?.eat1_4]);
      const t1Val = (num(g.t1?.ag01) + num(g.t1?.ag02) + num(g.t1?.ai01) + eat01) / 4;
      const neededT2 = (10 * targetMF - 6 * t1Val) / 4;
      return {
        fieldKey: 't2.ai02',
        label: 'Módulo 2 (T2)',
        neededValue: round2(Math.max(0, neededT2)),
        isPossible: neededT2 <= 10,
        currentValue: 0,
      };
    },
  },

  // -------------------------------------------------------------------------------------
  // 4. CÁLCULO II
  // -------------------------------------------------------------------------------------
  {
    id: 'calculo2',
    code: 'CÁLCULO II',
    name: 'Cálculo Diferencial e Integral II',
    color: 'amber',
    description: 'Provas com pesos 2, 2, 3, 3 (80%) + Média de Trabalhos t1..t4 (20%)',
    isCustom: false,
    formulaDescription: 'MF = (MP·8 + MT·2) / 10 | MP = (2·p1 + 2·p2 + 3·p3 + 3·p4)/10 | MT = (t1+t2+t3+t4)/4',
    grades: {
      provas: { p1: 0, p2: 0, p3: 0, p4: 0 },
      trabalhos: {
        a1: 0,
        a2: 0,
        a3: 0,
        a4: 0,
        a5: 0,
        a6: 0,
      },
    },
    sections: [
      {
        id: 'sem1_calc',
        semester: 1,
        title: '1º Semestre • Provas P1/P2 e Trabalhos',
        fields: [
          { key: 'provas.p1', label: 'Prova 1 (P1)', weight: 'Peso 2', max: 10 },
          { key: 'provas.p2', label: 'Prova 2 (P2)', weight: 'Peso 2', max: 10 },
          { key: 'trabalhos.a1', label: 'Atividade 1', weight: 't1', max: 10 },
          { key: 'trabalhos.a2', label: 'Atividade 2', weight: 't1', max: 10 },
          { key: 'trabalhos.a3', label: 'Atividade 3', weight: 't2', max: 10 },
          { key: 'trabalhos.a4', label: 'Atividade 4', weight: 't2', max: 10 },
        ],
      },
      {
        id: 'sem2_calc',
        semester: 2,
        title: '2º Semestre • Provas P3/P4 e Trabalhos',
        fields: [
          { key: 'provas.p3', label: 'Prova 3 (P3)', weight: 'Peso 3', max: 10 },
          { key: 'provas.p4', label: 'Prova 4 (P4)', weight: 'Peso 3', max: 10 },
          { key: 'trabalhos.a5', label: 'Atividade 5', weight: 't3', max: 10 },
          { key: 'trabalhos.a6', label: 'Atividade 6', weight: 't4', max: 10 },
        ],
      },
    ],
    calculate: (g) => {
      const p1 = num(g.provas?.p1);
      const p2 = num(g.provas?.p2);
      const p3 = num(g.provas?.p3);
      const p4 = num(g.provas?.p4);
      const mp = (p1 * 2 + p2 * 2 + p3 * 3 + p4 * 3) / 10;

      const t1 = avg([g.trabalhos?.a1, g.trabalhos?.a2]);
      const t2 = avg([g.trabalhos?.a3, g.trabalhos?.a4]);
      const t3 = num(g.trabalhos?.a5);
      const t4 = num(g.trabalhos?.a6);
      const mt = (t1 + t2 + t3 + t4) / 4;

      const mf = (mp * 8 + mt * 2) / 10;
      return {
        mp: round2(mp),
        mt: round2(mt),
        mf: round2(mf),
        subresults: [
          { label: 'Média Provas (MP)', value: round2(mp), formula: '(2·p1 + 2·p2 + 3·p3 + 3·p4)/10' },
          { label: 'Trabalho 1 (t1)', value: round2(t1), formula: 'Média(a1, a2)' },
          { label: 'Trabalho 2 (t2)', value: round2(t2), formula: 'Média(a3, a4)' },
          { label: 'Trabalho 3 (t3)', value: round2(t3), formula: 'a5' },
          { label: 'Trabalho 4 (t4)', value: round2(t4), formula: 'a6' },
          { label: 'Média Trabalhos (MT)', value: round2(mt), formula: '(t1 + t2 + t3 + t4)/4' },
        ],
      };
    },
    simulatePending: (g, targetMF = 6.0) => {
      const p1 = num(g.provas?.p1);
      const p2 = num(g.provas?.p2);
      const p3 = num(g.provas?.p3);
      const t1 = avg([g.trabalhos?.a1, g.trabalhos?.a2]);
      const t2 = avg([g.trabalhos?.a3, g.trabalhos?.a4]);
      const t3 = num(g.trabalhos?.a5);
      const t4 = num(g.trabalhos?.a6);
      const mt = (t1 + t2 + t3 + t4) / 4;

      const neededMP = (10 * targetMF - 2 * mt) / 8;
      const neededP4 = (10 * neededMP - (p1 * 2 + p2 * 2 + p3 * 3)) / 3;
      return {
        fieldKey: 'provas.p4',
        label: 'Prova 4 (P4)',
        neededValue: round2(Math.max(0, neededP4)),
        isPossible: neededP4 <= 10,
        currentValue: num(g.provas?.p4),
      };
    },
  },

  // -------------------------------------------------------------------------------------
  // 5. FETRANS (Fenômenos de Transporte)
  // -------------------------------------------------------------------------------------
  {
    id: 'fetrans',
    code: 'FETRANS',
    name: 'Fenômenos de Transporte',
    color: 'rose',
    description: 'Provas P1 e P2 (60%) + 3 Módulos de Trabalhos t1, t2, t3 (40%)',
    isCustom: false,
    formulaDescription: 'MF = (MP·6 + MT·4) / 10 | MP = (2·p1 + 3·p2)/5 | MT = (t1+t2+t3)/3',
    grades: {
      provas: { p1: 0, p2: 0 },
      modulo1: { ae1: 0, ae2: 0, rt: 0, af1: 0 },
      modulo2: { ae1: 0, ae2: 0, rt: 0, af1: 0 },
      modulo3: { ae1: 0, ae2: 0, ae3: 0, rt: 0, af1: 0 },
    },
    sections: [
      {
        id: 'sem1_fetrans',
        semester: 1,
        title: '1º Semestre • Prova 1 e Trabalhos M1/M2',
        fields: [
          { key: 'provas.p1', label: 'Prova 1 (P1)', weight: 'Peso 2', max: 10 },
          { key: 'modulo1.ae1', label: 'AE1 - M1', weight: 'Vale 5', max: 5 },
          { key: 'modulo1.ae2', label: 'AE2 - M1', weight: 'Vale 5', max: 5 },
          { key: 'modulo1.rt', label: 'RT - M1', weight: 'Vale 10', max: 10 },
          { key: 'modulo1.af1', label: 'AF1 - M1', weight: 'Vale 10', max: 10 },
          { key: 'modulo2.ae1', label: 'AE1 - M2', weight: 'Vale 5', max: 5 },
          { key: 'modulo2.ae2', label: 'AE2 - M2', weight: 'Vale 5', max: 5 },
          { key: 'modulo2.rt', label: 'RT - M2', weight: 'Vale 10', max: 10 },
          { key: 'modulo2.af1', label: 'AF1 - M2', weight: 'Vale 10', max: 10 },
        ],
      },
      {
        id: 'sem2_fetrans',
        semester: 2,
        title: '2º Semestre • Prova 2 e Trabalho M3',
        fields: [
          { key: 'provas.p2', label: 'Prova 2 (P2)', weight: 'Peso 3', max: 10 },
          { key: 'modulo3.ae1', label: 'AE1 - M3', weight: 'Vale 3', max: 3 },
          { key: 'modulo3.ae2', label: 'AE2 - M3', weight: 'Vale 3', max: 3 },
          { key: 'modulo3.ae3', label: 'AE3 - M3', weight: 'Vale 4', max: 4 },
          { key: 'modulo3.rt', label: 'RT - M3', weight: 'Vale 10', max: 10 },
          { key: 'modulo3.af1', label: 'AF1 - M3', weight: 'Vale 10', max: 10 },
        ],
      },
    ],
    calculate: (g) => {
      const p1 = num(g.provas?.p1);
      const p2 = num(g.provas?.p2);
      const mp = (p1 * 2 + p2 * 3) / 5;

      const aeM1 = avg([num(g.modulo1?.ae1) * 2, num(g.modulo1?.ae2) * 2]);
      const rtAf1M1 = avg([g.modulo1?.rt, g.modulo1?.af1]);
      const t1 = aeM1 * 0.3 + rtAf1M1 * 0.7;

      const aeM2 = avg([num(g.modulo2?.ae1) * 2, num(g.modulo2?.ae2) * 2]);
      const rtAf1M2 = avg([g.modulo2?.rt, g.modulo2?.af1]);
      const t2 = aeM2 * 0.3 + rtAf1M2 * 0.7;

      const aeM3 = avg([
        (num(g.modulo3?.ae1) * 10) / 3,
        (num(g.modulo3?.ae2) * 10) / 3,
        (num(g.modulo3?.ae3) * 10) / 4,
      ]);
      const rtAf1M3 = avg([g.modulo3?.rt, g.modulo3?.af1]);
      const t3 = aeM3 * 0.3 + rtAf1M3 * 0.7;

      const mt = (t1 + t2 + t3) / 3;
      const mf = (mp * 6 + mt * 4) / 10;

      return {
        mp: round2(mp),
        mt: round2(mt),
        mf: round2(mf),
        subresults: [
          { label: 'Média Provas (MP)', value: round2(mp), formula: '(2·p1 + 3·p2)/5' },
          { label: 'Trabalho T1', value: round2(t1), formula: '30% AE + 70% RT/AF1' },
          { label: 'Trabalho T2', value: round2(t2), formula: '30% AE + 70% RT/AF1' },
          { label: 'Trabalho T3', value: round2(t3), formula: '30% AE + 70% RT/AF1' },
          { label: 'Média Trabalhos (MT)', value: round2(mt), formula: '(t1 + t2 + t3)/3' },
        ],
      };
    },
    simulatePending: (g, targetMF = 6.0) => {
      const p1 = num(g.provas?.p1);
      const aeM1 = avg([num(g.modulo1?.ae1) * 2, num(g.modulo1?.ae2) * 2]);
      const rtAf1M1 = avg([g.modulo1?.rt, g.modulo1?.af1]);
      const t1 = aeM1 * 0.3 + rtAf1M1 * 0.7;
      const aeM2 = avg([num(g.modulo2?.ae1) * 2, num(g.modulo2?.ae2) * 2]);
      const rtAf1M2 = avg([g.modulo2?.rt, g.modulo2?.af1]);
      const t2 = aeM2 * 0.3 + rtAf1M2 * 0.7;
      const aeM3 = avg([
        (num(g.modulo3?.ae1) * 10) / 3,
        (num(g.modulo3?.ae2) * 10) / 3,
        (num(g.modulo3?.ae3) * 10) / 4,
      ]);
      const rtAf1M3 = avg([g.modulo3?.rt, g.modulo3?.af1]);
      const t3 = aeM3 * 0.3 + rtAf1M3 * 0.7;
      const mt = (t1 + t2 + t3) / 3;

      const neededMP = (10 * targetMF - 4 * mt) / 6;
      const neededP2 = (5 * neededMP - 2 * p1) / 3;

      return {
        fieldKey: 'provas.p2',
        label: 'Prova 2 (P2)',
        neededValue: round2(Math.max(0, neededP2)),
        isPossible: neededP2 <= 10,
        currentValue: num(g.provas?.p2),
      };
    },
  },

  // -------------------------------------------------------------------------------------
  // 6. FÍSICA II
  // -------------------------------------------------------------------------------------
  {
    id: 'fisica2',
    code: 'FÍSICA II',
    name: 'Física Teórica e Experimental II',
    color: 'cyan',
    description: 'Provas P1 e P2 compostas (60%) + Trabalhos de Laboratório e Projeto (40%)',
    isCustom: false,
    formulaDescription: 'MF = (MP·6 + MT·4) / 10 | MP = P1·0.4 + P2·0.6 | P1 = p1·0.8 + Te1·0.2',
    grades: {
      bloco1: { p1: 0, te1: 0, mat1: 0, proj1: 0 },
      bloco2: { p2: 0, te2: 0, mat2: 0, proj2: 0 },
    },
    sections: [
      {
        id: 'sem1_fis',
        semester: 1,
        title: '1º Semestre • Prova P1 e Trabalhos 1',
        fields: [
          { key: 'bloco1.p1', label: 'Prova Teórica 1 (p1)', weight: '80% de P1', max: 10 },
          { key: 'bloco1.te1', label: 'Provinha Teórica 1 (Te1)', weight: '20% de P1', max: 10 },
          { key: 'bloco1.mat1', label: 'MédLab 1', weight: '80% de MT1', max: 10 },
          { key: 'bloco1.proj1', label: 'ProjSemestral 1', weight: '20% de MT1', max: 10 },
        ],
      },
      {
        id: 'sem2_fis',
        semester: 2,
        title: '2º Semestre • Prova P2 e Trabalhos 2',
        fields: [
          { key: 'bloco2.p2', label: 'Prova Teórica 2 (p2)', weight: '80% de P2', max: 10 },
          { key: 'bloco2.te2', label: 'Provinha Teórica 2 (Te2)', weight: '20% de P2', max: 10 },
          { key: 'bloco2.mat2', label: 'MédLab 2', weight: '80% de MT2', max: 10 },
          { key: 'bloco2.proj2', label: 'ProjSemestral 2', weight: '20% de MT2', max: 10 },
        ],
      },
    ],
    calculate: (g) => {
      const p1Comp = num(g.bloco1?.p1) * 0.8 + num(g.bloco1?.te1) * 0.2;
      const p2Comp = num(g.bloco2?.p2) * 0.8 + num(g.bloco2?.te2) * 0.2;
      const mp = p1Comp * 0.4 + p2Comp * 0.6;

      const mt1 = num(g.bloco1?.mat1) * 0.8 + num(g.bloco1?.proj1) * 0.2;
      const mt2 = num(g.bloco2?.mat2) * 0.8 + num(g.bloco2?.proj2) * 0.2;
      const mt = (mt1 + mt2) / 2;

      const mf = (mp * 6 + mt * 4) / 10;
      return {
        mp: round2(mp),
        mt: round2(mt),
        mf: round2(mf),
        subresults: [
          { label: 'Nota P1 Composta', value: round2(p1Comp), formula: '0.8·p1 + 0.2·Te1' },
          { label: 'Nota P2 Composta', value: round2(p2Comp), formula: '0.8·p2 + 0.2·Te2' },
          { label: 'Média Provas (MP)', value: round2(mp), formula: '0.4·P1 + 0.6·P2' },
          { label: 'Trabalho 1º Sem (MT1)', value: round2(mt1), formula: '0.8·Mat1 + 0.2·Proj1' },
          { label: 'Trabalho 2º Sem (MT2)', value: round2(mt2), formula: '0.8·Mat2 + 0.2·Proj2' },
          { label: 'Média Trabalhos (MT)', value: round2(mt), formula: '(MT1 + MT2)/2' },
        ],
      };
    },
    simulatePending: (g, targetMF = 6.0) => {
      const p1Comp = num(g.bloco1?.p1) * 0.8 + num(g.bloco1?.te1) * 0.2;
      const te2 = num(g.bloco2?.te2);
      const mt1 = num(g.bloco1?.mat1) * 0.8 + num(g.bloco1?.proj1) * 0.2;
      const mt2 = num(g.bloco2?.mat2) * 0.8 + num(g.bloco2?.proj2) * 0.2;
      const mt = (mt1 + mt2) / 2;

      const neededMP = (10 * targetMF - 4 * mt) / 6;
      const neededP2Comp = (neededMP - 0.4 * p1Comp) / 0.6;
      const neededP2 = (neededP2Comp - 0.2 * te2) / 0.8;

      return {
        fieldKey: 'bloco2.p2',
        label: 'Prova Teórica 2 (p2)',
        neededValue: round2(Math.max(0, neededP2)),
        isPossible: neededP2 <= 10,
        currentValue: num(g.bloco2?.p2),
      };
    },
  },

  // -------------------------------------------------------------------------------------
  // 7. CIRCUITOS ANALÓGICOS
  // -------------------------------------------------------------------------------------
  {
    id: 'circuitos',
    code: 'CIRCUITOS ANAL',
    name: 'Circuitos Analógicos',
    color: 'violet',
    description: 'Provas (70%) + Laboratório/Trabalhos (30%)',
    isCustom: false,
    formulaDescription: 'MF = (MP·7 + MT·3) / 10 | MP = (p1+p2)/2 | MT = 5/6·t1 + 1/6·t2 | t1 = 1/3·AtLAB + 2/3·PR',
    grades: {
      provas: { p1: 0, p2: 0 },
      trabalhos: { atLab: 0, pr: 0, t2: 0 },
    },
    sections: [
      {
        id: 'sem1_circ',
        semester: 1,
        title: '1º Semestre • Prova 1 e Laboratório',
        fields: [
          { key: 'provas.p1', label: 'Prova 1 (P1)', max: 10 },
          { key: 'trabalhos.atLab', label: 'Presença (AtLAB)', weight: '1/3 do t1', max: 10 },
          { key: 'trabalhos.pr', label: 'Projeto', weight: '2/3 do t1', max: 10 },
        ],
      },
      {
        id: 'sem2_circ',
        semester: 2,
        title: '2º Semestre • Prova 2 e Trabalho t2',
        fields: [
          { key: 'provas.p2', label: 'Prova 2 (P2)', max: 10 },
          { key: 'trabalhos.t2', label: 'Testes sexta(t2)', weight: '1/6 de MT', max: 10 },
        ],
      },
    ],
    calculate: (g) => {
      const p1 = num(g.provas?.p1);
      const p2 = num(g.provas?.p2);
      const mp = (p1 + p2) / 2;

      const t1 = (1 / 3) * num(g.trabalhos?.atLab) + (2 / 3) * num(g.trabalhos?.pr);
      const t2 = num(g.trabalhos?.t2);
      const mt = (5 / 6) * t1 + (1 / 6) * t2;

      const mf = (mp * 7 + mt * 3) / 10;
      return {
        mp: round2(mp),
        mt: round2(mt),
        mf: round2(mf),
        subresults: [
          { label: 'Média Provas (MP)', value: round2(mp), formula: '(p1 + p2)/2' },
          { label: 'Trabalho 1º Sem (t1)', value: round2(t1), formula: '(1/3)·AtLAB + (2/3)·PR' },
          { label: 'Trabalho 2º Sem (t2)', value: round2(t2), formula: 'Nota Direta' },
          { label: 'Média Trabalhos (MT)', value: round2(mt), formula: '(5/6)·t1 + (1/6)·t2' },
        ],
      };
    },
    simulatePending: (g, targetMF = 6.0) => {
      const p1 = num(g.provas?.p1);
      const t1 = (1 / 3) * num(g.trabalhos?.atLab) + (2 / 3) * num(g.trabalhos?.pr);
      const t2 = num(g.trabalhos?.t2);
      const mt = (5 / 6) * t1 + (1 / 6) * t2;

      const neededMP = (10 * targetMF - 3 * mt) / 7;
      const neededP2 = 2 * neededMP - p1;

      return {
        fieldKey: 'provas.p2',
        label: 'Prova 2 (P2)',
        neededValue: round2(Math.max(0, neededP2)),
        isPossible: neededP2 <= 10,
        currentValue: num(g.provas?.p2),
      };
    },
  },

  // -------------------------------------------------------------------------------------
  // 8. MECÂNICA GERAL
  // -------------------------------------------------------------------------------------
  {
    id: 'mecanica',
    code: 'MECANICA GERAL',
    name: 'Mecânica Geral',
    color: 'orange',
    description:
      'Provas P1 e P2 (70%) + Trabalhos T1 e T2 (30%). T1 e T2 são compostos por Trabalho (7,0) + 2 Listas (1,5 cada).',
    isCustom: false,
    formulaDescription:
      'MF = (MP·7 + MT·3) / 10 | MP = (2·p1 + 3·p2)/5 | MT = (t1 + t2)/2 | t1, t2 = Trab(7) + L1(1,5) + L2(1,5)',
    grades: {
      provas: { p1: 0, p2: 0 },
      trabalhos: {
        t1_trab: 0,
        t1_l1: 0,
        t1_l2: 0,
        t2_trab: 0,
        t2_l1: 0,
        t2_l2: 0,
      },
    },
    sections: [
      {
        id: 'sem1_mec',
        semester: 1,
        title: '1º Semestre • Prova 1 e Trabalho 1',
        fields: [
          { key: 'provas.p1', label: 'Prova 1 (P1)', weight: 'Peso 2', max: 10 },
          { key: 'trabalhos.t1_trab', label: 'Atividade 1', weight: 'Vale 7,0', max: 7 },
          { key: 'trabalhos.t1_l1', label: 'Entrega Lista 1', weight: 'Vale 1,5', max: 1.5 },
          { key: 'trabalhos.t1_l2', label: 'Entrega Lista 2', weight: 'Vale 1,5', max: 1.5 },
        ],
      },
      {
        id: 'sem2_mec',
        semester: 2,
        title: '2º Semestre • Prova 2 e Trabalho 2',
        fields: [
          { key: 'provas.p2', label: 'Prova 2 (P2)', weight: 'Peso 3', max: 10 },
          { key: 'trabalhos.t2_trab', label: 'Atividade 2', weight: 'Vale 7,0', max: 7 },
          { key: 'trabalhos.t2_l1', label: 'Entrega Lista 3', weight: 'Vale 1,5', max: 1.5 },
          { key: 'trabalhos.t2_l2', label: 'Entrega Lista 4', weight: 'Vale 1,5', max: 1.5 },
        ],
      },
    ],
    calculate: (g) => {
      const p1 = num(g.provas?.p1);
      const p2 = num(g.provas?.p2);
      const mp = (2 * p1 + 3 * p2) / 5;

      const t1Trab = Math.min(7, Math.max(0, num(g.trabalhos?.t1_trab)));
      const t1L1 = Math.min(1.5, Math.max(0, num(g.trabalhos?.t1_l1)));
      const t1L2 = Math.min(1.5, Math.max(0, num(g.trabalhos?.t1_l2)));
      const hasNewT1 =
        g.trabalhos?.t1_trab !== undefined ||
        g.trabalhos?.t1_l1 !== undefined ||
        g.trabalhos?.t1_l2 !== undefined;
      const t1 = Math.min(
        10,
        Math.max(0, hasNewT1 ? t1Trab + t1L1 + t1L2 : num(g.trabalhos?.t1))
      );

      const t2Trab = Math.min(7, Math.max(0, num(g.trabalhos?.t2_trab)));
      const t2L1 = Math.min(1.5, Math.max(0, num(g.trabalhos?.t2_l1)));
      const t2L2 = Math.min(1.5, Math.max(0, num(g.trabalhos?.t2_l2)));
      const hasNewT2 =
        g.trabalhos?.t2_trab !== undefined ||
        g.trabalhos?.t2_l1 !== undefined ||
        g.trabalhos?.t2_l2 !== undefined;
      const t2 = Math.min(
        10,
        Math.max(0, hasNewT2 ? t2Trab + t2L1 + t2L2 : num(g.trabalhos?.t2))
      );

      const mt = (t1 + t2) / 2;
      const mf = (mp * 7 + mt * 3) / 10;
      return {
        mp: round2(mp),
        mt: round2(mt),
        t1: round2(t1),
        t2: round2(t2),
        mf: round2(mf),
        subresults: [
          { label: 'Média Provas (MP)', value: round2(mp), formula: '(2·p1 + 3·p2)/5' },
          {
            label: 'Trabalho 1º Sem (t1)',
            value: round2(t1),
            formula: `${round2(t1Trab)} (Ativ 1) + ${round2(t1L1)} (Lista 1) + ${round2(t1L2)} (Lista 2)`,
          },
          {
            label: 'Trabalho 2º Sem (t2)',
            value: round2(t2),
            formula: `${round2(t2Trab)} (Ativ 2) + ${round2(t2L1)} (Lista 3) + ${round2(t2L2)} (Lista 4)`,
          },
          { label: 'Média Trabalhos (MT)', value: round2(mt), formula: '(t1 + t2)/2' },
        ],
      };
    },
    simulatePending: (g, targetMF = 6.0) => {
      const p1 = num(g.provas?.p1);

      const t1Trab = Math.min(7, Math.max(0, num(g.trabalhos?.t1_trab)));
      const t1L1 = Math.min(1.5, Math.max(0, num(g.trabalhos?.t1_l1)));
      const t1L2 = Math.min(1.5, Math.max(0, num(g.trabalhos?.t1_l2)));
      const hasNewT1 =
        g.trabalhos?.t1_trab !== undefined ||
        g.trabalhos?.t1_l1 !== undefined ||
        g.trabalhos?.t1_l2 !== undefined;
      const t1 = Math.min(
        10,
        Math.max(0, hasNewT1 ? t1Trab + t1L1 + t1L2 : num(g.trabalhos?.t1))
      );

      const t2Trab = Math.min(7, Math.max(0, num(g.trabalhos?.t2_trab)));
      const t2L1 = Math.min(1.5, Math.max(0, num(g.trabalhos?.t2_l1)));
      const t2L2 = Math.min(1.5, Math.max(0, num(g.trabalhos?.t2_l2)));
      const hasNewT2 =
        g.trabalhos?.t2_trab !== undefined ||
        g.trabalhos?.t2_l1 !== undefined ||
        g.trabalhos?.t2_l2 !== undefined;
      const t2 = Math.min(
        10,
        Math.max(0, hasNewT2 ? t2Trab + t2L1 + t2L2 : num(g.trabalhos?.t2))
      );

      const mt = (t1 + t2) / 2;

      const neededMP = (10 * targetMF - 3 * mt) / 7;
      const neededP2 = (5 * neededMP - 2 * p1) / 3;

      return {
        fieldKey: 'provas.p2',
        label: 'Prova 2 (P2)',
        neededValue: round2(Math.max(0, neededP2)),
        isPossible: neededP2 <= 10,
        currentValue: num(g.provas?.p2),
      };
    },
  },
];
