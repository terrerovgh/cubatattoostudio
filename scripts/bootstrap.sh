#!/bin/bash
# scripts/bootstrap.sh
# Script de inicialización del entorno de desarrollo

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para logging
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Detectar sistema operativo
detect_os() {
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        if [ -f /etc/debian_version ]; then
            OS="debian"
        elif [ -f /etc/redhat-release ]; then
            OS="redhat"
        else
            OS="linux"
        fi
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        OS="macos"
    else
        OS="unknown"
    fi
    log "Sistema operativo detectado: $OS"
}

# Instalar dependencias del sistema
install_system_deps() {
    log "Instalando dependencias del sistema..."
    
    case $OS in
        "macos")
            # Verificar si Homebrew está instalado
            if ! command -v brew &> /dev/null; then
                log "Instalando Homebrew..."
                /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
            fi
            
            # Instalar dependencias con Homebrew
            brew update
            brew install git curl wget unzip tmux neovim ripgrep fzf fd tree htop starship
            brew install --cask docker
            ;;
        "debian")
            sudo apt-get update
            sudo apt-get install -y git curl wget unzip tmux neovim ripgrep fzf fd-find tree htop build-essential
            
            # Instalar Starship
            curl -sS https://starship.rs/install.sh | sh -s -- -y
            
            # Instalar Docker
            if ! command -v docker &> /dev/null; then
                curl -fsSL https://get.docker.com -o get-docker.sh
                sh get-docker.sh
                sudo usermod -aG docker $USER
                rm get-docker.sh
            fi
            ;;
        "redhat")
            sudo yum update -y
            sudo yum install -y git curl wget unzip tmux neovim ripgrep fzf fd-find tree htop
            
            # Instalar Starship
            curl -sS https://starship.rs/install.sh | sh -s -- -y
            ;;
        *)
            log_warning "Sistema operativo no soportado completamente. Instala manualmente: git, curl, wget, unzip, tmux, neovim, ripgrep, fzf, fd, tree, htop, starship"
            ;;
    esac
    
    log_success "Dependencias del sistema instaladas"
}

# Instalar Node.js y pnpm
install_node() {
    log "Instalando Node.js y pnpm..."
    
    # Instalar Node.js usando nvm si no está instalado
    if ! command -v node &> /dev/null; then
        if ! command -v nvm &> /dev/null; then
            log "Instalando nvm..."
            curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
            export NVM_DIR="$HOME/.nvm"
            [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
        fi
        
        nvm install --lts
        nvm use --lts
    fi
    
    # Instalar pnpm
    if ! command -v pnpm &> /dev/null; then
        npm install -g pnpm
    fi
    
    # Instalar Wrangler para Cloudflare Pages
    if ! command -v wrangler &> /dev/null; then
        npm install -g wrangler
    fi
    
    log_success "Node.js, pnpm y Wrangler instalados"
}

# Instalar Zsh y Oh My Zsh
install_zsh() {
    log "Configurando Zsh y Oh My Zsh..."
    
    # Instalar Zsh si no está instalado
    case $OS in
        "macos")
            if ! command -v zsh &> /dev/null; then
                brew install zsh
            fi
            ;;
        "debian")
            if ! command -v zsh &> /dev/null; then
                sudo apt-get install -y zsh
            fi
            ;;
        "redhat")
            if ! command -v zsh &> /dev/null; then
                sudo yum install -y zsh
            fi
            ;;
    esac
    
    # Instalar Oh My Zsh
    if [ ! -d "$HOME/.oh-my-zsh" ]; then
        sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" "" --unattended
    fi
    
    # Instalar plugins de Zsh
    ZSH_CUSTOM="$HOME/.oh-my-zsh/custom"
    
    if [ ! -d "$ZSH_CUSTOM/plugins/zsh-autosuggestions" ]; then
        git clone https://github.com/zsh-users/zsh-autosuggestions $ZSH_CUSTOM/plugins/zsh-autosuggestions
    fi
    
    if [ ! -d "$ZSH_CUSTOM/plugins/zsh-syntax-highlighting" ]; then
        git clone https://github.com/zsh-users/zsh-syntax-highlighting.git $ZSH_CUSTOM/plugins/zsh-syntax-highlighting
    fi
    
    if [ ! -d "$ZSH_CUSTOM/plugins/history-substring-search" ]; then
        git clone https://github.com/zsh-users/zsh-history-substring-search $ZSH_CUSTOM/plugins/history-substring-search
    fi
    
    log_success "Zsh y Oh My Zsh configurados"
}

# Instalar Tmux Plugin Manager
install_tmux_plugins() {
    log "Instalando Tmux Plugin Manager..."
    
    if [ ! -d "$HOME/.tmux/plugins/tpm" ]; then
        git clone https://github.com/tmux-plugins/tpm ~/.tmux/plugins/tpm
    fi
    
    log_success "Tmux Plugin Manager instalado"
}

# Función principal
main() {
    log "🚀 Iniciando bootstrap del entorno de desarrollo..."
    
    detect_os
    install_system_deps
    install_node
    install_zsh
    install_tmux_plugins
    
    log_success "✅ Bootstrap completado!"
    log "📝 Próximos pasos:"
    log "   1. Ejecuta: ./scripts/setup-dotfiles.sh"
    log "   2. Reinicia tu terminal o ejecuta: source ~/.zshrc"
    log "   3. En tmux, presiona prefix + I para instalar plugins"
    log "   4. Ejecuta: ./scripts/dev-setup.sh para configurar el proyecto"
}

# Ejecutar función principal
main "$@"