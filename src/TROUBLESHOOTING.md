# 🔧 Troubleshooting - MediTrak

Guia completo de solução de problemas para o MediTrak.

## 📋 Índice

- [Problemas de Instalação](#problemas-de-instalação)
- [Erros de Compilação](#erros-de-compilação)
- [Problemas de Interface](#problemas-de-interface)
- [Problemas de Funcionalidade](#problemas-de-funcionalidade)
- [Problemas de Performance](#problemas-de-performance)
- [Problemas de Navegação](#problemas-de-navegação)

---

## 🚨 Problemas de Instalação

### "Module not found" ao executar npm install

**Problema**: Dependências não instaladas corretamente

**Solução**:
```bash
# Limpar cache
npm cache clean --force
rm -rf node_modules package-lock.json

# Reinstalar
npm install
```

### "Cannot find module 'sonner@2.0.3'"

**Problema**: Versão específica do Sonner não instalada

**Solução**:
```bash
npm install sonner@2.0.3
```

### "peer dependencies" warnings

**Problema**: Conflitos de versão entre dependências

**Solução**:
```bash
# Ignorar warnings de peer dependencies (geralmente seguro)
npm install --legacy-peer-deps
```

### Node.js versão incompatível

**Problema**: Versão do Node.js muito antiga

**Solução**:
```bash
# Verificar versão
node --version

# Deve ser >= 16.x
# Instale a versão mais recente do Node.js
```

---

## 💻 Erros de Compilação

### TypeScript: "Cannot find module './components/...'"

**Problema**: Imports com caminho incorreto

**Solução**:
```typescript
// ❌ Errado
import { Button } from "components/ui/button";

// ✅ Correto
import { Button } from "./components/ui/button";
```

### "Type 'X' is not assignable to type 'Y'"

**Problema**: Tipos incompatíveis no TypeScript

**Solução**:
```typescript
// Verifique as interfaces em App.tsx
// Certifique-se de que está passando os tipos corretos

// Exemplo:
interface Props {
  onNavigate: (page: string, mode?: "paciente" | "cuidador") => void;
}

// Mode é opcional, então pode ser omitido
onNavigate("login"); // ✅ OK
onNavigate("login", "paciente"); // ✅ OK
```

### "Cannot use import statement outside a module"

**Problema**: Configuração do módulo incorreta

**Solução**:
Verifique `package.json`:
```json
{
  "type": "module"
}
```

### Tailwind classes não aplicando

**Problema**: CSS não importado corretamente

**Solução**:
1. Verifique se `styles/globals.css` existe
2. Certifique-se de que está importado no entry point
3. Limpe o cache do build:
```bash
rm -rf dist
npm run dev
```

---

## 🎨 Problemas de Interface

### Background ondulado não aparece

**Problema**: SVG pattern não renderizando

**Solução**:
- Verifique se há erros no console
- Confirme que o pattern ID é único (ex: `wave-login`, `wave-dashboard`)
- Limpe o cache do navegador (Ctrl+Shift+R)

### Cards não estão arredondados

**Problema**: Classes Tailwind não aplicadas

**Solução**:
```bash
# Reconstruir projeto
npm run build
npm run dev
```

### Cores erradas

**Problema**: Classes de cor incorretas

**Solução**:
Verifique as cores corporativas:
- Azul: `#1e3a8a` ou `text-[#1e3a8a]`
- Ciano: `#00bcd4` ou `bg-[#00bcd4]`
- Verde: `#14b8a6` ou `bg-[#14b8a6]`

### Bottom tabs não aparecem

**Problema**: Z-index ou CSS incorreto

**Solução**:
Verifique que a nav tem:
```tsx
className="fixed bottom-0 left-0 right-0 ... z-50"
```

### Modal não centraliza

**Problema**: Flexbox incorreto

**Solução**:
```tsx
className="fixed inset-0 flex items-center justify-center"
```

---

## ⚙️ Problemas de Funcionalidade

### Login não funciona

**Sintomas**: Nada acontece ao clicar em "Entrar"

**Diagnóstico**:
1. Abra o console (F12)
2. Verifique se há erros JavaScript
3. Verifique se `onLogin` está sendo chamado

**Solução**:
```typescript
// Verifique se a função handleSubmit está correta
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault(); // ← IMPORTANTE
  onLogin(email, password, selectedMode);
};
```

### Modal não fecha

**Problema**: Estado não atualizando

**Solução**:
```typescript
// Certifique-se de chamar onClose
<button onClick={onClose}>
  <X className="w-5 h-5" />
</button>
```

### Dados não aparecem

**Problema**: Dados mock não carregados

**Solução**:
Verifique o estado inicial no `App.tsx`:
```typescript
const [patients, setPatients] = useState<Patient[]>([
  { id: 1, name: "Ana Silva", ... },
  // Deve ter dados aqui
]);
```

### Navegação entre tabs não funciona

**Problema**: Estado da tab não mudando

**Solução**:
```typescript
const [currentTab, setCurrentTab] = useState("hoje");

<button onClick={() => setCurrentTab("hoje")}>
  Hoje
</button>
```

### Toast não aparece

**Problema**: Toaster não renderizado

**Solução**:
Verifique se no `App.tsx` tem:
```typescript
<Toaster position="top-center" />
```

---

## 🚀 Problemas de Performance

### App muito lento

**Diagnóstico**:
1. Abra DevTools → Performance
2. Grave uma sessão
3. Identifique gargalos

**Soluções comuns**:
```typescript
// Use React.memo para componentes pesados
export const HeavyComponent = React.memo(({ data }) => {
  // ...
});

// Use useCallback para funções
const handleClick = useCallback(() => {
  // ...
}, [dependencies]);

// Use useMemo para cálculos pesados
const expensiveValue = useMemo(() => {
  return calculateSomething(data);
}, [data]);
```

### Re-renders excessivos

**Problema**: Componentes renderizando sem necessidade

**Solução**:
```bash
# Instale React DevTools
# Ative "Highlight updates when components render"
# Identifique componentes que re-renderizam muito
```

### Build muito grande

**Problema**: Bundle size excessivo

**Solução**:
```bash
# Analise o bundle
npm run build
npx vite-bundle-visualizer

# Identifique pacotes grandes
# Considere lazy loading
```

---

## 🧭 Problemas de Navegação

### Voltar para landing não funciona

**Problema**: Navegação não resetando estado

**Solução**:
```typescript
const handleNavigate = (page: string, mode?: "paciente" | "cuidador") => {
  if (mode) {
    setSelectedMode(mode);
  }
  setCurrentPage(page);
};
```

### URL não muda ao navegar

**Problema**: Usando state ao invés de router

**Explicação**: Esta é uma SPA (Single Page Application) sem router. Para adicionar URLs:

```bash
npm install react-router-dom
```

Depois implemente rotas.

### Estado perdido ao navegar

**Problema**: State local sendo perdido

**Solução**:
- Mova o estado para `App.tsx`
- Use Context API
- Ou implemente state management (Zustand, Redux)

---

## 📱 Problemas Mobile

### Touch não funciona bem

**Problema**: Área de toque muito pequena

**Solução**:
```tsx
// Aumente a área de toque
className="p-4" // Ao invés de p-2
```

### Zoom indesejado em inputs

**Problema**: Navegador dá zoom ao focar input

**Solução**:
```html
<!-- Adicione ao index.html -->
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
```

### Layout quebrado em mobile

**Problema**: Unidades fixas ao invés de responsivas

**Solução**:
```tsx
// ❌ Evite
className="w-[500px]"

// ✅ Use
className="w-full max-w-md"
```

---

## 🔍 Debug Avançado

### Como debugar no navegador

1. **Console.log estratégico**:
```typescript
console.log('Estado atual:', { currentPage, currentUser, selectedMode });
```

2. **React DevTools**:
- Instale a extensão
- Inspecione componentes
- Veja props e state em tempo real

3. **Network tab**:
- Veja requests (quando tiver backend)
- Verifique status codes
- Inspecione payloads

4. **Breakpoints**:
- Abra Sources no DevTools
- Clique na linha para adicionar breakpoint
- Execute e pause quando chegar lá

### Logs úteis para debug

```typescript
// No App.tsx
useEffect(() => {
  console.log('🔵 Página mudou:', currentPage);
  console.log('👤 Usuário:', currentUser);
  console.log('🎯 Modo:', selectedMode);
}, [currentPage, currentUser, selectedMode]);
```

### Resetar estado completamente

```typescript
// Adicione função de reset
const resetApp = () => {
  setCurrentPage("landing");
  setCurrentUser(null);
  setSelectedMode("paciente");
};

// Use quando necessário
<button onClick={resetApp}>Reset App</button>
```

---

## 🆘 Quando Pedir Ajuda

Se nenhuma solução acima funcionou:

1. **Colete informações**:
   - Versão do Node.js (`node --version`)
   - Versão do npm (`npm --version`)
   - Sistema operacional
   - Navegador e versão
   - Mensagem de erro completa
   - Steps to reproduce

2. **Verifique documentação**:
   - README.md
   - INSTALACAO.md
   - Este arquivo

3. **Abra uma Issue**:
   - Descreva o problema claramente
   - Inclua código relevante
   - Adicione screenshots se aplicável
   - Mencione o que já tentou

---

## 💡 Dicas de Prevenção

### Antes de começar
- [ ] Leia o README.md completo
- [ ] Siga o INSTALACAO.md passo a passo
- [ ] Verifique versões de Node.js e npm
- [ ] Use um editor com TypeScript support (VSCode)

### Durante desenvolvimento
- [ ] Mantenha console aberto
- [ ] Use TypeScript strict mode
- [ ] Teste em múltiplos navegadores
- [ ] Teste responsividade
- [ ] Comite frequentemente

### Antes de deploy
- [ ] Execute `npm run build` localmente
- [ ] Teste a build (`npm run preview`)
- [ ] Verifique console para warnings
- [ ] Teste todas as funcionalidades
- [ ] Valide em dispositivos móveis reais

---

## 📚 Recursos Adicionais

### Documentação oficial
- [React Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Vite Guide](https://vitejs.dev/guide/)

### Comunidades
- [Stack Overflow](https://stackoverflow.com/questions/tagged/reactjs)
- [Reddit r/reactjs](https://reddit.com/r/reactjs)
- [Discord ReactiFlux](https://www.reactiflux.com/)

---

## ✅ Checklist de Verificação Rápida

Quando algo não funcionar, verifique:

- [ ] `npm install` foi executado?
- [ ] Versão do Node >= 16?
- [ ] Console tem erros?
- [ ] Imports estão corretos?
- [ ] Props sendo passadas corretamente?
- [ ] Estado inicializado?
- [ ] Event handlers têm `e.preventDefault()`?
- [ ] CSS está importado?
- [ ] Navegador está atualizado?
- [ ] Cache foi limpo?

---

**Ainda com problemas?** 

Revise a documentação completa ou abra uma issue com todos os detalhes.

**Boa sorte! 🚀**
