import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './components/Navbar';
import StatsOverview from './components/StatsOverview';
import SubjectCard from './components/SubjectCard';
import NewSubjectModal from './components/NewSubjectModal';
import YearModal from './components/YearModal';
import SettingsModal from './components/SettingsModal';
import { DEFAULT_SUBJECTS } from './data/defaultSubjects';
import {
  loadAppData,
  saveAppData,
  loadSavedSettings,
  saveSettings,
  setFieldValue,
  bindSubjectFunctions,
  getSubjectStatus,
} from './utils/calculator';
import { Check, AlertCircle, Info, Plus } from 'lucide-react';

export default function App() {
  const [appData, setAppData] = useState(() => loadAppData());
  const [settings, setSettings] = useState(() => loadSavedSettings());
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [isNewSubjectModalOpen, setIsNewSubjectModalOpen] = useState(false);
  const [isYearModalOpen, setIsYearModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Ano atual selecionado
  const activeYear = useMemo(() => {
    return (
      appData.years.find((y) => y.id === appData.activeYearId) ||
      appData.years[0] || {
        id: 'default',
        label: 'Ano Letivo',
        passingGrade: 6.0,
        subjects: [],
      }
    );
  }, [appData]);

  // Exibir toast temporário
  const showToast = (text, type = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Efeito para alternar tema escuro/claro
  useEffect(() => {
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.darkMode]);

  // Salvar alterações de AppData
  const handleUpdateAppData = (newAppData) => {
    setAppData(newAppData);
    saveAppData(newAppData);
  };

  // Atualizar configurações globais
  const handleUpdateSettings = (partial) => {
    const updated = { ...settings, ...partial };
    setSettings(updated);
    saveSettings(updated);
  };

  const handleToggleTheme = () => {
    handleUpdateSettings({ darkMode: !settings.darkMode });
  };

  // Trocar de Ano / Período
  const handleSelectYear = (yearId) => {
    handleUpdateAppData({
      ...appData,
      activeYearId: yearId,
    });
    setSearchQuery('');
    setStatusFilter('all');
  };

  // Adicionar Novo Ano / Período
  const handleAddYear = (newYear) => {
    const updatedYears = [...appData.years, newYear];
    handleUpdateAppData({
      years: updatedYears,
      activeYearId: newYear.id,
    });
    showToast(`Período "${newYear.label}" criado e selecionado com sucesso!`);
  };

  // Atualizar propriedades do Ano Atual (nota de corte, label, etc.)
  const handleUpdateActiveYear = (partial) => {
    const updatedYears = appData.years.map((y) => {
      if (y.id !== activeYear.id) return y;
      return { ...y, ...partial };
    });
    handleUpdateAppData({
      ...appData,
      years: updatedYears,
    });
    showToast('Configurações do período atualizadas!');
  };

  // Excluir Ano / Período
  const handleDeleteYear = (yearId) => {
    if (appData.years.length <= 1) {
      showToast('Você precisa manter pelo menos um período no histórico.', 'error');
      return;
    }
    const target = appData.years.find((y) => y.id === yearId);
    if (
      window.confirm(
        `Tem certeza que deseja excluir o período "${target?.label}" e todo o seu histórico de notas?`
      )
    ) {
      const remainingYears = appData.years.filter((y) => y.id !== yearId);
      handleUpdateAppData({
        years: remainingYears,
        activeYearId: remainingYears[0].id,
      });
      showToast('Período excluído do histórico.', 'info');
      setIsSettingsModalOpen(false);
    }
  };

  // Atualização de notas do ano atual
  const handleGradeChange = (subjectId, fieldKey, value) => {
    const updatedSubjects = activeYear.subjects.map((sub) => {
      if (sub.id !== subjectId) return sub;
      return {
        ...sub,
        grades: setFieldValue(sub.grades, fieldKey, value),
      };
    });

    const updatedYears = appData.years.map((y) => {
      if (y.id !== activeYear.id) return y;
      return { ...y, subjects: updatedSubjects };
    });

    handleUpdateAppData({
      ...appData,
      years: updatedYears,
    });
  };

  // Restaurar uma única matéria para o padrão
  const handleResetSubject = (subjectId) => {
    const original = DEFAULT_SUBJECTS.find((s) => s.id === subjectId);
    if (!original) return;

    const updatedSubjects = activeYear.subjects.map((sub) => {
      if (sub.id !== subjectId) return sub;
      return {
        ...original,
        grades: JSON.parse(JSON.stringify(original.grades)),
      };
    });

    const updatedYears = appData.years.map((y) => {
      if (y.id !== activeYear.id) return y;
      return { ...y, subjects: updatedSubjects };
    });

    handleUpdateAppData({ ...appData, years: updatedYears });
    showToast(`Notas de "${original.name}" restauradas para o valor padrão.`);
  };

  // Excluir uma disciplina do ano atual
  const handleDeleteSubject = (subjectId) => {
    const target = activeYear.subjects.find((s) => s.id === subjectId);
    if (window.confirm(`Deseja remover a disciplina "${target?.name || ''}" deste ano?`)) {
      const updatedSubjects = activeYear.subjects.filter((s) => s.id !== subjectId);
      const updatedYears = appData.years.map((y) => {
        if (y.id !== activeYear.id) return y;
        return { ...y, subjects: updatedSubjects };
      });
      handleUpdateAppData({ ...appData, years: updatedYears });
      showToast('Disciplina removida com sucesso.', 'info');
    }
  };

  // Adicionar nova matéria no ano atual
  const handleAddSubject = (newSubject) => {
    const updatedSubjects = [...activeYear.subjects, newSubject];
    const updatedYears = appData.years.map((y) => {
      if (y.id !== activeYear.id) return y;
      return { ...y, subjects: updatedSubjects };
    });
    handleUpdateAppData({ ...appData, years: updatedYears });
    showToast(`Disciplina "${newSubject.name}" adicionada ao ano atual!`);
  };

  // Carregar grade completa de Engenharia no ano atual
  const handleResetToDefaultEngineering = () => {
    if (
      window.confirm(
        'Deseja carregar a grade completa com as 8 matérias e fórmulas de Engenharia neste ano?'
      )
    ) {
      const freshSubjects = DEFAULT_SUBJECTS.map((s) => ({
        ...s,
        grades: JSON.parse(JSON.stringify(s.grades)),
      }));

      const updatedYears = appData.years.map((y) => {
        if (y.id !== activeYear.id) return y;
        return { ...y, subjects: freshSubjects };
      });

      handleUpdateAppData({ ...appData, years: updatedYears });
      showToast('Grade de Engenharia carregada com sucesso!');
      setIsSettingsModalOpen(false);
    }
  };

  // Zerar notas do ano atual
  const handleClearYearGrades = () => {
    if (
      window.confirm(
        'Tem certeza que deseja zerar todas as notas deste ano? As matérias e fórmulas continuarão intactas.'
      )
    ) {
      const clearedSubjects = activeYear.subjects.map((sub) => {
        const copy = JSON.parse(JSON.stringify(sub));
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

      const updatedYears = appData.years.map((y) => {
        if (y.id !== activeYear.id) return y;
        return { ...y, subjects: clearedSubjects };
      });

      handleUpdateAppData({ ...appData, years: updatedYears });
      showToast('Notas deste ano zeradas para 0.0.', 'info');
      setIsSettingsModalOpen(false);
    }
  };

  // Exportar backup completo JSON
  const handleExportJSON = () => {
    try {
      const exportData = {
        exportedAt: new Date().toISOString(),
        settings,
        appData: {
          activeYearId: appData.activeYearId,
          years: appData.years.map((y) => ({
            ...y,
            subjects: y.subjects.map((s) => {
              const c = { ...s };
              delete c.calculate;
              delete c.simulatePending;
              return c;
            }),
          })),
        },
      };
      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `notas_backup_completo_${new Date().toISOString().slice(0, 10)}.json`;
      link.click();
      URL.revokeObjectURL(url);
      showToast('Backup completo baixado com sucesso!');
    } catch (err) {
      console.error(err);
      showToast('Erro ao exportar backup', 'error');
    }
  };

  // Importar backup JSON
  const handleImportJSON = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result);
        if (data.appData && Array.isArray(data.appData.years)) {
          const yearsWithFn = data.appData.years.map((y) => ({
            ...y,
            passingGrade: y.passingGrade || 6.0,
            subjects: bindSubjectFunctions(y.subjects || []),
          }));
          handleUpdateAppData({
            activeYearId: data.appData.activeYearId || yearsWithFn[0].id,
            years: yearsWithFn,
          });
          if (data.settings) handleUpdateSettings(data.settings);
          showToast('Backup completo restaurado com sucesso!');
          setIsSettingsModalOpen(false);
        } else {
          showToast('Arquivo de backup inválido', 'error');
        }
      } catch (err) {
        showToast('Erro ao ler o arquivo JSON', 'error');
      }
    };
    reader.readAsText(file);
  };

  // Filtragem de matérias
  const filteredSubjects = useMemo(() => {
    const currentSubjects = activeYear.subjects || [];
    return currentSubjects.filter((s) => {
      const matchText =
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.code.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchText) return false;

      if (statusFilter === 'all') return true;
      const status = getSubjectStatus(s, activeYear.passingGrade || 6.0);
      return status.type === statusFilter;
    });
  }, [activeYear, searchQuery, statusFilter]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
      {/* Navbar com Seletor de Anos e Ações */}
      <Navbar
        settings={settings}
        years={appData.years}
        activeYearId={appData.activeYearId}
        onSelectYear={handleSelectYear}
        onOpenNewYear={() => setIsYearModalOpen(true)}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        onOpenNewSubject={() => setIsNewSubjectModalOpen(true)}
        onToggleTheme={handleToggleTheme}
      />

      {/* Conteúdo Principal */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-6">
        {/* Painel de Estatísticas do Ano Selecionado (Sem Média Geral) */}
        <StatsOverview
          subjects={activeYear.subjects || []}
          passingGrade={activeYear.passingGrade || 6.0}
          activeYearLabel={activeYear.label}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
        />

        {/* Lista de Disciplinas */}
        {filteredSubjects.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
            {filteredSubjects.map((subject) => (
              <SubjectCard
                key={subject.id}
                subject={subject}
                passingGrade={activeYear.passingGrade || 6.0}
                onGradeChange={handleGradeChange}
                onResetSubject={handleResetSubject}
                onDeleteSubject={handleDeleteSubject}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900">
            <Info className="h-10 w-10 text-slate-400 mb-3" />
            <h3 className="text-base font-bold text-slate-800 dark:text-white">
              {activeYear.subjects?.length === 0
                ? 'Nenhuma matéria neste ano ainda'
                : 'Nenhuma disciplina encontrada com esse filtro'}
            </h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-md">
              {activeYear.subjects?.length === 0
                ? 'Este período começou em branco. Clique abaixo para cadastrar suas primeiras disciplinas com suas próprias fórmulas!'
                : 'Tente alterar os termos de busca ou o filtro de status selecionado.'}
            </p>
            <div className="mt-4 flex gap-2">
              {activeYear.subjects?.length === 0 ? (
                <button
                  onClick={() => setIsNewSubjectModalOpen(true)}
                  type="button"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-indigo-500 shadow-sm"
                >
                  <Plus className="h-4 w-4" />
                  <span>Cadastrar Matéria</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('all');
                  }}
                  type="button"
                  className="rounded-lg bg-indigo-50 px-3.5 py-2 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-950 dark:text-indigo-300"
                >
                  Limpar Filtros
                </button>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Rodapé com indicação de independência e armazenamento local */}
      <footer className="mt-12 border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            Calculadora de Notas Anuais • Multi-períodos com histórico permanente
          </div>
          <div className="flex items-center gap-1.5 text-[11px]">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500"></span>
            Armazenamento 100% privado no seu navegador
          </div>
        </div>
      </footer>

      {/* Modais */}
      <NewSubjectModal
        isOpen={isNewSubjectModalOpen}
        onClose={() => setIsNewSubjectModalOpen(false)}
        onAddSubject={handleAddSubject}
      />

      <YearModal
        isOpen={isYearModalOpen}
        onClose={() => setIsYearModalOpen(false)}
        currentYear={activeYear}
        onAddYear={handleAddYear}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        activeYear={activeYear}
        onUpdateYear={handleUpdateActiveYear}
        onDeleteYear={handleDeleteYear}
        totalYearsCount={appData.years.length}
        onResetToDefaultEngineering={handleResetToDefaultEngineering}
        onClearYearGrades={handleClearYearGrades}
        onExportJSON={handleExportJSON}
        onImportJSON={handleImportJSON}
      />

      {/* Toast de Notificação */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-xs font-semibold text-white shadow-xl dark:bg-white dark:text-slate-900 animate-in slide-in-from-bottom-2 duration-200">
          {toastMessage.type === 'error' ? (
            <AlertCircle className="h-4 w-4 text-rose-400" />
          ) : toastMessage.type === 'info' ? (
            <Info className="h-4 w-4 text-sky-400" />
          ) : (
            <Check className="h-4 w-4 text-emerald-400" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}
    </div>
  );
}
