# 🎓 Calculadora de Notas • Regime Anual

Sistema moderno e automatizado para acompanhamento e cálculo de notas universitárias em regime anual, desenvolvido em **React 19**, **Tailwind CSS v4** e **Vite**.

---

## ✨ Funcionalidades

- **Regras Matemáticas Exatas:** Fórmulas pré-configuradas para disciplinas anuais de Engenharia (Resmat, Cálculo II, Fenômenos de Transporte, Física II, Circuitos, etc.) com pesos ponderados para provas e trabalhos.
- **Divisão por Semestres / Bimestres:** Abas de navegação rápida em cada matéria (`1º Semestre`, `2º Semestre` e `Ano Todo`).
- **Simulador Inteligente ("Quanto preciso tirar?"):** Calcula em tempo real a nota necessária na próxima avaliação para atingir a aprovação ($MF \ge 5.0$ ou personalizada).
- **Multi-Anos com Histórico:** Crie novos anos letivos (ex: 2026, 2027) para sempre, mantendo os anos anteriores salvos para consulta.
- **Suporte a Outras Faculdades / Cursos:** Permite criar novas matérias e personalizar pesos % ou médias simples para qualquer faculdade.
- **Armazenamento 100% Local e Privado (`localStorage`):** Seus dados não vão para nenhum servidor. Cada pessoa tem suas próprias notas salvas no seu navegador.
- **Backup e Restauração:** Exportação e importação de arquivo de backup `.json`.
- **Modo Escuro / Modo Claro:** Interface responsiva adaptável para celular e desktop com suporte a vírgula brasileira.

---

## 🛠️ Tecnologias Utilizadas

- [React 19](https://react.dev/)
- [Vite 8](https://vite.dev/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)

---

## 🚀 Como Executar Localmente

1. **Clone o repositório:**
   ```bash
   git clone <URL_DO_SEU_REPOSITORIO>
   cd grade-calculator
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```
   Acesse no navegador: `http://localhost:5173/`

4. **Compilar para produção:**
   ```bash
   npm run build
   ```
   Os arquivos finais serão gerados na pasta `dist/`.

---

## 🌐 Publicação Gratuita (Netlify ou Vercel)

- **Netlify Drop:** Arraste a pasta `dist` gerada em [app.netlify.com/drop](https://app.netlify.com/drop) para ter seu link no ar em 10 segundos.
- **Vercel / GitHub Integration:** Conecte este repositório no Netlify ou Vercel para deploys automáticos a cada `git push`.
