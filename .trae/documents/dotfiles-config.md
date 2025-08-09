# Configuración Dotfiles - Estilo ThePrimeagen

## Estructura de Dotfiles

```
.devcontainer/dotfiles/
├── .tmux.conf              # Configuración tmux
├── .zshrc                  # Shell configuration
├── .config/
│   ├── starship.toml       # Prompt configuration
│   └── nvim/               # Neovim configuration
│       ├── init.lua
│       ├── lua/
│       │   ├── config/
│       │   │   ├── lazy.lua
│       │   │   ├── options.lua
│       │   │   └── keymaps.lua
│       │   └── plugins/
│       │       ├── telescope.lua
│       │       ├── treesitter.lua
│       │       ├── lsp.lua
│       │       ├── completion.lua
│       │       ├── gitsigns.lua
│       │       ├── lualine.lua
│       │       └── harpoon.lua
└── scripts/
    └── install-plugins.sh
```

## 1. Configuración Tmux (.tmux.conf)

```bash
# ~/.tmux.conf - Configuración estilo ThePrimeagen

# ============================================================================
# CONFIGURACIÓN BÁSICA
# ============================================================================

# Cambiar prefix de Ctrl-b a Ctrl-a (más ergonómico)
unbind C-b
set-option -g prefix C-a
bind-key C-a send-prefix

# Configuración de terminal
set -g default-terminal "screen-256color"
set -ga terminal-overrides ",xterm-256color*:Tc"

# Habilitar mouse
set -g mouse on

# Configurar índices de ventanas y paneles
set -g base-index 1
set -g pane-base-index 1
set-window-option -g pane-base-index 1
set-option -g renumber-windows on

# Configuración de escape time (importante para Neovim)
set -sg escape-time 0

# Configurar historial
set -g history-limit 10000

# ============================================================================
# KEYBINDINGS ESTILO VIM
# ============================================================================

# Modo vi para copy mode
setw -g mode-keys vi

# Splits más intuitivos
bind | split-window -h -c "#{pane_current_path}"
bind - split-window -v -c "#{pane_current_path}"
unbind '"'
unbind %

# Navegación entre paneles estilo vim
bind h select-pane -L
bind j select-pane -D
bind k select-pane -U
bind l select-pane -R

# Resize de paneles
bind -r H resize-pane -L 5
bind -r J resize-pane -D 5
bind -r K resize-pane -U 5
bind -r L resize-pane -R 5

# Navegación entre ventanas
bind -r C-h select-window -t :-
bind -r C-l select-window -t :+

# Copy mode bindings
bind-key -T copy-mode-vi v send-keys -X begin-selection
bind-key -T copy-mode-vi C-v send-keys -X rectangle-toggle
bind-key -T copy-mode-vi y send-keys -X copy-selection-and-cancel

# Reload config
bind r source-file ~/.tmux.conf \; display-message "Config reloaded!"

# ============================================================================
# TEMA Y APARIENCIA
# ============================================================================

# Colores de la status bar
set -g status-style 'bg=#1e1e2e fg=#cdd6f4'
set -g status-left-style 'bg=#89b4fa fg=#1e1e2e'
set -g status-right-style 'bg=#89b4fa fg=#1e1e2e'

# Configuración de la status bar
set -g status-left-length 100
set -g status-right-length 100
set -g status-left ' #S '
set -g status-right ' %Y-%m-%d %H:%M '

# Colores de ventanas
set -g window-status-current-style 'bg=#89b4fa fg=#1e1e2e'
set -g window-status-style 'bg=#313244 fg=#cdd6f4'
set -g window-status-format ' #I:#W '
set -g window-status-current-format ' #I:#W '

# Colores de paneles
set -g pane-border-style 'fg=#313244'
set -g pane-active-border-style 'fg=#89b4fa'

# ============================================================================
# PLUGINS (TPM - Tmux Plugin Manager)
# ============================================================================

# Lista de plugins
set -g @plugin 'tmux-plugins/tpm'
set -g @plugin 'tmux-plugins/tmux-sensible'
set -g @plugin 'tmux-plugins/tmux-resurrect'
set -g @plugin 'tmux-plugins/tmux-continuum'
set -g @plugin 'tmux-plugins/tmux-yank'
set -g @plugin 'christoomey/vim-tmux-navigator'
set -g @plugin 'tmux-plugins/tmux-prefix-highlight'

# Configuración de plugins
set -g @resurrect-capture-pane-contents 'on'
set -g @continuum-restore 'on'
set -g @continuum-save-interval '15'

# Configuración de vim-tmux-navigator
is_vim="ps -o state= -o comm= -t '#{pane_tty}' \
    | grep -iqE '^[^TXZ ]+ +(\\S+\\/)?g?(view|n?vim?x?)(diff)?$'"
bind-key -n 'C-h' if-shell "$is_vim" 'send-keys C-h'  'select-pane -L'
bind-key -n 'C-j' if-shell "$is_vim" 'send-keys C-j'  'select-pane -D'
bind-key -n 'C-k' if-shell "$is_vim" 'send-keys C-k'  'select-pane -U'
bind-key -n 'C-l' if-shell "$is_vim" 'send-keys C-l'  'select-pane -R'

# Inicializar TPM (mantener al final del archivo)
run '~/.tmux/plugins/tpm/tpm'
```

