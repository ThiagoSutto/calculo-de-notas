import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Sparkles,
  RotateCcw,
  Trash2,
  Edit2,
  CheckCircle,
  AlertCircle,
  Clock,
  ExternalLink,
} from 'lucide-react';
import {
  calculateSubjectResult,
  getSubjectStatus,
  getFieldValue,
} from '../utils/calculator';

// Cores temáticas para cada matéria
const COLOR_MAP = {
  indigo: {
    badge: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
    border: 'hover:border-indigo-300 dark:hover:border-indigo-700',
    bar: 'bg-indigo-600 dark:bg-indigo-500',
    lightBg: 'bg-indigo-50/50 dark:bg-indigo-950/20',
  },
  emerald: {
    badge: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    border: 'hover:border-emerald-300 dark:hover:border-emerald-700',
    bar: 'bg-emerald-600 dark:bg-emerald-500',
    lightBg: 'bg-emerald-50/50 dark:bg-emerald-950/20',
  },
  blue: {
    badge: 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    border: 'hover:border-blue-300 dark:hover:border-blue-700',
    bar: 'bg-blue-600 dark:bg-blue-500',
    lightBg: 'bg-blue-50/50 dark:bg-blue-950/20',
  },
  amber: {
    badge: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    border: 'hover:border-amber-300 dark:hover:border-amber-700',
    bar: 'bg-amber-600 dark:bg-amber-500',
    lightBg: 'bg-amber-50/50 dark:bg-amber-950/20',
  },
  rose: {
    badge: 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800',
    border: 'hover:border-rose-300 dark:hover:border-rose-700',
    bar: 'bg-rose-600 dark:bg-rose-500',
    lightBg: 'bg-rose-50/50 dark:bg-rose-950/20',
  },
  cyan: {
    badge: 'bg-cyan-50 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800',
    border: 'hover:border-cyan-300 dark:hover:border-cyan-700',
    bar: 'bg-cyan-600 dark:bg-cyan-500',
    lightBg: 'bg-cyan-50/50 dark:bg-cyan-950/20',
  },
  violet: {
    badge: 'bg-violet-50 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300 border-violet-200 dark:border-violet-800',
    border: 'hover:border-violet-300 dark:hover:border-violet-700',
    bar: 'bg-violet-600 dark:bg-violet-500',
    lightBg: 'bg-violet-50/50 dark:bg-violet-950/20',
  },
  orange: {
    badge: 'bg-orange-50 text-orange-700 dark:bg-orange-950/60 dark:text-orange-300 border-orange-200 dark:border-orange-800',
    border: 'hover:border-orange-300 dark:hover:border-orange-700',
    bar: 'bg-orange-600 dark:bg-orange-500',
    lightBg: 'bg-orange-50/50 dark:bg-orange-950/20',
  },
};

