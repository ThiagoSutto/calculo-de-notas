import React, { useRef, useState } from 'react';
import {
  X,
  Settings,
  Download,
  Upload,
  Trash2,
  Sparkles,
  AlertTriangle,
  Calendar,
  Edit2,
  Check,
  ShieldCheck,
} from 'lucide-react';

export default function SettingsModal({
  isOpen,
  onClose,
  activeYear,
  onUpdateYear,
  onDeleteYear,
  totalYearsCount,
  onResetToDefaultEngineering,
  onClearYearGrades,
  onExportJSON,
  onImportJSON,
}) {
  const fileInputRef = useRef(null);
  const [isEditingLabel, setIsEditingLabel] = useState(false);
  const [editedLabel, setEditedLabel] = useState(activeYear?.label || '');

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onImportJSON(file);
      e.target.value = '';
    }
  };

  const handleSaveLabel = () => {
    if (editedLabel.trim()) {
      onUpdateYear({ label: editedLabel.trim() });
      setIsEditingLabel(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
              <Settings className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Gerenciar Período & Dados
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Seus dados ficam 100% salvos no navegador e independentes
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

        <div className="mt-5 space-y-6">
          {/* Informação de Independência do Excel */}
          <div className="rounded-xl border border-indigo-100 bg-indigo-50/70 p-3.5 text-xs text-indigo-950 dark:border-indigo-950/60 dark:bg-indigo-950/30 dark:text-indigo-200 flex items-start gap-2.5">
            <ShieldCheck className="h-4 w-4 mt-0.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
            <div>
              <span className="font-bold">Totalmente independente do Excel:</span> As alterações que você faz aqui ficam salvas exclusivamente no seu navegador. Mexer no arquivo do Excel não altera o site, e mexer no site não altera o Excel.
            </div>
          </div>

          {/* Configurações do Ano Atual */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Período Selecionado
            </h3>

            {/* Nome do Ano */}
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Nome do Ano / Curso
              </label>
              {isEditingLabel ? (
                <div className="mt-1 flex gap-2">
                  <input
                    type="text"
                    value={editedLabel}
                    onChange={(e) => setEditedLabel(e.target.value)}
                    className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={handleSaveLabel}
                    className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-indigo-500"
                  >
                    Salvar
                  </button>
                </div>
              ) : (
                <div className="mt-1 flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-2.5 dark:border-slate-800 dark:bg-slate-800/60">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    {activeYear?.label}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setEditedLabel(activeYear?.label || '');
                      setIsEditingLabel(true);
                    }}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
                  >
                    <Edit2 className="h-3 w-3" />
                    <span>Renomear</span>
                  </button>
                </div>
              )}
            </div>

            {/* Nota de Corte */}
            <div>
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Média de Aprovação deste Período
                </label>
                <span className="text-sm font-extrabold text-indigo-600 dark:text-indigo-400">
                  {Number(activeYear?.passingGrade || 6.0).toFixed(1)}
                </span>
              </div>
              <div className="mt-2 flex items-center gap-2">
                {[5.0, 5.75, 6.0, 7.0].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => onUpdateYear({ passingGrade: val })}
                    className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                      activeYear?.passingGrade === val
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
                  value={activeYear?.passingGrade || 6.0}
                  onChange={(e) =>
                    onUpdateYear({ passingGrade: parseFloat(e.target.value) || 0 })
                  }
                  className="w-20 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-bold text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Seção: Backup de Todos os Anos */}
          <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Backup Completo (Todos os Anos Salvos)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Exporte todos os seus anos letivos e notas para um arquivo de segurança no seu computador.
            </p>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={onExportJSON}
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white p-3 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700/60"
              >
                <Download className="h-4 w-4 text-indigo-500" />
                <span>Exportar Backup (.json)</span>
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white p-3 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700/60"
              >
                <Upload className="h-4 w-4 text-emerald-500" />
                <span>Importar Backup</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>

          {/* Seção: Ações e Modelos do Período */}
          <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Ações no Período Atual
            </h3>

            <div className="space-y-2">
              <button
                type="button"
                onClick={onResetToDefaultEngineering}
                className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3 text-left transition hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800/40 dark:hover:bg-slate-800/80"
              >
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      Carregar Grade de Engenharia (8 Matérias)
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      Restaura as 8 matérias pré-configuradas com todas as fórmulas
                    </div>
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={onClearYearGrades}
                className="flex w-full items-center justify-between rounded-xl border border-rose-200 bg-rose-50/50 p-3 text-left transition hover:bg-rose-100/50 dark:border-rose-950/60 dark:bg-rose-950/20 dark:hover:bg-rose-950/40"
              >
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-100 text-rose-700 dark:bg-rose-900/60 dark:text-rose-300">
                    <Trash2 className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-rose-900 dark:text-rose-300">
                      Zerar Todas as Notas deste Ano
                    </div>
                    <div className="text-[11px] text-rose-600 dark:text-rose-400">
                      Mantém as matérias e fórmulas do ano atual, mas limpa as notas para 0.0
                    </div>
                  </div>
                </div>
              </button>

              {totalYearsCount > 1 && (
                <button
                  type="button"
                  onClick={() => onDeleteYear(activeYear.id)}
                  className="flex w-full items-center justify-between rounded-xl border border-slate-200 p-2.5 text-xs text-rose-600 hover:bg-rose-50 dark:border-slate-800 dark:hover:bg-rose-950/30"
                >
                  <span>Excluir este período do histórico</span>
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
          >
            Concluído
          </button>
        </div>
      </div>
    </div>
  );
}