## 2. Configuración Zsh (.zshrc)

```bash
# ~/.zshrc - Configuración optimizada para desarrollo

# ============================================================================
# OH-MY-ZSH CONFIGURATION
# ============================================================================

export ZSH="$HOME/.oh-my-zsh"

# Tema (será sobrescrito por Starship)
ZSH_THEME=""

# Plugins de Oh My Zsh
plugins=(
    git
    npm
    node
    docker
    docker-compose
    zsh-autosuggestions
    zsh-syntax-highlighting
    history-substring-search
)

source $ZSH/oh-my-zsh.sh

# ============================================================================
# CONFIGURACIÓN DE SHELL
# ============================================================================

# Historial
HISTSIZE=10000
SAVEHIST=10000
setopt HIST_IGNORE_DUPS
setopt HIST_IGNORE_ALL_DUPS
setopt HIST_IGNORE_SPACE
setopt HIST_SAVE_NO_DUPS
setopt SHARE_HISTORY

# Autocompletado
autoload -Uz compinit
compinit

# Case insensitive completion
zstyle ':completion:*' matcher-list 'm:{a-z}={A-Za-z}'

# ============================================================================
# VARIABLES DE ENTORNO
# ============================================================================

# Editor por defecto
export EDITOR='nvim'
export VISUAL='nvim'

# Node.js
export NODE_ENV=development

# Configuración de colores
export CLICOLOR=1
export LSCOLORS=ExFxBxDxCxegedabagacad

# FZF configuration
export FZF_DEFAULT_COMMAND='fd --type f --hidden --follow --exclude .git'
export FZF_CTRL_T_COMMAND="$FZF_DEFAULT_COMMAND"
export FZF_DEFAULT_OPTS='
  --color=bg+:#313244,bg:#1e1e2e,spinner:#f5e0dc,hl:#f38ba8
  --color=fg:#cdd6f4,header:#f38ba8,info:#cba6ac,pointer:#f5e0dc
  --color=marker:#f5e0dc,fg+:#cdd6f4,prompt:#cba6ac,hl+:#f38ba8
  --height 40% --layout=reverse --border
'

# ============================================================================
# ALIASES
# ============================================================================

# Navegación
alias ..='cd ..'
alias ...='cd ../..'
alias ....='cd ../../..'
alias ~='cd ~'

# Listado de archivos
alias ll='ls -la'
alias la='ls -A'
alias l='ls -CF'
alias lt='ls -ltr'

# Git aliases
alias gs='git status'
alias ga='git add'
alias gaa='git add --all'
alias gc='git commit'
alias gcm='git commit -m'
alias gp='git push'
alias gpl='git pull'
alias gl='git log --oneline --graph --decorate'
alias gd='git diff'
alias gb='git branch'
alias gco='git checkout'
alias gcb='git checkout -b'

# Tmux aliases
alias t='tmux'
alias ta='tmux attach-session -t'
alias tls='tmux list-sessions'
alias tn='tmux new-session -s'

# Proyecto específico
alias dev='npm run dev'
alias build='npm run build'
alias preview='npm run preview'
alias deploy='make deploy'

# Neovim
alias vim='nvim'
alias vi='nvim'

# Docker
alias dc='docker-compose'
alias dcu='docker-compose up'
alias dcd='docker-compose down'
alias dcb='docker-compose build'

# Utilidades
alias grep='grep --color=auto'
alias fgrep='fgrep --color=auto'
alias egrep='egrep --color=auto'
alias cat='cat -n'
alias mkdir='mkdir -pv'

# ============================================================================
# FUNCIONES ÚTILES
# ============================================================================

# Crear directorio y navegar a él
mkcd() {
    mkdir -p "$1" && cd "$1"
}

# Buscar archivos por nombre
ff() {
    find . -type f -name "*$1*"
}

# Buscar en contenido de archivos
fg() {
    grep -r "$1" .
}

# Git commit rápido
gcam() {
    git add --all && git commit -m "$1"
}

# Crear nueva rama y cambiar a ella
gcbn() {
    git checkout -b "$1" && git push -u origin "$1"
}

# Tmux session rápida para proyecto
work() {
    local session_name="${1:-$(basename $(pwd))}"
    tmux new-session -d -s "$session_name" -c "$(pwd)"
    tmux send-keys -t "$session_name" 'nvim' Enter
    tmux split-window -t "$session_name" -h -c "$(pwd)"
    tmux send-keys -t "$session_name" 'npm run dev' Enter
    tmux select-pane -t "$session_name":0.0
    tmux attach-session -t "$session_name"
}

# ============================================================================
# CONFIGURACIÓN DE HERRAMIENTAS
# ============================================================================

# FZF key bindings
[ -f ~/.fzf.zsh ] && source ~/.fzf.zsh

# Starship prompt
eval "$(starship init zsh)"

# Autosuggestions configuration
ZSH_AUTOSUGGEST_HIGHLIGHT_STYLE='fg=#585b70'
ZSH_AUTOSUGGEST_STRATEGY=(history completion)

# ============================================================================
# PATH CONFIGURATION
# ============================================================================

# Agregar directorios locales al PATH
export PATH="$HOME/.local/bin:$PATH"
export PATH="$HOME/.npm-global/bin:$PATH"

# Node.js global packages
export NPM_CONFIG_PREFIX="$HOME/.npm-global"

echo "🚀 Entorno de desarrollo cargado correctamente!"
```