export default function SubjectCard({
  subject,
  passingGrade,
  onGradeChange,
  onResetSubject,
  onDeleteSubject,
  onEditSubject,
}) {
  const [showFormula, setShowFormula] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [selectedSemester, setSelectedSemester] = useState('all');

  const hasSemesters = (subject.sections || []).some((s) => s.semester !== undefined);
  const displayedSections = (subject.sections || []).filter(
    (sec) => selectedSemester === 'all' || sec.semester === selectedSemester || !sec.semester
  );

  const result = calculateSubjectResult(subject);
  const status = getSubjectStatus(subject, passingGrade);
  const colorTheme = COLOR_MAP[subject.color] || COLOR_MAP.indigo;

  const mf = result.mf;
  const isApproved = mf >= passingGrade;

  // Tratar entrada de nota com vírgula ou ponto, respeitando o limite max do campo (ex: 1,5 ou 7 ou 10)
  const handleInputChange = (fieldKey, rawValue, fieldMax) => {
    // Permitir apenas números, vírgula e ponto
    let clean = rawValue.replace(/[^0-9.,]/g, '');

    // Converter ponto para vírgula para consistência no padrão brasileiro
    clean = clean.replace('.', ',');

    // Garantir no máximo uma vírgula
    const parts = clean.split(',');
    if (parts.length > 2) {
      clean = parts[0] + ',' + parts.slice(1).join('');
    }

    // Limitar nota ao valor máximo especificado para o campo (ou 10 como teto padrão)
    const maxLimit = typeof fieldMax === 'number' && !isNaN(fieldMax) ? fieldMax : 10;
    const numCheck = parseFloat(clean.replace(',', '.'));
    if (!isNaN(numCheck) && numCheck > maxLimit) {
      clean = String(maxLimit).replace('.', ',');
    }

    onGradeChange(subject.id, fieldKey, clean);
  };

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-200 dark:border-slate-800 dark:bg-slate-900 ${colorTheme.border}`}
    >
      {/* Top Banner & Header */}
      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`rounded-md border px-2 py-0.5 text-xs font-bold tracking-wide ${colorTheme.badge}`}
              >
                {subject.code || subject.name.substring(0, 7).toUpperCase()}
              </span>
              <span
                className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold ${status.badgeClass}`}
              >
                {status.type === 'approved' && <CheckCircle className="h-3 w-3" />}
                {status.type === 'pending' && <Clock className="h-3 w-3" />}
                {status.type === 'failed' && <AlertCircle className="h-3 w-3" />}
                {status.label}
              </span>
            </div>
            <h2 className="mt-1.5 text-lg font-bold text-slate-900 dark:text-white">
              {subject.name}
            </h2>
            {subject.description && (
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                {subject.description}
              </p>
            )}
          </div>

          {/* Média Final Grande */}
          <div className="flex flex-col items-end">
            <div className="flex items-baseline gap-1">
              <span
                className={`text-3xl font-black tracking-tight sm:text-4xl ${
                  isApproved
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-slate-800 dark:text-slate-100'
                }`}
              >
                {mf.toFixed(2)}
              </span>
              <span className="text-xs font-semibold text-slate-400">/ 10</span>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Média Final (MF)
            </span>
          </div>
        </div>

        {/* Barra de Progresso visual da Média Final */}
        <div className="mt-4">
          <div className="relative h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            {/* Marcador do corte (ex: 5.0) */}
            <div
              style={{ left: `${(passingGrade / 10) * 100}%` }}
              className="absolute top-0 bottom-0 z-10 w-0.5 bg-slate-400/80 dark:bg-slate-500"
              title={`Corte de aprovação: ${passingGrade.toFixed(1)}`}
            />
            {/* Barra preenchida */}
            <div
              style={{ width: `${Math.min(100, Math.max(0, (mf / 10) * 100))}%` }}
              className={`h-full transition-all duration-300 ${
                isApproved
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                  : 'bg-gradient-to-r from-amber-500 to-indigo-500'
              }`}
            />
          </div>
          <div className="mt-1 flex justify-between text-[10px] text-slate-400">
            <span>0.0</span>
            <span className="font-semibold text-slate-600 dark:text-slate-300">
              Meta: {passingGrade.toFixed(1)}
            </span>
            <span>10.0</span>
          </div>
        </div>

        {/* Sub-médias (MP, MT, MA, etc.) */}
        {result.subresults && result.subresults.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {result.subresults.map((sub, idx) => (
              <div
                key={idx}
                className="flex items-center gap-1.5 rounded-lg border border-slate-200/80 bg-slate-50 px-2.5 py-1 text-xs dark:border-slate-800 dark:bg-slate-800/60"
                title={sub.formula}
              >
                <span className="font-medium text-slate-500 dark:text-slate-400">
                  {sub.label}:
                </span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {sub.value.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Card inteligente de Simulação / "Quanto preciso tirar?" */}
        {status.simulation && (
          <div
            className={`mt-3.5 flex items-start gap-2.5 rounded-xl border p-3 text-xs ${
              isApproved
                ? 'border-emerald-200 bg-emerald-50/70 text-emerald-900 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-300'
                : status.simulation.isPossible
                ? 'border-amber-200 bg-amber-50/70 text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-300'
                : 'border-rose-200 bg-rose-50/70 text-rose-900 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-300'
            }`}
          >
            <Sparkles className="mt-0.5 h-4 w-4 shrink-0" />
            <div className="flex-1">
              {isApproved ? (
                <p className="font-semibold">
                  Parabéns! Você já atingiu a média necessária ({passingGrade.toFixed(1)}) para ser aprovado nesta disciplina.
                </p>
              ) : status.simulation.isPossible ? (
                <p>
                  Para atingir a média <strong>{passingGrade.toFixed(1)}</strong>, você precisa tirar{' '}
                  <span className="inline-block rounded bg-amber-200/80 px-1.5 py-0.5 font-bold text-amber-950 dark:bg-amber-900 dark:text-amber-200">
                    {status.simulation.neededValue.toFixed(2)}
                  </span>{' '}
                  em <strong>{status.simulation.label}</strong>.
                </p>
              ) : (
                <p>
                  Atenção: A nota necessária para aprovação direta em{' '}
                  <strong>{status.simulation.label}</strong> é{' '}
                  <strong>{status.simulation.neededValue.toFixed(2)}</strong> (acima de 10.0). Consulte as regras de exame final da sua faculdade.
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Accordion Toggle para Entradas de Notas */}
      <div className="border-t border-slate-100 bg-slate-50/50 px-4 py-2 dark:border-slate-800/80 dark:bg-slate-800/20">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          type="button"
          className="flex w-full items-center justify-between text-xs font-semibold text-slate-600 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
        >
          <span>{isExpanded ? 'Ocultar notas e avaliações' : 'Editar notas e avaliações'}</span>
          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      </div>

      {/* Seções e Campos de Avaliação */}
      {isExpanded && (
        <div className="space-y-4 border-t border-slate-100 p-4 sm:p-5 dark:border-slate-800">
          {/* Abas de Semestre se a matéria for anual dividida */}
          {hasSemesters && (
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 w-fit">
              <button
                type="button"
                onClick={() => setSelectedSemester('all')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${
                  selectedSemester === 'all'
                    ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-white'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                Ano Todo
              </button>
              <button
                type="button"
                onClick={() => setSelectedSemester(1)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${
                  selectedSemester === 1
                    ? 'bg-white text-indigo-700 shadow-sm dark:bg-slate-900 dark:text-indigo-400'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                1º Semestre
              </button>
              <button
                type="button"
                onClick={() => setSelectedSemester(2)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${
                  selectedSemester === 2
                    ? 'bg-white text-indigo-700 shadow-sm dark:bg-slate-900 dark:text-indigo-400'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                2º Semestre
              </button>
            </div>
          )}

          {displayedSections.map((section) => (
            <div key={section.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                  {section.title}
                </h3>
                {section.semester && (
                  <span className="rounded-full bg-slate-200/70 px-2 py-0.5 text-[10px] font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    {section.semester}º Semestre
                  </span>
                )}
              </div>
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                {(section.fields || []).map((field) => {
                  const maxLimit =
                    typeof field.max === 'number' && !isNaN(field.max) ? field.max : 10;
                  let currVal = getFieldValue(subject.grades, field.key);
                  const numVal = parseFloat(String(currVal).replace(',', '.'));
                  if (!isNaN(numVal) && numVal > maxLimit) {
                    currVal = String(maxLimit).replace('.', ',');
                  }
                  return (
                    <div
                      key={field.key}
                      className="flex flex-col justify-between rounded-xl border border-slate-200/90 bg-slate-50/80 p-2.5 transition focus-within:border-indigo-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-500/20 dark:border-slate-800 dark:bg-slate-800/50 dark:focus-within:bg-slate-800"
                    >
                      <div className="flex items-center justify-between gap-1">
                        <label
                          htmlFor={`${subject.id}-${field.key}`}
                          className="text-[11px] font-semibold text-slate-700 truncate dark:text-slate-300"
                          title={field.label}
                        >
                          {field.label}
                        </label>
                        {field.weight && (
                          <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 whitespace-nowrap">
                            {field.weight}
                          </span>
                        )}
                      </div>

                      <div className="mt-1.5 flex items-center gap-1.5">
                        <input
                          id={`${subject.id}-${field.key}`}
                          type="text"
                          inputMode="decimal"
                          value={currVal === undefined || currVal === null ? '' : currVal}
                          onChange={(e) =>
                            handleInputChange(field.key, e.target.value, field.max)
                          }
                          onFocus={(e) => {
                            if (e.target.value === '0' || e.target.value === 0) {
                              e.target.select();
                            }
                          }}
                          placeholder="0,0"
                          className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:bg-white focus:text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-indigo-400 dark:focus:bg-slate-900 dark:focus:text-white"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Fórmulas Exatas do Excel e Ações da Matéria */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <button
                onClick={() => setShowFormula(!showFormula)}
                type="button"
                className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
              >
                <HelpCircle className="h-3.5 w-3.5" />
                <span>{showFormula ? 'Esconder fórmula do Excel' : 'Ver fórmula exata do Excel'}</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onResetSubject(subject.id)}
                  type="button"
                  title="Restaurar valores padrão desta matéria"
                  className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>Restaurar</span>
                </button>

                {subject.isCustom && (
                  <button
                    onClick={() => onDeleteSubject(subject.id)}
                    type="button"
                    title="Excluir disciplina"
                    className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-rose-500 hover:bg-rose-50 hover:text-rose-700 dark:hover:bg-rose-950/40"
                  >
                    <Trash2 className="h-3 w-3" />
                    <span>Excluir</span>
                  </button>
                )}
              </div>
            </div>

            {/* Caixa descritiva da fórmula */}
            {showFormula && (
              <div className="mt-2.5 rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-700 font-mono dark:border-slate-800 dark:bg-slate-950/70 dark:text-slate-300">
                <div className="font-semibold text-slate-900 dark:text-white font-sans mb-1">
                  Cálculo Automatizado:
                </div>
                <div className="break-all">{subject.formulaDescription || 'Cálculo customizado'}</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
