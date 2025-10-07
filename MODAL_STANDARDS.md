# Padrões de Modals - BookShelf

## Overlay Padrão

Para manter consistência visual em todo o projeto, todos os modals devem usar o seguinte padrão de overlay:

```tsx
<div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
  {/* Conteúdo do modal */}
</div>
```

## Características do Padrão

### 1. **Overlay Transparente**
- `bg-black/30` - Fundo preto com 30% de opacidade
- Permite ver o conteúdo por trás sem competir visualmente

### 2. **Efeito de Desfoque**
- `backdrop-blur-sm` - Desfoque sutil do conteúdo de fundo
- Cria profundidade visual e destaca o modal

### 3. **Posicionamento**
- `fixed inset-0` - Overlay em tela cheia
- `flex items-center justify-center` - Centralização do conteúdo
- `z-50` - Z-index alto para ficar sobre outros elementos
- `p-4` - Padding para responsividade

## Componentes Card do Modal

O card dentro do modal deve seguir as cores do projeto:

```tsx
<div className="bg-[var(--background)] rounded-2xl shadow-xl max-w-2xl w-full border border-[var(--border)]">
  {/* Conteúdo do modal */}
</div>
```

## Exemplos de Implementação

### Modal Simples
```tsx
{showModal && (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    onClick={handleClose}
  >
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="bg-[var(--background)] rounded-2xl shadow-xl max-w-md w-full border border-[var(--border)]"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Conteúdo */}
    </motion.div>
  </motion.div>
)}
```

### Modal com Animação
- Use `framer-motion` para animações suaves
- `initial` e `animate` para entrada
- `exit` para saída (se usando AnimatePresence)

## Cores dos Elementos

### Backgrounds
- Modal overlay: `bg-black/30 backdrop-blur-sm`
- Modal card: `bg-[var(--background)]`
- Seções: `bg-[var(--card-bg)]`

### Textos
- Títulos: `text-[var(--foreground)]`
- Textos secundários: `text-[var(--secondary-text)]`
- Labels: `text-[var(--foreground)]`

### Bordas
- Bordas padrão: `border-[var(--border)]`
- Divisórias: `border-[var(--border)]`

### Botões
- Primário: `bg-[var(--primary)] hover:bg-[var(--primary-hover)]`
- Secundário: `bg-[var(--card-bg)] hover:bg-[var(--border)]`
- Cancelar: `bg-[var(--card-bg)] text-[var(--foreground)]`

## Implementações Atuais

Os seguintes componentes já seguem este padrão:

- ✅ `LoginPage.tsx` - Modais de reset, termos e privacidade
- ✅ `EnhancedBookDetails.tsx` - Modais de edição e exclusão

## Responsividade

- Use `max-w-*` apropriado para o conteúdo
- Sempre inclua `w-full` para responsividade
- Padding `p-4` no overlay para espaçamento em mobile
- Considere `max-h-[90vh]` para conteúdo muito longo

## Acessibilidade

- Sempre implemente `onClick={(e) => e.stopPropagation()}` no card
- Adicione `onClick={handleClose}` no overlay para fechar
- Use tecla ESC para fechar modais
- Foque no primeiro elemento interativo quando abrir
- Retorne o foco para o elemento que abriu o modal quando fechar