## 3. Configuración Starship (starship.toml)

```toml
# ~/.config/starship.toml - Prompt minimalista y rápido

format = """
$username\
$hostname\
$directory\
$git_branch\
$git_status\
$nodejs\
$docker_context\
$line_break\
$character"""

[username]
style_user = "bold blue"
style_root = "bold red"
format = "[$user]($style) "
show_always = false

[hostname]
ssh_only = true
format = "on [$hostname](bold yellow) "

[directory]
style = "bold cyan"
format = "in [$path]($style) "
truncation_length = 3
truncate_to_repo = true

[git_branch]
symbol = "🌱 "
style = "bold purple"
format = "on [$symbol$branch]($style) "

[git_status]
style = "bold red"
format = "([\[$all_status$ahead_behind\]]($style) )"
ahead = "⇡${count}"
behind = "⇣${count}"
diverged = "⇕⇡${ahead_count}⇣${behind_count}"
conflicted = "🏳"
deleted = "🗑"
renamed = "📛"
modified = "📝"
staged = "🗃"
untracked = "🤷"

[nodejs]
symbol = "⬢ "
style = "bold green"
format = "via [$symbol($version )]($style)"

[docker_context]
symbol = "🐳 "
style = "blue bold"
format = "via [$symbol$context]($style) "

[character]
success_symbol = "[❯](bold green)"
error_symbol = "[❯](bold red)"
vicmd_symbol = "[❮](bold yellow)"

[line_break]
disabled = false

# Configuración de colores personalizados
[palettes.catppuccin_mocha]
rosewater = "#f5e0dc"
flamingo = "#f2cdcd"
pink = "#f5c2e7"
mauve = "#cba6f7"
red = "#f38ba8"
maroon = "#eba0ac"
peach = "#fab387"
yellow = "#f9e2af"
green = "#a6e3a1"
teal = "#94e2d5"
sky = "#89dceb"
sapphire = "#74c7ec"
blue = "#89b4fa"
lavender = "#b4befe"
text = "#cdd6f4"
subtext1 = "#bac2de"
subtext0 = "#a6adc8"
overlay2 = "#9399b2"
overlay1 = "#7f849c"
overlay0 = "#6c7086"
surface2 = "#585b70"
surface1 = "#45475a"
surface0 = "#313244"
base = "#1e1e2e"
mantle = "#181825"
crust = "#11111b"
```

