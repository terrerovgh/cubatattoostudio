#!/bin/bash
# scripts/dev-setup.sh
# Script para configurar el entorno de desarrollo del proyecto

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

# Verificar dependencias
check_dependencies() {
    log "Verificando dependencias..."
    
    local deps=("node" "pnpm" "git")
    local missing_deps=()
    
    for dep in "${deps[@]}"; do
        if ! command -v "$dep" &> /dev/null; then
            missing_deps+=("$dep")
        fi
    done
    
    if [ ${#missing_deps[@]} -ne 0 ]; then
        log_error "Dependencias faltantes: ${missing_deps[*]}"
        log "Ejecuta primero: ./scripts/bootstrap.sh"
        exit 1
    fi
    
    log_success "Todas las dependencias están instaladas"
}

# Instalar dependencias del proyecto
install_project_deps() {
    log "Instalando dependencias del proyecto..."
    
    cd "$PROJECT_DIR"
    
    # Verificar si package.json existe
    if [ ! -f "package.json" ]; then
        log_error "package.json no encontrado en $PROJECT_DIR"
        exit 1
    fi
    
    # Instalar dependencias
    pnpm install
    
    log_success "Dependencias del proyecto instaladas"
}

# Configurar Wrangler para Cloudflare Pages
setup_wrangler() {
    log "Configurando Wrangler para Cloudflare Pages..."
    
    cd "$PROJECT_DIR"
    
    # Verificar si wrangler.toml existe
    if [ ! -f "wrangler.toml" ]; then
        log "Creando configuración básica de Wrangler..."
        cat > wrangler.toml << EOF
name = "cubatattoostudio"
compatibility_date = "2024-01-01"

[env.production]
route = "https://cubatattoostudio.com/*"

[env.preview]
route = "https://preview.cubatattoostudio.com/*"
EOF
        log_success "wrangler.toml creado"
    else
        log "wrangler.toml ya existe"
    fi
    
    # Verificar autenticación (opcional)
    if command -v wrangler &> /dev/null; then
        log "Para autenticarte con Cloudflare, ejecuta: wrangler auth login"
    fi
    
    log_success "Configuración de Wrangler completada"
}

# Configurar variables de entorno
setup_env() {
    log "Configurando variables de entorno..."
    
    cd "$PROJECT_DIR"
    
    # Crear .env.example si no existe
    if [ ! -f ".env.example" ]; then
        cat > .env.example << EOF
# Configuración de desarrollo
NODE_ENV=development

# Cloudflare Pages
CLOUDFLARE_ACCOUNT_ID=your_account_id
CLOUDFLARE_API_TOKEN=your_api_token

# URLs del proyecto
PUBLIC_SITE_URL=http://localhost:4321
PUBLIC_API_URL=http://localhost:4321/api
EOF
        log_success ".env.example creado"
    fi
    
    # Crear .env si no existe
    if [ ! -f ".env" ]; then
        cp .env.example .env
        log_success ".env creado desde .env.example"
        log_warning "Recuerda configurar las variables en .env con tus valores reales"
    else
        log ".env ya existe"
    fi
    
    log_success "Variables de entorno configuradas"
}

# Configurar Git hooks
setup_git_hooks() {
    log "Configurando Git hooks..."
    
    cd "$PROJECT_DIR"
    
    # Crear directorio de hooks si no existe
    mkdir -p .git/hooks
    
    # Pre-commit hook
    cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash
# Pre-commit hook para verificar código

set -e

echo "🔍 Ejecutando verificaciones pre-commit..."

# Verificar que pnpm esté disponible
if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm no está instalado"
    exit 1
fi

# Ejecutar linting
echo "📝 Ejecutando linter..."
pnpm run lint || {
    echo "❌ Errores de linting encontrados"
    exit 1
}

# Ejecutar verificación de tipos
echo "🔍 Verificando tipos..."
pnpm run check || {
    echo "❌ Errores de tipos encontrados"
    exit 1
}

echo "✅ Verificaciones pre-commit completadas"
EOF
    
    chmod +x .git/hooks/pre-commit
    
    log_success "Git hooks configurados"
}

# Crear estructura de directorios adicional
setup_project_structure() {
    log "Configurando estructura del proyecto..."
    
    cd "$PROJECT_DIR"
    
    # Crear directorios adicionales si no existen
    local dirs=(
        "src/components/ui"
        "src/layouts"
        "src/utils"
        "src/types"
        "src/assets/images"
        "src/assets/icons"
        "public/images"
        "docs"
    )
    
    for dir in "${dirs[@]}"; do
        if [ ! -d "$dir" ]; then
            mkdir -p "$dir"
            log "Directorio creado: $dir"
        fi
    done
    
    # Crear .gitkeep en directorios vacíos
    find src public -type d -empty -exec touch {}/.gitkeep \;
    
    log_success "Estructura del proyecto configurada"
}

# Verificar configuración
verify_setup() {
    log "Verificando configuración del proyecto..."
    
    cd "$PROJECT_DIR"
    
    local errors=0
    
    # Verificar archivos importantes
    local files=(
        "package.json"
        "astro.config.mjs"
        "tailwind.config.js"
        "tsconfig.json"
        ".env"
        "wrangler.toml"
    )
    
    for file in "${files[@]}"; do
        if [ -f "$file" ]; then
            log_success "✓ $file"
        else
            log_error "✗ $file (no encontrado)"
            errors=$((errors + 1))
        fi
    done
    
    # Verificar node_modules
    if [ -d "node_modules" ]; then
        log_success "✓ node_modules"
    else
        log_error "✗ node_modules (dependencias no instaladas)"
        errors=$((errors + 1))
    fi
    
    # Verificar scripts de package.json
    local scripts=("dev" "build" "preview" "check" "lint")
    for script in "${scripts[@]}"; do
        if pnpm run --silent "$script" --help &> /dev/null; then
            log_success "✓ Script: $script"
        else
            log_warning "⚠ Script: $script (no disponible o con errores)"
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
    log "⚙️ Configurando entorno de desarrollo del proyecto..."
    
    check_dependencies
    install_project_deps
    setup_wrangler
    setup_env
    setup_git_hooks
    setup_project_structure
    verify_setup
    
    log_success "✅ Configuración del proyecto completada!"
    log "🚀 Comandos disponibles:"
    log "   • pnpm dev          - Iniciar servidor de desarrollo"
    log "   • pnpm build        - Construir para producción"
    log "   • pnpm preview      - Vista previa de la build"
    log "   • pnpm check        - Verificar tipos TypeScript"
    log "   • pnpm lint         - Ejecutar linter"
    log "   • wrangler pages dev - Desarrollo con Wrangler"
    log "   • wrangler pages publish - Desplegar a Cloudflare Pages"
    log ""
    log "📝 Para empezar a desarrollar:"
    log "   1. pnpm dev"
    log "   2. Abre http://localhost:4321 en tu navegador"
}

# Ejecutar función principal
main "$@"