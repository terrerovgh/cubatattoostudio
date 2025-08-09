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