## 4. Configuración Neovim

### 4.1 init.lua

```lua
-- ~/.config/nvim/init.lua
-- Configuración principal de Neovim estilo ThePrimeagen

-- Configurar leader key antes de cargar plugins
vim.g.mapleader = " "
vim.g.maplocalleader = " "

-- Cargar configuraciones
require("config.lazy")
require("config.options")
require("config.keymaps")

-- Configuración específica para el proyecto
vim.api.nvim_create_autocmd("FileType", {
  pattern = "astro",
  callback = function()
    vim.bo.commentstring = "<!-- %s -->"
  end,
})

-- Auto-formateo al guardar
vim.api.nvim_create_autocmd("BufWritePre", {
  pattern = "*",
  callback = function()
    vim.lsp.buf.format({ async = false })
  end,
})
```

### 4.2 lua/config/lazy.lua

```lua
-- ~/.config/nvim/lua/config/lazy.lua
-- Configuración del plugin manager lazy.nvim

local lazypath = vim.fn.stdpath("data") .. "/lazy/lazy.nvim"
if not vim.loop.fs_stat(lazypath) then
  vim.fn.system({
    "git",
    "clone",
    "--filter=blob:none",
    "https://github.com/folke/lazy.nvim.git",
    "--branch=stable",
    lazypath,
  })
end
vim.opt.rtp:prepend(lazypath)

require("lazy").setup({
  spec = {
    { import = "plugins" },
  },
  defaults = {
    lazy = false,
    version = false,
  },
  install = { colorscheme = { "tokyonight", "habamax" } },
  checker = { enabled = true },
  performance = {
    rtp = {
      disabled_plugins = {
        "gzip",
        "tarPlugin",
        "tohtml",
        "tutor",
        "zipPlugin",
      },
    },
  },
})
```

### 4.3 lua/config/options.lua

