#!/bin/bash
# scripts/setup-dotfiles.sh
# Script para configurar dotfiles en el sistema

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

# Directorio del proyecto
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DOTFILES_DIR="$PROJECT_DIR/.devcontainer/dotfiles"

# Función para hacer backup de archivos existentes
backup_file() {
    local file="$1"
    if [ -f "$file" ] || [ -L "$file" ]; then
        local backup="${file}.backup.$(date +%Y%m%d_%H%M%S)"
        log "Haciendo backup de $file -> $backup"
        mv "$file" "$backup"
    fi
}

# Función para crear symlink
create_symlink() {
    local source="$1"
    local target="$2"
    
    if [ ! -f "$source" ]; then
        log_error "Archivo fuente no encontrado: $source"
        return 1
    fi
    
    # Crear directorio padre si no existe
    local target_dir="$(dirname "$target")"
    mkdir -p "$target_dir"
    
    # Hacer backup del archivo existente
    backup_file "$target"
    
    # Crear symlink
    ln -sf "$source" "$target"
    log_success "Symlink creado: $target -> $source"
}

# Configurar tmux
setup_tmux() {
    log "Configurando tmux..."
    
    create_symlink "$DOTFILES_DIR/.tmux.conf" "$HOME/.tmux.conf"
    
    # Instalar plugins de tmux si TPM está instalado
    if [ -d "$HOME/.tmux/plugins/tpm" ]; then
        log "Instalando plugins de tmux..."
        "$HOME/.tmux/plugins/tpm/scripts/install_plugins.sh" || true
    fi
    
    log_success "Configuración de tmux completada"
}

# Configurar Zsh
setup_zsh() {
    log "Configurando Zsh..."
    
    create_symlink "$DOTFILES_DIR/.zshrc" "$HOME/.zshrc"
    
    log_success "Configuración de Zsh completada"
}

# Configurar Starship
setup_starship() {
    log "Configurando Starship..."
    
    mkdir -p "$HOME/.config"
    create_symlink "$DOTFILES_DIR/starship.toml" "$HOME/.config/starship.toml"
    
    log_success "Configuración de Starship completada"
}

# Configurar Neovim
setup_neovim() {
    log "Configurando Neovim..."
    
    # Hacer backup de la configuración existente
    if [ -d "$HOME/.config/nvim" ]; then
        local backup_dir="$HOME/.config/nvim.backup.$(date +%Y%m%d_%H%M%S)"
        log "Haciendo backup de ~/.config/nvim -> $backup_dir"
        mv "$HOME/.config/nvim" "$backup_dir"
    fi
    
    # Crear symlink para toda la configuración de Neovim
    ln -sf "$DOTFILES_DIR/.config/nvim" "$HOME/.config/nvim"
    log_success "Symlink creado: ~/.config/nvim -> $DOTFILES_DIR/.config/nvim"
    
    log_success "Configuración de Neovim completada"
}

# Configurar Git (configuración básica)
setup_git() {
    log "Configurando Git..."
    
    # Solo configurar si no están ya configurados
    if [ -z "$(git config --global user.name)" ]; then
        read -p "Ingresa tu nombre para Git: " git_name
        git config --global user.name "$git_name"
    fi
    
    if [ -z "$(git config --global user.email)" ]; then
        read -p "Ingresa tu email para Git: " git_email
        git config --global user.email "$git_email"
    fi
    
    # Configuraciones adicionales recomendadas
    git config --global init.defaultBranch main
    git config --global pull.rebase false
    git config --global core.autocrlf input
    git config --global core.editor nvim
    
    log_success "Configuración de Git completada"
}

# Configurar permisos de scripts
setup_permissions() {
    log "Configurando permisos de scripts..."
    
    chmod +x "$PROJECT_DIR/scripts/"*.sh
    
    log_success "Permisos configurados"
}

# Verificar instalación
verify_setup() {
    log "Verificando instalación..."
    
    local errors=0
    
    # Verificar symlinks
    local files=(
        "$HOME/.tmux.conf"
        "$HOME/.zshrc"
        "$HOME/.config/starship.toml"
        "$HOME/.config/nvim"
    )
    
    for file in "${files[@]}"; do
        if [ -L "$file" ]; then
            log_success "✓ $file (symlink)"
        elif [ -f "$file" ] || [ -d "$file" ]; then
            log_warning "⚠ $file (archivo regular, no symlink)"
        else
            log_error "✗ $file (no encontrado)"
            errors=$((errors + 1))
        fi
    done
    
    if [ $errors -eq 0 ]; then
        log_success "Verificación completada sin errores"
    else
        log_error "Verificación completada con $errors errores"
        return 1
    fi
}

# Función principal
main() {
    log "🔧 Configurando dotfiles..."
    
    # Verificar que el directorio de dotfiles existe
    if [ ! -d "$DOTFILES_DIR" ]; then
        log_error "Directorio de dotfiles no encontrado: $DOTFILES_DIR"
        log "Asegúrate de estar ejecutando este script desde el directorio del proyecto"
        exit 1
    fi
    
    setup_permissions
    setup_tmux
    setup_zsh
    setup_starship
    setup_neovim
    setup_git
    verify_setup
    
    log_success "✅ Configuración de dotfiles completada!"
    log "📝 Próximos pasos:"
    log "   1. Reinicia tu terminal o ejecuta: source ~/.zshrc"
    log "   2. Abre tmux y presiona prefix + I para instalar plugins"
    log "   3. Abre Neovim para que se instalen los plugins automáticamente"
    log "   4. Ejecuta: ./scripts/dev-setup.sh para configurar el proyecto"
}

# Ejecutar función principal
main "$@"