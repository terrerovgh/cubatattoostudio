#!/bin/bash
# .devcontainer/post-create.sh
# Script que se ejecuta después de crear el DevContainer

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

# Configurar Git (si no está configurado)
setup_git() {
    log "Configurando Git..."
    
    # Configuración básica si no existe
    if [ -z "$(git config --global user.name 2>/dev/null)" ]; then
        git config --global user.name "Developer"
        log "Git user.name configurado como 'Developer'"
    fi
    
    if [ -z "$(git config --global user.email 2>/dev/null)" ]; then
        git config --global user.email "developer@cubatattoostudio.com"
        log "Git user.email configurado como 'developer@cubatattoostudio.com'"
    fi
    
    # Configuraciones adicionales
    git config --global init.defaultBranch main
    git config --global pull.rebase false
    git config --global core.autocrlf input
    git config --global core.editor nvim
    git config --global safe.directory /workspace
    
    log_success "Git configurado"
}

# Instalar dependencias del proyecto
install_dependencies() {
    log "Instalando dependencias del proyecto..."
    
    cd /workspace
    
    # Verificar que package.json existe
    if [ ! -f "package.json" ]; then
        log_error "package.json no encontrado"
        return 1
    fi
    
    # Instalar dependencias
    pnpm install
    
    log_success "Dependencias instaladas"
}

# Configurar Tmux plugins
setup_tmux_plugins() {
    log "Configurando plugins de Tmux..."
    
    # Instalar plugins de Tmux si TPM está disponible
    if [ -d "$HOME/.tmux/plugins/tpm" ]; then
        "$HOME/.tmux/plugins/tpm/scripts/install_plugins.sh" || true
        log_success "Plugins de Tmux instalados"
    else
        log_warning "TPM no encontrado, saltando instalación de plugins de Tmux"
    fi
}

# Configurar Neovim
setup_neovim() {
    log "Configurando Neovim..."
    
    # Crear directorio de datos de Neovim
    mkdir -p "$HOME/.local/share/nvim"
    mkdir -p "$HOME/.local/state/nvim"
    mkdir -p "$HOME/.cache/nvim"
    
    # Pre-instalar lazy.nvim para evitar demoras en el primer uso
    local lazypath="$HOME/.local/share/nvim/lazy/lazy.nvim"
    if [ ! -d "$lazypath" ]; then
        git clone --filter=blob:none https://github.com/folke/lazy.nvim.git --branch=stable "$lazypath"
        log_success "lazy.nvim instalado"
    fi
    
    log_success "Neovim configurado"
}

# Configurar shell por defecto
setup_shell() {
    log "Configurando shell por defecto..."
    
    # Cambiar shell por defecto a zsh si no lo es ya
    if [ "$SHELL" != "/bin/zsh" ] && [ "$SHELL" != "/usr/bin/zsh" ]; then
        if command -v zsh >/dev/null 2>&1; then
            chsh -s "$(which zsh)" || true
            log_success "Shell cambiado a zsh"
        fi
    else
        log "Shell ya es zsh"
    fi
}

# Configurar permisos de scripts
setup_permissions() {
    log "Configurando permisos de scripts..."
    
    cd /workspace
    
    # Hacer ejecutables todos los scripts
    find scripts -name "*.sh" -type f -exec chmod +x {} \; 2>/dev/null || true
    find .devcontainer -name "*.sh" -type f -exec chmod +x {} \; 2>/dev/null || true
    
    log_success "Permisos configurados"
}

# Crear archivos de configuración del proyecto si no existen
setup_project_files() {
    log "Configurando archivos del proyecto..."
    
    cd /workspace
    
    # Crear .env si no existe
    if [ ! -f ".env" ] && [ -f ".env.example" ]; then
        cp .env.example .env
        log_success ".env creado desde .env.example"
    fi
    
    # Crear wrangler.toml básico si no existe
    if [ ! -f "wrangler.toml" ]; then
        cat > wrangler.toml << EOF
name = "cubatattoostudio"
compatibility_date = "2024-01-01"

[env.production]
route = "https://cubatattoostudio.com/*"

[env.preview]
route = "https://preview.cubatattoostudio.com/*"
EOF
        log_success "wrangler.toml creado"
    fi
    
    log_success "Archivos del proyecto configurados"
}

# Verificar instalación
verify_setup() {
    log "Verificando configuración..."
    
    local errors=0
    
    # Verificar comandos esenciales
    local commands=("node" "pnpm" "git" "tmux" "nvim" "starship")
    for cmd in "${commands[@]}"; do
        if command -v "$cmd" >/dev/null 2>&1; then
            log_success "✓ $cmd disponible"
        else
            log_error "✗ $cmd no disponible"
            errors=$((errors + 1))
        fi
    done
    
    # Verificar archivos de configuración
    local configs=(
        "$HOME/.tmux.conf"
        "$HOME/.zshrc"
        "$HOME/.config/starship.toml"
        "$HOME/.config/nvim/init.lua"
    )
    
    for config in "${configs[@]}"; do
        if [ -f "$config" ] || [ -L "$config" ]; then
            log_success "✓ $config"
        else
            log_warning "⚠ $config no encontrado"
        fi
    done
    
    if [ $errors -eq 0 ]; then
        log_success "Verificación completada sin errores críticos"
    else
        log_warning "Verificación completada con $errors errores"
    fi
}

# Mostrar información útil
show_info() {
    log "📋 Información del DevContainer:"
    echo "  • Workspace: /workspace"
    echo "  • Usuario: $(whoami)"
    echo "  • Shell: $SHELL"
    echo "  • Node.js: $(node --version)"
    echo "  • pnpm: $(pnpm --version)"
    echo "  • Git: $(git --version | head -n1)"
    echo ""
    log "🚀 Comandos útiles:"
    echo "  • make help          - Ver todos los comandos disponibles"
    echo "  • make dev           - Iniciar servidor de desarrollo"
    echo "  • make build         - Construir para producción"
    echo "  • make check         - Verificar tipos TypeScript"
    echo "  • tmux               - Iniciar sesión de tmux"
    echo "  • nvim               - Abrir Neovim"
    echo ""
}

# Función principal
main() {
    log "🔧 Configurando DevContainer post-creación..."
    
    setup_git
    install_dependencies
    setup_tmux_plugins
    setup_neovim
    setup_shell
    setup_permissions
    setup_project_files
    verify_setup
    show_info
    
    log_success "✅ Configuración post-creación completada!"
    log "🎉 DevContainer listo para desarrollo"
}

# Ejecutar función principal
main "$@"