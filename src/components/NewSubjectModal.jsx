import React, { useState } from 'react';
import { X, Plus, Sparkles, BookOpen, Layers, Sliders } from 'lucide-react';

const COLORS = [
  { id: 'indigo', label: 'Índigo', bg: 'bg-indigo-500' },
  { id: 'emerald', label: 'Esmeralda', bg: 'bg-emerald-500' },
  { id: 'cyan', label: 'Ciano', bg: 'bg-cyan-500' },
  { id: 'blue', label: 'Azul', bg: 'bg-blue-500' },
  { id: 'amber', label: 'Âmbar', bg: 'bg-amber-500' },
  { id: 'rose', label: 'Rosa', bg: 'bg-rose-500' },
  { id: 'violet', label: 'Violeta', bg: 'bg-violet-500' },
  { id: 'orange', label: 'Laranja', bg: 'bg-orange-500' },
];

export default function NewSubjectModal({ isOpen, onClose, onAddSubject }) {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [color, setColor] = useState('indigo');
  const [template, setTemplate] = useState('provas_trabalhos'); // 'provas_trabalhos' | 'simples' | 'semestral'
  const [provasWeight, setProvasWeight] = useState(70);
  const [numProvas, setNumProvas] = useState(3);
  const [numTrabalhos, setNumTrabalhos] = useState(3);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const subjectId = 'custom_' + Date.now();
    const finalCode = (code.trim() || name.substring(0, 8)).toUpperCase();
    const trabalhosWeight = 100 - provasWeight;

    let sections = [];
    let initialGrades = {};
    let customConfig = {};
    let formulaDesc = '';

    if (template === 'provas_trabalhos') {
      const provasFields = [];
      const trabalhosFields = [];

      for (let i = 1; i <= numProvas; i++) {
        provasFields.push({
          key: `provas.p${i}`,
          label: `Prova ${i} (P${i})`,
          max: 10,
        });
        initialGrades[`provas`] = initialGrades[`provas`] || {};
        initialGrades[`provas`][`p${i}`] = 0;
      }

      for (let j = 1; j <= numTrabalhos; j++) {
        trabalhosFields.push({
          key: `trabalhos.t${j}`,
          label: `Trabalho ${j} (T${j})`,
          max: 10,
        });
        initialGrades[`trabalhos`] = initialGrades[`trabalhos`] || {};
        initialGrades[`trabalhos`][`t${j}`] = 0;
      }

      sections = [
        {
          id: 'provas',
          title: `Provas (MP - Peso ${provasWeight}%)`,
          fields: provasFields,
        },
        {
          id: 'trabalhos',
          title: `Trabalhos e Atividades (MT - Peso ${trabalhosWeight}%)`,
          fields: trabalhosFields,
        },
      ];
      customConfig = {
        type: 'weighted_blocks',
        provasWeight,
        trabalhosWeight,
      };
      formulaDesc = `MF = (MP·${provasWeight} + MT·${trabalhosWeight}) / 100`;
    } else if (template === 'semestral') {
      // 1º Semestre (50%) + 2º Semestre (50%)
      sections = [
        {
          id: 'sem1',
          title: '1º Semestre (Peso 50%)',
          fields: [
            { key: 'provas.p1', label: 'Prova 1 (P1)', max: 10 },
            { key: 'trabalhos.t1', label: 'Trabalhos / Atividades 1', max: 10 },
          ],
        },
        {
          id: 'sem2',
          title: '2º Semestre (Peso 50%)',
          fields: [
            { key: 'provas.p2', label: 'Prova 2 (P2)', max: 10 },
            { key: 'trabalhos.t2', label: 'Trabalhos / Atividades 2', max: 10 },
          ],
        },
      ];
      initialGrades = {
        provas: { p1: 0, p2: 0 },
        trabalhos: { t1: 0, t2: 0 },
      };
      customConfig = {
        type: 'weighted_blocks',
        provasWeight: 50,
        trabalhosWeight: 50,
      };
      formulaDesc = 'MF = (Média Semestre 1 + Média Semestre 2) / 2';
    } else {
      // Média simples
      const fields = [];
      for (let i = 1; i <= numProvas; i++) {
        fields.push({
          key: `avaliacoes.av${i}`,
          label: `Avaliação ${i}`,
          max: 10,
        });
        initialGrades[`avaliacoes`] = initialGrades[`avaliacoes`] || {};
        initialGrades[`avaliacoes`][`av${i}`] = 0;
      }
      sections = [
        {
          id: 'avaliacoes',
          title: 'Avaliações com Pesos Iguais',
          fields,
        },
      ];
      customConfig = {
        type: 'simple_avg',
      };
      formulaDesc = `MF = Soma de ${numProvas} avaliações / ${numProvas}`;
    }

    const newSubject = {
      id: subjectId,
      code: finalCode,
      name: name.trim(),
      color,
      description:
        template === 'provas_trabalhos'
          ? `Provas (${provasWeight}%) + Trabalhos (${trabalhosWeight}%)`
          : template === 'semestral'
          ? 'Divisão Semestral (50% cada)'
          : 'Média aritmética simples das avaliações',
      isCustom: true,
      formulaDescription: formulaDesc,
      customConfig,
      grades: initialGrades,
      sections,
    };

    onAddSubject(newSubject);
    setName('');
    setCode('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
              <Plus className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Adicionar Nova Matéria
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Funciona para qualquer curso ou faculdade (Engenharia, Medicina, etc.)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Nome da Disciplina *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Anatomia, Direito Civil, Termo..."
                className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Sigla / Código
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Ex: ANAT01"
                className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none uppercase dark:border-slate-800 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          {/* Seletor de Cor */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Cor de Destaque
            </label>
            <div className="flex flex-wrap gap-2">
              {COLORS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setColor(c.id)}
                  className={`h-7 w-7 rounded-full ${c.bg} transition-transform ${
                    color === c.id ? 'ring-2 ring-indigo-500 ring-offset-2 scale-110' : 'opacity-80 hover:opacity-100'
                  }`}
                  title={c.label}
                />
              ))}
            </div>
          </div>

          {/* Tipo de Fórmula */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Estrutura de Avaliação
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setTemplate('provas_trabalhos')}
                className={`rounded-xl border p-2.5 text-left transition ${
                  template === 'provas_trabalhos'
                    ? 'border-indigo-600 bg-indigo-50/50 dark:border-indigo-500 dark:bg-indigo-950/30'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                }`}
              >
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  Provas + Trabalhos
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Pesos % customizados
                </div>
              </button>

              <button
                type="button"
                onClick={() => setTemplate('semestral')}
                className={`rounded-xl border p-2.5 text-left transition ${
                  template === 'semestral'
                    ? 'border-indigo-600 bg-indigo-50/50 dark:border-indigo-500 dark:bg-indigo-950/30'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                }`}
              >
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  Semestral / 2 Fases
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                  1º Sem (50%) + 2º Sem (50%)
                </div>
              </button>

              <button
                type="button"
                onClick={() => setTemplate('simples')}
                className={`rounded-xl border p-2.5 text-left transition ${
                  template === 'simples'
                    ? 'border-indigo-600 bg-indigo-50/50 dark:border-indigo-500 dark:bg-indigo-950/30'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                }`}
              >
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  Média Simples
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Pesos rigorosamente iguais
                </div>
              </button>
            </div>
          </div>

          {/* Opções de Provas + Trabalhos */}
          {template === 'provas_trabalhos' && (
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3.5 space-y-3 dark:border-slate-800 dark:bg-slate-800/40">
              <div>
                <div className="flex justify-between text-xs font-medium text-slate-700 dark:text-slate-300">
                  <span>Peso das Provas: {provasWeight}%</span>
                  <span>Peso dos Trabalhos: {100 - provasWeight}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="90"
                  step="5"
                  value={provasWeight}
                  onChange={(e) => setProvasWeight(Number(e.target.value))}
                  className="mt-1.5 w-full accent-indigo-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                    Quantidade de Provas
                  </label>
                  <select
                    value={numProvas}
                    onChange={(e) => setNumProvas(Number(e.target.value))}
                    className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  >
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                      <option key={n} value={n}>
                        {n} prova{n > 1 ? 's' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                    Quantidade de Trabalhos
                  </label>
                  <select
                    value={numTrabalhos}
                    onChange={(e) => setNumTrabalhos(Number(e.target.value))}
                    className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  >
                    {[1, 2, 3, 4, 5, 6, 8, 10].map((n) => (
                      <option key={n} value={n}>
                        {n} trabalho{n > 1 ? 's' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {template === 'simples' && (
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3.5 dark:border-slate-800 dark:bg-slate-800/40">
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400">
                Quantidade de Avaliações
              </label>
              <select
                value={numProvas}
                onChange={(e) => setNumProvas(Number(e.target.value))}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              >
                {[2, 3, 4, 5, 6, 8].map((n) => (
                  <option key={n} value={n}>
                    {n} avaliações
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600/50"
            >
              Criar Matéria
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
