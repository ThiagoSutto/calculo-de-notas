import React, { useState, useRef, useEffect } from 'react';
import {
  GraduationCap,
  Plus,
  Settings,
  Sun,
  Moon,
  Calendar,
  ChevronDown,
  Check,
  FolderPlus,
} from 'lucide-react';

export default function Navbar({
  settings,
  years,
  activeYearId,
  onSelectYear,
  onOpenNewYear,
  onOpenSettings,
  onOpenNewSubject,
  onToggleTheme,
}) {
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const activeYear = years.find((y) => y.id === activeYearId) || years[0];

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsYearDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/90">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Logo, Título e Seletor de Ano */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white shadow-md shadow-indigo-500/20">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold tracking-tight text-slate-900 dark:text-white sm:text-lg">
                Cálculo de Notas
              </h1>
              <span className="hidden rounded-full bg-indigo-50 px-2 py-0.5 text-[11px] font-semibold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 sm:inline-block">
                Regime Anual
              </span>
            </div>

            {/* Dropdown de Seleção de Ano / Período */}
            <div className="relative mt-0.5" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsYearDropdownOpen(!isYearDropdownOpen)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 transition"
              >
                <Calendar className="h-3.5 w-3.5" />
                <span>{activeYear?.label || 'Selecionar Ano'}</span>
                <ChevronDown className="h-3 w-3" />
              </button>

              {isYearDropdownOpen && (
                <div className="absolute left-0 top-full mt-2 w-64 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl dark:border-slate-800 dark:bg-slate-900 z-50">
                  <div className="px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Seus Anos / Períodos Salvos
                  </div>

                  <div className="space-y-0.5 max-h-56 overflow-y-auto">
                    {years.map((y) => (
                      <button
                        key={y.id}
                        type="button"
                        onClick={() => {
                          onSelectYear(y.id);
                          setIsYearDropdownOpen(false);
                        }}
                        className={`flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-xs text-left transition ${
                          y.id === activeYearId
                            ? 'bg-indigo-50 font-bold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300'
                            : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                        }`}
                      >
                        <span className="truncate">{y.label}</span>
                        {y.id === activeYearId && <Check className="h-3.5 w-3.5 shrink-0" />}
                      </button>
                    ))}
                  </div>

                  <div className="mt-1 pt-1 border-t border-slate-100 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => {
                        setIsYearDropdownOpen(false);
                        onOpenNewYear();
                      }}
                      className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-950/50 transition"
                    >
                      <FolderPlus className="h-3.5 w-3.5" />
                      <span>+ Criar Novo Ano / Período</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Ações (Nova Matéria, Novo Ano, Configurações, Tema) */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenNewSubject}
            type="button"
            className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-2 text-xs font-medium text-white shadow-sm transition hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600/50 sm:text-sm"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Nova Matéria</span>
            <span className="sm:hidden">Matéria</span>
          </button>

          <button
            onClick={onOpenSettings}
            type="button"
            title="Configurações e Gerenciamento"
            className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
          >
            <Settings className="h-4 w-4" />
          </button>

          <button
            onClick={onToggleTheme}
            type="button"
            title={settings.darkMode ? 'Modo Claro' : 'Modo Escuro'}
            className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
          >
            {settings.darkMode ? (
              <Sun className="h-4 w-4 text-amber-400" />
            ) : (
              <Moon className="h-4 w-4 text-slate-600" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