```lua
-- ~/.config/nvim/lua/config/options.lua
-- Configuración de opciones de Neovim

local opt = vim.opt

-- Configuración de UI
opt.number = true
opt.relativenumber = true
opt.signcolumn = "yes"
opt.cursorline = true
opt.termguicolors = true
opt.showmode = false
opt.laststatus = 3

-- Configuración de edición
opt.tabstop = 2
opt.shiftwidth = 2
opt.expandtab = true
opt.autoindent = true
opt.smartindent = true
opt.wrap = false

-- Configuración de búsqueda
opt.ignorecase = true
opt.smartcase = true
opt.hlsearch = false
opt.incsearch = true

-- Configuración de archivos
opt.backup = false
opt.writebackup = false
opt.swapfile = false
opt.undofile = true
opt.undodir = os.getenv("HOME") .. "/.vim/undodir"

-- Configuración de scroll
opt.scrolloff = 8
opt.sidescrolloff = 8

-- Configuración de split
opt.splitbelow = true
opt.splitright = true

-- Configuración de tiempo
opt.updatetime = 50
opt.timeoutlen = 300

-- Configuración de clipboard
opt.clipboard = "unnamedplus"

-- Configuración de mouse
opt.mouse = "a"

-- Configuración de completado
opt.completeopt = "menu,menuone,noselect"

-- Configuración de fold
opt.foldmethod = "expr"
opt.foldexpr = "nvim_treesitter#foldexpr()"
opt.foldenable = false
```

### 4.4 lua/config/keymaps.lua

```lua
-- ~/.config/nvim/lua/config/keymaps.lua
-- Configuración de keymaps estilo ThePrimeagen

local keymap = vim.keymap
local opts = { noremap = true, silent = true }

-- Navegación básica
keymap.set("n", "<C-d>", "<C-d>zz", opts)
keymap.set("n", "<C-u>", "<C-u>zz", opts)
keymap.set("n", "n", "nzzzv", opts)
keymap.set("n", "N", "Nzzzv", opts)

-- Movimiento de líneas
keymap.set("v", "J", ":m '>+1<CR>gv=gv", opts)
keymap.set("v", "K", ":m '<-2<CR>gv=gv", opts)

-- Mantener cursor en lugar al hacer J
keymap.set("n", "J", "mzJ`z", opts)

-- Mejor experiencia de paste
keymap.set("x", "<leader>p", '"_dP', opts)

-- Copiar al clipboard del sistema
keymap.set("n", "<leader>y", '"+y', opts)
keymap.set("v", "<leader>y", '"+y', opts)
keymap.set("n", "<leader>Y", '"+Y', opts)

-- Borrar sin copiar
keymap.set("n", "<leader>d", '"_d', opts)
keymap.set("v", "<leader>d", '"_d', opts)

-- Salir de insert mode
keymap.set("i", "<C-c>", "<Esc>", opts)

-- Deshabilitar Q
keymap.set("n", "Q", "<nop>", opts)

-- Navegación entre ventanas
keymap.set("n", "<C-h>", "<C-w>h", opts)
keymap.set("n", "<C-j>", "<C-w>j", opts)
keymap.set("n", "<C-k>", "<C-w>k", opts)
keymap.set("n", "<C-l>", "<C-w>l", opts)

-- Resize de ventanas
keymap.set("n", "<C-Up>", ":resize +2<CR>", opts)
keymap.set("n", "<C-Down>", ":resize -2<CR>", opts)
keymap.set("n", "<C-Left>", ":vertical resize -2<CR>", opts)
keymap.set("n", "<C-Right>", ":vertical resize +2<CR>", opts)

-- Navegación en modo insert
keymap.set("i", "<C-h>", "<Left>", opts)
keymap.set("i", "<C-j>", "<Down>", opts)
keymap.set("i", "<C-k>", "<Up>", opts)
keymap.set("i", "<C-l>", "<Right>", opts)

-- Mejor indentación
keymap.set("v", "<", "<gv", opts)
keymap.set("v", ">", ">gv", opts)

-- Navegación en quickfix
keymap.set("n", "<C-k>", "<cmd>cnext<CR>zz", opts)
keymap.set("n", "<C-j>", "<cmd>cprev<CR>zz", opts)
keymap.set("n", "<leader>k", "<cmd>lnext<CR>zz", opts)
keymap.set("n", "<leader>j", "<cmd>lprev<CR>zz", opts)

