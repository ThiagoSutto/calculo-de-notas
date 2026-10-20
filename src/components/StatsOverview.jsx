import React from 'react';
import {
  BookOpen,
  Clock,
  AlertTriangle,
  Search,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import { calculateSubjectResult, getSubjectStatus } from '../utils/calculator';

export default function StatsOverview({
  subjects,
  passingGrade = 6.0,
  activeYearLabel,
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
}) {
  let approvedCount = 0;
  let inProgressCount = 0;
  let atRiskCount = 0;

  subjects.forEach((s) => {
    const st = getSubjectStatus(s, passingGrade);
    if (st.type === 'approved') approvedCount++;
    else if (st.type === 'failed') atRiskCount++;
    else inProgressCount++;
  });

  return (
    <div className="space-y-4">
      {/* Cards de Métricas Sem Média Geral */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        {/* Card: Total de Disciplinas */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Disciplinas
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
              <BookOpen className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white sm:text-3xl">
              {subjects.length}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              matérias
            </span>
          </div>
          <div className="mt-2 text-xs font-medium text-slate-500 dark:text-slate-400 truncate">
            {activeYearLabel || 'Ano selecionado'}
          </div>
        </div>

        {/* Card: Aprovadas */}
        <div className="relative overflow-hidden rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4 shadow-sm dark:border-emerald-950/50 dark:bg-emerald-950/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-emerald-800 dark:text-emerald-400">
              Aprovadas (MF ≥ {passingGrade.toFixed(1)})
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-300">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-emerald-700 dark:text-emerald-300 sm:text-3xl">
              {approvedCount}
            </span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400">
              de {subjects.length}
            </span>
          </div>
          <div className="mt-2 text-xs text-emerald-700 dark:text-emerald-400 font-medium">
            {subjects.length > 0 ? Math.round((approvedCount / subjects.length) * 100) : 0}% concluído
          </div>
        </div>

        {/* Card: Em Andamento */}
        <div className="relative overflow-hidden rounded-2xl border border-blue-100 bg-blue-50/50 p-4 shadow-sm dark:border-blue-950/50 dark:bg-blue-950/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-blue-800 dark:text-blue-400">
              Em Andamento
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-300">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-blue-700 dark:text-blue-300 sm:text-3xl">
              {inProgressCount}
            </span>
            <span className="text-xs text-blue-600 dark:text-blue-400">
              cursando
            </span>
          </div>
          <div className="mt-2 text-xs text-blue-700 dark:text-blue-400 font-medium">
            Aguardando provas/trabalhos
          </div>
        </div>

        {/* Card: Risco */}
        <div className="relative overflow-hidden rounded-2xl border border-amber-100 bg-amber-50/50 p-4 shadow-sm dark:border-amber-950/50 dark:bg-amber-950/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-amber-800 dark:text-amber-400">
              Em Risco / Exame
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-300">
              <AlertTriangle className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span
              className={`text-2xl font-extrabold sm:text-3xl ${
                atRiskCount > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-amber-700 dark:text-amber-300'
              }`}
            >
              {atRiskCount}
            </span>
            <span className="text-xs text-amber-600 dark:text-amber-400">
              matérias
            </span>
          </div>
          <div className="mt-2 text-xs text-amber-700 dark:text-amber-400 font-medium">
            {atRiskCount > 0 ? 'Necessitam atenção imediata' : 'Nenhuma matéria em risco'}
          </div>
        </div>
      </div>

      {/* Barra de Filtro e Busca */}
      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar matéria neste ano (ex: Cálculo, Resmat, Física...)"
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-800 placeholder-slate-400 transition focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-100 dark:placeholder-slate-500"
          />
        </div>

        {/* Filtros por status */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'Todas' },
            { id: 'approved', label: 'Aprovadas' },
            { id: 'pending', label: 'Em Andamento' },
            { id: 'failed', label: 'Em Risco' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => onStatusFilterChange(tab.id)}
              type="button"
              className={`rounded-lg px-3 py-1.5 text-xs font-medium whitespace-nowrap transition ${
                statusFilter === tab.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
