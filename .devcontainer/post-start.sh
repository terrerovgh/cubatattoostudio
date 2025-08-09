#!/bin/bash
# .devcontainer/post-start.sh
# Script que se ejecuta cada vez que se inicia el DevContainer

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

# Verificar y actualizar dependencias si es necesario
check_dependencies() {
    log "Verificando dependencias..."
    
    cd /workspace
    
    # Verificar si package.json ha cambiado
    if [ -f "package.json" ]; then
        # Verificar si node_modules está actualizado
        if [ ! -d "node_modules" ] || [ "package.json" -nt "node_modules" ]; then
            log "Actualizando dependencias..."
            pnpm install
            log_success "Dependencias actualizadas"
        else
            log "Dependencias están actualizadas"
        fi
    fi
}

# Limpiar archivos temporales
cleanup_temp_files() {
    log "Limpiando archivos temporales..."
    
    cd /workspace
    
    # Limpiar archivos de build antiguos si existen
    [ -d ".astro" ] && rm -rf .astro
    
    # Limpiar logs antiguos
    find . -name "*.log" -type f -mtime +7 -delete 2>/dev/null || true
    
    log_success "Archivos temporales limpiados"
}

# Verificar configuración de Git
check_git_config() {
    log "Verificando configuración de Git..."
    
    # Verificar que el directorio sea seguro
    git config --global --add safe.directory /workspace 2>/dev/null || true
    
    # Mostrar configuración actual
    local git_user=$(git config --global user.name 2>/dev/null || echo "No configurado")
    local git_email=$(git config --global user.email 2>/dev/null || echo "No configurado")
    
    log "Git configurado como: $git_user <$git_email>"
    
    if [ "$git_user" = "Developer" ] || [ "$git_email" = "developer@cubatattoostudio.com" ]; then
        log_warning "Usando configuración de Git por defecto. Considera personalizarla:"
        echo "  git config --global user.name 'Tu Nombre'"
        echo "  git config --global user.email 'tu@email.com'"
    fi
}

# Iniciar servicios en background si es necesario
start_background_services() {
    log "Verificando servicios en background..."
    
    # Aquí se pueden iniciar servicios como bases de datos, redis, etc.
    # Por ahora solo verificamos que no haya conflictos de puertos
    
    local ports=("4321" "3000")
    for port in "${ports[@]}"; do
        if lsof -i :$port >/dev/null 2>&1; then
            log_warning "Puerto $port ya está en uso"
        fi
    done
    
    log_success "Verificación de servicios completada"
}

# Mostrar estado del proyecto
show_project_status() {
    log "📊 Estado del proyecto:"
    
    cd /workspace
    
    # Información básica
    echo "  • Directorio: $(pwd)"
    echo "  • Branch: $(git branch --show-current 2>/dev/null || echo 'No es un repo git')"
    echo "  • Último commit: $(git log -1 --oneline 2>/dev/null || echo 'No hay commits')"
    
    # Estado de archivos
    local modified_files=$(git status --porcelain 2>/dev/null | wc -l | tr -d ' ')
    if [ "$modified_files" -gt 0 ]; then
        echo "  • Archivos modificados: $modified_files"
    else
        echo "  • Working directory limpio"
    fi
    
    # Información de dependencias
    if [ -f "package.json" ]; then
        local deps_count=$(jq '.dependencies | length' package.json 2>/dev/null || echo "?")
        local dev_deps_count=$(jq '.devDependencies | length' package.json 2>/dev/null || echo "?")
        echo "  • Dependencias: $deps_count production, $dev_deps_count development"
    fi
    
    echo ""
}

# Mostrar comandos útiles
show_quick_commands() {
    log "⚡ Comandos rápidos:"
    echo "  • make dev           - Iniciar desarrollo (http://localhost:4321)"
    echo "  • make build         - Construir para producción"
    echo "  • make check         - Verificar tipos TypeScript"
    echo "  • make lint          - Ejecutar linter"
    echo "  • make help          - Ver todos los comandos"
    echo ""
    echo "  • tmux new -s dev    - Nueva sesión de tmux"
    echo "  • tmux attach        - Conectar a sesión existente"
    echo ""
    echo "  • nvim .             - Abrir proyecto en Neovim"
    echo "  • code .             - Abrir proyecto en VS Code"
    echo ""
}

# Verificar actualizaciones disponibles
check_updates() {
    log "Verificando actualizaciones..."
    
    cd /workspace
    
    # Verificar actualizaciones de dependencias (sin instalar)
    if command -v pnpm >/dev/null 2>&1; then
        local outdated=$(pnpm outdated --format=json 2>/dev/null | jq '. | length' 2>/dev/null || echo "0")
        if [ "$outdated" -gt 0 ]; then
            log_warning "$outdated dependencias tienen actualizaciones disponibles"
            echo "  Ejecuta 'pnpm outdated' para ver detalles"
        else
            log "Todas las dependencias están actualizadas"
        fi
    fi
}

# Función principal
main() {
    log "🚀 Iniciando DevContainer..."
    
    check_dependencies
    cleanup_temp_files
    check_git_config
    start_background_services
    check_updates
    show_project_status
    show_quick_commands
    
    log_success "✅ DevContainer listo para trabajar!"
    log "💡 Tip: Usa 'make help' para ver todos los comandos disponibles"
}

# Ejecutar función principal solo si no estamos en modo silencioso
if [ "${DEVCONTAINER_POST_START_SILENT:-}" != "true" ]; then
    main "$@"
fi