-- Reemplazar palabra bajo cursor
keymap.set("n", "<leader>s", [[:%s/\<<C-r><C-w>\>/<C-r><C-w>/gI<Left><Left><Left>]], opts)

-- Hacer archivo ejecutable
keymap.set("n", "<leader>x", "<cmd>!chmod +x %<CR>", { silent = true })

-- Source archivo actual
keymap.set("n", "<leader><leader>", function()
  vim.cmd("so")
end, opts)
```

## 5. Script de Instalación de Plugins

```bash
#!/bin/bash
# ~/.devcontainer/dotfiles/scripts/install-plugins.sh

set -e

echo "🔌 Instalando plugins de tmux y neovim..."

# Instalar TPM si no existe
if [ ! -d "$HOME/.tmux/plugins/tpm" ]; then
    echo "📺 Instalando Tmux Plugin Manager..."
    git clone https://github.com/tmux-plugins/tpm ~/.tmux/plugins/tpm
fi

# Instalar plugins de tmux
echo "📦 Instalando plugins de tmux..."
~/.tmux/plugins/tpm/scripts/install_plugins.sh

# Configurar Neovim
echo "⚡ Configurando Neovim..."

# Crear directorios necesarios
mkdir -p ~/.config/nvim/lua/{config,plugins}
mkdir -p ~/.local/share/nvim/lazy
mkdir -p ~/.vim/undodir

# Instalar lazy.nvim si no existe
if [ ! -d "$HOME/.local/share/nvim/lazy/lazy.nvim" ]; then
    echo "📦 Instalando lazy.nvim..."
    git clone --filter=blob:none --branch=stable \
        https://github.com/folke/lazy.nvim.git \
        ~/.local/share/nvim/lazy/lazy.nvim
fi

# Instalar plugins de Neovim
echo "🔌 Instalando plugins de Neovim..."
nvim --headless "+Lazy! sync" +qa 2>/dev/null || true

# Instalar LSP servers
echo "🔧 Instalando LSP servers..."
npm install -g \
    @astrojs/language-server \
    typescript-language-server \
    @tailwindcss/language-server \
    vscode-langservers-extracted

echo "✅ Plugins instalados correctamente!"
echo "💡 Reinicia tmux y neovim para aplicar los cambios"
```

## Uso de los Dotfiles

### Instalación Manual

```bash
# Clonar dotfiles
git clone <repo-dotfiles> ~/.dotfiles

# Crear symlinks
ln -sf ~/.dotfiles/.tmux.conf ~/.tmux.conf
ln -sf ~/.dotfiles/.zshrc ~/.zshrc
ln -sf ~/.dotfiles/.config/starship.toml ~/.config/starship.toml
ln -sf ~/.dotfiles/.config/nvim ~/.config/nvim

# Instalar plugins
~/.dotfiles/scripts/install-plugins.sh
```

### Comandos Útiles

```bash
# Tmux
tmux new-session -s dev    # Nueva sesión
Prefix + I                 # Instalar plugins
Prefix + U                 # Actualizar plugins

# Neovim
:Lazy                      # Gestionar plugins
:Mason                     # Gestionar LSP servers
:checkhealth               # Verificar configuración

# Desarrollo
work                       # Iniciar sesión de trabajo
dev                        # npm run dev
build                      # npm run build
```

## Características Principales

✅ **Tmux estilo ThePrimeagen** con navegación vim
✅ **Neovim configurado** con LSP, Treesitter, Telescope
✅ **Shell optimizado** con autocompletado y aliases
✅ **Prompt minimalista** con Starship
✅ **Integración perfecta** entre tmux y neovim
✅ **Configuración específica** para Astro/Tailwind
✅ **Scripts de automatización** para setup rápido

Esta configuración proporciona un entorno de desarrollo altamente productivo y consistente, optimizado específicamente para el desarrollo web moderno con Astro, Tailwind CSS y GSAP.