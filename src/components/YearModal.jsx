import React, { useState } from 'react';
import { X, Calendar, Plus, Sparkles, Copy, FileText } from 'lucide-react';
import { DEFAULT_SUBJECTS } from '../data/defaultSubjects';

export default function YearModal({
  isOpen,
  onClose,
  currentYear,
  onAddYear,
}) {
  const [label, setLabel] = useState('');
  const [passingGrade, setPassingGrade] = useState(6.0);
  const [template, setTemplate] = useState('empty'); // 'empty' | 'engineering' | 'copy_current'

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!label.trim()) return;

    const newYearId = 'year_' + Date.now();
    let initialSubjects = [];

    if (template === 'engineering') {
      // Carregar matérias de engenharia com notas zeradas
      initialSubjects = DEFAULT_SUBJECTS.map((s) => {
        const copy = JSON.parse(JSON.stringify(s));
        // Zerar notas
        const zeroOut = (obj) => {
          if (!obj || typeof obj !== 'object') return;
          for (const k in obj) {
            if (typeof obj[k] === 'object' && obj[k] !== null) zeroOut(obj[k]);
            else obj[k] = 0;
          }
        };
        zeroOut(copy.grades);
        return copy;
      });
    } else if (template === 'copy_current' && currentYear?.subjects) {
      // Copiar matérias do ano atual com notas zeradas
      initialSubjects = currentYear.subjects.map((s) => {
        const copy = JSON.parse(JSON.stringify(s));
        const zeroOut = (obj) => {
          if (!obj || typeof obj !== 'object') return;
          for (const k in obj) {
            if (typeof obj[k] === 'object' && obj[k] !== null) zeroOut(obj[k]);
            else obj[k] = 0;
          }
        };
        zeroOut(copy.grades);
        return copy;
      });
    }

    const newYear = {
      id: newYearId,
      label: label.trim(),
      passingGrade: Number(passingGrade) || 6.0,
      subjects: initialSubjects,
    };

    onAddYear(newYear);
    setLabel('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Adicionar Novo Ano / Período
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Seus anos anteriores permanecem guardados no histórico
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
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Nome do Ano / Curso *
            </label>
            <input
              type="text"
              required
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Ex: Ano Letivo 2027, 3º Ano, ou Faculdade da Minha Namorada"
              className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Média de Aprovação deste Ano
            </label>
            <div className="mt-1 flex items-center gap-2">
              {[5.0, 5.75, 6.0, 7.0].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setPassingGrade(val)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                    passingGrade === val
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                  }`}
                >
                  {val.toFixed(1)}
                </button>
              ))}
              <input
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={passingGrade}
                onChange={(e) => setPassingGrade(parseFloat(e.target.value) || 0)}
                className="w-20 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-bold text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          {/* Opções de Inicialização */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Como deseja iniciar este ano?
            </label>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => setTemplate('empty')}
                className={`w-full rounded-xl border p-3 text-left transition flex items-start gap-2.5 ${
                  template === 'empty'
                    ? 'border-indigo-600 bg-indigo-50/50 dark:border-indigo-500 dark:bg-indigo-950/30'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                }`}
              >
                <FileText className="h-4 w-4 mt-0.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    Começar em Branco (Zero Matérias)
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    Ideal para quando tiver matérias totalmente novas ou para outra faculdade.
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setTemplate('engineering')}
                className={`w-full rounded-xl border p-3 text-left transition flex items-start gap-2.5 ${
                  template === 'engineering'
                    ? 'border-indigo-600 bg-indigo-50/50 dark:border-indigo-500 dark:bg-indigo-950/30'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                }`}
              >
                <Sparkles className="h-4 w-4 mt-0.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    Carregar Matérias Padrão de Engenharia (com notas zeradas)
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    Inclui as 8 disciplinas com suas fórmulas prontas para preencher.
                  </div>
                </div>
              </button>

              {currentYear?.subjects && currentYear.subjects.length > 0 && (
                <button
                  type="button"
                  onClick={() => setTemplate('copy_current')}
                  className={`w-full rounded-xl border p-3 text-left transition flex items-start gap-2.5 ${
                    template === 'copy_current'
                      ? 'border-indigo-600 bg-indigo-50/50 dark:border-indigo-500 dark:bg-indigo-950/30'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <Copy className="h-4 w-4 mt-0.5 text-amber-600 dark:text-amber-400 shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      Copiar disciplinas do ano atual ({currentYear.label})
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      Mantém a mesma grade de matérias, mas reinicia as notas em 0.
                    </div>
                  </div>
                </button>
              )}
            </div>
          </div>

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
              Criar Período
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
