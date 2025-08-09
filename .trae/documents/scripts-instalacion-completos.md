# Scripts de Instalación y Configuración Completos

## Estructura de Scripts

```
cubatattoostudio/
├── .devcontainer/
│   ├── devcontainer.json
│   ├── Dockerfile
│   ├── docker-compose.yml
│   ├── postCreateCommand.sh
│   └── setup-tools.sh
├── scripts/
│   ├── install-dependencies.sh
│   ├── setup-dotfiles.sh
│   ├── bootstrap.sh
│   └── dev-setup.sh
├── dotfiles/
│   ├── .tmux.conf
│   ├── .zshrc
│   ├── starship.toml
│   └── nvim/
│       ├── init.lua
│       └── lua/
└── Makefile
```

## 1. Script Principal de Bootstrap (bootstrap.sh)

```bash
#!/bin/bash
# scripts/bootstrap.sh
# Script principal para configurar el entorno de desarrollo

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para logging
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[WARNING] $1${NC}"
}

error() {
    echo -e "${RED}[ERROR] $1${NC}"
    exit 1
}

# Detectar sistema operativo
detect_os() {
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        if [[ -f /etc/debian_version ]]; then
            OS="debian"
        elif [[ -f /etc/redhat-release ]]; then
            OS="redhat"
        else
            OS="linux"
        fi
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        OS="macos"
    elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]]; then
        OS="windows"
    else
        error "Sistema operativo no soportado: $OSTYPE"
    fi
    
    log "Sistema detectado: $OS"
}

# Detectar arquitectura
detect_arch() {
    ARCH=$(uname -m)
    case $ARCH in
        x86_64)
            ARCH="amd64"
            ;;
        aarch64|arm64)
            ARCH="arm64"
            ;;
        armv7l)
            ARCH="arm"
            ;;
        *)
            error "Arquitectura no soportada: $ARCH"
            ;;
    esac
    
    log "Arquitectura detectada: $ARCH"
}

# Verificar si Docker está instalado
check_docker() {
    if ! command -v docker &> /dev/null; then
        error "Docker no está instalado. Por favor instala Docker primero."
    fi
    
    if ! docker info &> /dev/null; then
        error "Docker no está ejecutándose. Por favor inicia Docker."
    fi
    
    log "Docker está disponible"
}

# Verificar si Docker Compose está disponible
check_docker_compose() {
    if command -v docker-compose &> /dev/null; then
        DOCKER_COMPOSE="docker-compose"
    elif docker compose version &> /dev/null; then
        DOCKER_COMPOSE="docker compose"
    else
        error "Docker Compose no está disponible"
    fi
    
    log "Docker Compose disponible: $DOCKER_COMPOSE"
}

# Instalar dependencias del sistema
install_system_deps() {
    log "Instalando dependencias del sistema..."
    
    case $OS in
        "macos")
            if ! command -v brew &> /dev/null; then
                log "Instalando Homebrew..."
                /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
            fi
            
            brew update
            brew install git curl wget make
            ;;
        "debian")
            sudo apt-get update
            sudo apt-get install -y git curl wget make build-essential
            ;;
        "redhat")
            sudo yum update -y
            sudo yum install -y git curl wget make gcc gcc-c++
            ;;
        *)
            warn "Instalación automática de dependencias no disponible para $OS"
            ;;
    esac
}

# Configurar variables de entorno
setup_env() {
    log "Configurando variables de entorno..."
    
    # Crear archivo .env si no existe
    if [[ ! -f .env ]]; then
        cat > .env << EOF
# Configuración del entorno de desarrollo
NODE_ENV=development
PORT=4321
PREVIEW_PORT=3000

# Docker
DOCKER_BUILDKIT=1
COMPOSE_DOCKER_CLI_BUILD=1

# Configuración específica del proyecto
PROJECT_NAME=cubatattoostudio
DEV_USER=node
DEV_UID=1000
DEV_GID=1000

# Cloudflare (configurar después)
# CLOUDFLARE_API_TOKEN=
# CLOUDFLARE_ACCOUNT_ID=
EOF
        log "Archivo .env creado"
    else
        log "Archivo .env ya existe"
    fi
}

# Construir imagen Docker
build_docker_image() {
    log "Construyendo imagen Docker..."
    
    if [[ -f .devcontainer/docker-compose.yml ]]; then
        $DOCKER_COMPOSE -f .devcontainer/docker-compose.yml build --no-cache
    else
        docker build -t cubatattoostudio-dev .devcontainer/
    fi
    
    log "Imagen Docker construida exitosamente"
}

# Configurar dotfiles
setup_dotfiles() {
    log "Configurando dotfiles..."
    
    if [[ -f scripts/setup-dotfiles.sh ]]; then
        chmod +x scripts/setup-dotfiles.sh
        ./scripts/setup-dotfiles.sh
    else
        warn "Script setup-dotfiles.sh no encontrado"
    fi
}

# Instalar dependencias del proyecto
install_project_deps() {
    log "Instalando dependencias del proyecto..."
    
    if [[ -f package.json ]]; then
        if command -v pnpm &> /dev/null; then
            pnpm install
        elif command -v npm &> /dev/null; then
            npm install
        else
            warn "No se encontró pnpm ni npm. Las dependencias se instalarán en el contenedor."
        fi
    fi
}

# Verificar configuración
verify_setup() {
    log "Verificando configuración..."
    
    local errors=0
    
    # Verificar archivos esenciales
    local required_files=(
        ".devcontainer/devcontainer.json"
        ".devcontainer/Dockerfile"
        "package.json"
        "astro.config.mjs"
        "tailwind.config.js"
    )
    
    for file in "${required_files[@]}"; do
        if [[ ! -f "$file" ]]; then
            error "Archivo requerido no encontrado: $file"
            ((errors++))
        fi
    done
    
    # Verificar que Docker puede construir la imagen
    if ! docker build -t test-build .devcontainer/ &> /dev/null; then
        error "No se puede construir la imagen Docker"
        ((errors++))
    else
        docker rmi test-build &> /dev/null
    fi
    
    if [[ $errors -eq 0 ]]; then
        log "✅ Verificación completada exitosamente"
    else
        error "❌ Verificación falló con $errors errores"
    fi
}

# Mostrar instrucciones finales
show_instructions() {
    log "🎉 Configuración completada!"
    echo
    echo -e "${BLUE}Próximos pasos:${NC}"
    echo "1. Abrir VS Code en este directorio"
    echo "2. Instalar la extensión 'Dev Containers'"
    echo "3. Presionar Ctrl+Shift+P y seleccionar 'Dev Containers: Reopen in Container'"
    echo "4. Esperar a que el contenedor se construya y configure"
    echo
    echo -e "${BLUE}Comandos útiles:${NC}"
    echo "  make dev          # Iniciar servidor de desarrollo"
    echo "  make build        # Construir para producción"
    echo "  make preview      # Vista previa de build"
    echo "  make deploy       # Desplegar a Cloudflare Pages"
    echo "  make clean        # Limpiar contenedores y volúmenes"
    echo
    echo -e "${YELLOW}Nota: Configura las variables de Cloudflare en .env antes de desplegar${NC}"
}

# Función principal
main() {
    log "🚀 Iniciando configuración del entorno de desarrollo"
    log "Proyecto: Cuba Tattoo Studio"
    echo
    
    detect_os
    detect_arch
    check_docker
    check_docker_compose
    
    install_system_deps
    setup_env
    setup_dotfiles
    build_docker_image
    install_project_deps
    verify_setup
    
    show_instructions
}

# Ejecutar si es llamado directamente
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi
```

## 2. Script de Configuración de Dotfiles (setup-dotfiles.sh)

```bash
#!/bin/bash
# scripts/setup-dotfiles.sh
# Configurar dotfiles en el sistema host

set -e

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log() {
    echo -e "${GREEN}[DOTFILES] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[WARNING] $1${NC}"
}

# Directorio base
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
DOTFILES_DIR="$PROJECT_DIR/dotfiles"

# Crear backup de configuraciones existentes
backup_existing() {
    local file="$1"
    local backup_dir="$HOME/.config/backups/$(date +%Y%m%d_%H%M%S)"
    
    if [[ -f "$HOME/$file" ]] || [[ -d "$HOME/$file" ]]; then
        log "Creando backup de $file"
        mkdir -p "$backup_dir"
        cp -r "$HOME/$file" "$backup_dir/"
    fi
}

# Instalar tmux si no está presente
install_tmux() {
    if ! command -v tmux &> /dev/null; then
        log "Instalando tmux..."
        
        if [[ "$OSTYPE" == "darwin"* ]]; then
            brew install tmux
        elif [[ -f /etc/debian_version ]]; then
            sudo apt-get update && sudo apt-get install -y tmux
        elif [[ -f /etc/redhat-release ]]; then
            sudo yum install -y tmux
        else
            warn "Por favor instala tmux manualmente"
            return
        fi
    fi
    
    log "tmux está disponible"
}

# Configurar tmux
setup_tmux() {
    log "Configurando tmux..."
    
    backup_existing ".tmux.conf"
    
    # Copiar configuración
    cp "$DOTFILES_DIR/.tmux.conf" "$HOME/.tmux.conf"
    
    # Instalar TPM si no existe
    local tpm_dir="$HOME/.tmux/plugins/tpm"
    if [[ ! -d "$tpm_dir" ]]; then
        log "Instalando Tmux Plugin Manager..."
        git clone https://github.com/tmux-plugins/tpm "$tpm_dir"
    fi
    
    log "tmux configurado. Ejecuta 'tmux' y presiona Prefix + I para instalar plugins"
}

# Configurar Zsh
setup_zsh() {
    log "Configurando Zsh..."
    
    # Instalar Zsh si no está presente
    if ! command -v zsh &> /dev/null; then
        log "Instalando Zsh..."
        
        if [[ "$OSTYPE" == "darwin"* ]]; then
            brew install zsh
        elif [[ -f /etc/debian_version ]]; then
            sudo apt-get update && sudo apt-get install -y zsh
        elif [[ -f /etc/redhat-release ]]; then
            sudo yum install -y zsh
        fi
    fi
    
    # Instalar Oh My Zsh si no existe
    if [[ ! -d "$HOME/.oh-my-zsh" ]]; then
        log "Instalando Oh My Zsh..."
        sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" "" --unattended
    fi
    
    backup_existing ".zshrc"
    cp "$DOTFILES_DIR/.zshrc" "$HOME/.zshrc"
    
    # Cambiar shell por defecto a Zsh
    if [[ "$SHELL" != "$(which zsh)" ]]; then
        log "Cambiando shell por defecto a Zsh..."
        chsh -s "$(which zsh)"
    fi
}

# Configurar Starship
setup_starship() {
    log "Configurando Starship..."
    
    # Instalar Starship si no está presente
    if ! command -v starship &> /dev/null; then
        log "Instalando Starship..."
        curl -sS https://starship.rs/install.sh | sh -s -- -y
    fi
    
    # Crear directorio de configuración
    mkdir -p "$HOME/.config"
    
    backup_existing ".config/starship.toml"
    cp "$DOTFILES_DIR/starship.toml" "$HOME/.config/starship.toml"
}

# Configurar Neovim
setup_neovim() {
    log "Configurando Neovim..."
    
    # Instalar Neovim si no está presente
    if ! command -v nvim &> /dev/null; then
        log "Instalando Neovim..."
        
        if [[ "$OSTYPE" == "darwin"* ]]; then
            brew install neovim
        elif [[ -f /etc/debian_version ]]; then
            # Instalar desde snap para tener la versión más reciente
            if command -v snap &> /dev/null; then
                sudo snap install nvim --classic
            else
                sudo apt-get update && sudo apt-get install -y neovim
            fi
        elif [[ -f /etc/redhat-release ]]; then
            sudo yum install -y neovim
        fi
    fi
    
    # Verificar versión mínima
    local nvim_version
    nvim_version=$(nvim --version | head -n1 | grep -oE '[0-9]+\.[0-9]+' | head -n1)
    local required_version="0.8"
    
    if ! awk "BEGIN {exit !($nvim_version >= $required_version)}"; then
        warn "Neovim versión $nvim_version detectada. Se requiere >= $required_version"
        warn "Algunas funcionalidades pueden no funcionar correctamente"
    fi
    
    # Backup y configuración
    backup_existing ".config/nvim"
    
    mkdir -p "$HOME/.config"
    cp -r "$DOTFILES_DIR/nvim" "$HOME/.config/nvim"
    
    log "Neovim configurado. Los plugins se instalarán automáticamente al abrir nvim"
}

# Instalar herramientas adicionales
install_additional_tools() {
    log "Instalando herramientas adicionales..."
    
    local tools=("fzf" "ripgrep" "fd" "bat" "exa")
    
    for tool in "${tools[@]}"; do
        if ! command -v "$tool" &> /dev/null; then
            log "Instalando $tool..."
            
            if [[ "$OSTYPE" == "darwin"* ]]; then
                brew install "$tool"
            elif [[ -f /etc/debian_version ]]; then
                case "$tool" in
                    "fzf")
                        sudo apt-get install -y fzf
                        ;;
                    "ripgrep")
                        sudo apt-get install -y ripgrep
                        ;;
                    "fd")
                        sudo apt-get install -y fd-find
                        ;;
                    "bat")
                        sudo apt-get install -y bat
                        ;;
                    "exa")
                        sudo apt-get install -y exa
                        ;;
                esac
            fi
        fi
    done
}

# Función principal
main() {
    log "🔧 Configurando dotfiles..."
    
    if [[ ! -d "$DOTFILES_DIR" ]]; then
        warn "Directorio dotfiles no encontrado: $DOTFILES_DIR"
        exit 1
    fi
    
    install_tmux
    setup_tmux
    setup_zsh
    setup_starship
    setup_neovim
    install_additional_tools
    
    log "✅ Dotfiles configurados exitosamente"
    log "Reinicia tu terminal o ejecuta 'source ~/.zshrc' para aplicar cambios"
}

# Ejecutar si es llamado directamente
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi
```

## 3. Script de Desarrollo (dev-setup.sh)

```bash
#!/bin/bash
# scripts/dev-setup.sh
# Configuración específica para desarrollo

set -e

# Colores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

log() {
    echo -e "${GREEN}[DEV-SETUP] $1${NC}"
}

info() {
    echo -e "${BLUE}[INFO] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[WARNING] $1${NC}"
}

# Configurar Git hooks
setup_git_hooks() {
    log "Configurando Git hooks..."
    
    local hooks_dir=".git/hooks"
    mkdir -p "$hooks_dir"
    
    # Pre-commit hook
    cat > "$hooks_dir/pre-commit" << 'EOF'
#!/bin/bash
# Pre-commit hook para Cuba Tattoo Studio

set -e

echo "🔍 Ejecutando verificaciones pre-commit..."

# Verificar formato con Prettier
if command -v pnpm &> /dev/null; then
    echo "📝 Verificando formato..."
    pnpm run format:check || {
        echo "❌ Errores de formato encontrados. Ejecuta 'pnpm run format' para corregir."
        exit 1
    }
fi

# Verificar linting
if command -v pnpm &> /dev/null; then
    echo "🔍 Ejecutando linter..."
    pnpm run lint || {
        echo "❌ Errores de linting encontrados."
        exit 1
    }
fi

# Verificar TypeScript
if command -v pnpm &> /dev/null; then
    echo "🔧 Verificando TypeScript..."
    pnpm run type-check || {
        echo "❌ Errores de TypeScript encontrados."
        exit 1
    }
fi

echo "✅ Todas las verificaciones pasaron!"
EOF
    
    chmod +x "$hooks_dir/pre-commit"
    
    # Commit-msg hook
    cat > "$hooks_dir/commit-msg" << 'EOF'
#!/bin/bash
# Verificar formato de mensaje de commit

commit_regex='^(feat|fix|docs|style|refactor|test|chore)(\(.+\))?: .{1,50}'

if ! grep -qE "$commit_regex" "$1"; then
    echo "❌ Formato de commit inválido."
    echo "Usa: tipo(scope): descripción"
    echo "Tipos: feat, fix, docs, style, refactor, test, chore"
    echo "Ejemplo: feat(components): add hero animation"
    exit 1
fi
EOF
    
    chmod +x "$hooks_dir/commit-msg"
    
    log "Git hooks configurados"
}

# Configurar VS Code settings
setup_vscode_settings() {
    log "Configurando VS Code settings..."
    
    local vscode_dir=".vscode"
    mkdir -p "$vscode_dir"
    
    # Settings.json
    cat > "$vscode_dir/settings.json" << 'EOF'
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "files.associations": {
    "*.astro": "astro"
  },
  "emmet.includeLanguages": {
    "astro": "html"
  },
  "tailwindCSS.includeLanguages": {
    "astro": "html"
  },
  "tailwindCSS.experimental.classRegex": [
    ["class:list=\\{([^}]*)\\}", "[\"'`]([^\"'`]*).*?[\"'`]"]
  ],
  "typescript.preferences.includePackageJsonAutoImports": "on",
  "astro.typescript.allowArbitraryAttributes": true
}
EOF
    
    # Extensions.json
    cat > "$vscode_dir/extensions.json" << 'EOF'
{
  "recommendations": [
    "astro-build.astro-vscode",
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "ms-vscode.vscode-typescript-next",
    "ms-vscode-remote.remote-containers",
    "vscodevim.vim",
    "github.copilot",
    "ms-vscode.vscode-json"
  ]
}
EOF
    
    # Tasks.json
    cat > "$vscode_dir/tasks.json" << 'EOF'
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "dev",
      "type": "shell",
      "command": "pnpm",
      "args": ["run", "dev"],
      "group": "build",
      "presentation": {
        "echo": true,
        "reveal": "always",
        "focus": false,
        "panel": "shared",
        "showReuseMessage": true,
        "clear": false
      },
      "problemMatcher": []
    },
    {
      "label": "build",
      "type": "shell",
      "command": "pnpm",
      "args": ["run", "build"],
      "group": {
        "kind": "build",
        "isDefault": true
      },
      "presentation": {
        "echo": true,
        "reveal": "always",
        "focus": false,
        "panel": "shared",
        "showReuseMessage": true,
        "clear": false
      },
      "problemMatcher": []
    },
    {
      "label": "preview",
      "type": "shell",
      "command": "pnpm",
      "args": ["run", "preview"],
      "group": "build",
      "presentation": {
        "echo": true,
        "reveal": "always",
        "focus": false,
        "panel": "shared",
        "showReuseMessage": true,
        "clear": false
      },
      "problemMatcher": []
    }
  ]
}
EOF
    
    log "VS Code configurado"
}

# Configurar herramientas de desarrollo
setup_dev_tools() {
    log "Configurando herramientas de desarrollo..."
    
    # Prettier config
    if [[ ! -f ".prettierrc" ]]; then
        cat > ".prettierrc" << 'EOF'
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "plugins": ["prettier-plugin-astro"],
  "overrides": [
    {
      "files": "*.astro",
      "options": {
        "parser": "astro"
      }
    }
  ]
}
EOF
        log "Prettier configurado"
    fi
    
    # ESLint config
    if [[ ! -f ".eslintrc.js" ]]; then
        cat > ".eslintrc.js" << 'EOF'
module.exports = {
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
    'plugin:astro/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  rules: {
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/no-explicit-any': 'warn',
  },
  overrides: [
    {
      files: ['*.astro'],
      parser: 'astro-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser',
        extraFileExtensions: ['.astro'],
      },
    },
  ],
};
EOF
        log "ESLint configurado"
    fi
    
    # Gitignore
    if [[ ! -f ".gitignore" ]]; then
        cat > ".gitignore" << 'EOF'
# Dependencies
node_modules/
.pnpm-store/

# Build outputs
dist/
.output/
.vercel/
.netlify/
.astro/

# Environment variables
.env
.env.local
.env.production

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/
*.lcov

# nyc test coverage
.nyc_output

# Dependency directories
node_modules/
jspm_packages/

# TypeScript cache
*.tsbuildinfo

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Microbundle cache
.rpt2_cache/
.rts2_cache_cjs/
.rts2_cache_es/
.rts2_cache_umd/

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# parcel-bundler cache (https://parceljs.org/)
.cache
.parcel-cache

# Next.js build output
.next

# Nuxt.js build / generate output
.nuxt

# Gatsby files
.cache/
public

# Storybook build outputs
.out
.storybook-out

# Temporary folders
tmp/
temp/

# Editor directories and files
.vscode/
.idea
*.swp
*.swo
*~

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# Docker
.dockerignore

# Wrangler
.wrangler/
EOF
        log "Gitignore configurado"
    fi
}

# Configurar scripts de package.json
update_package_scripts() {
    log "Actualizando scripts de package.json..."
    
    if [[ -f "package.json" ]]; then
        # Usar jq si está disponible, sino usar sed
        if command -v jq &> /dev/null; then
            local temp_file
            temp_file=$(mktemp)
            
            jq '.scripts += {
              "format": "prettier --write .",
              "format:check": "prettier --check .",
              "lint": "eslint . --ext .js,.ts,.astro",
              "lint:fix": "eslint . --ext .js,.ts,.astro --fix",
              "type-check": "astro check"
            }' package.json > "$temp_file" && mv "$temp_file" package.json
            
            log "Scripts de package.json actualizados"
        else
            warn "jq no está disponible. Actualiza package.json manualmente con los scripts de formato y linting."
        fi
    fi
}

# Función principal
main() {
    log "🛠️  Configurando entorno de desarrollo..."
    
    setup_git_hooks
    setup_vscode_settings
    setup_dev_tools
    update_package_scripts
    
    log "✅ Entorno de desarrollo configurado"
    
    info "Próximos pasos:"
    info "1. Instala las extensiones recomendadas de VS Code"
    info "2. Ejecuta 'pnpm install' para instalar dependencias"
    info "3. Ejecuta 'pnpm run dev' para iniciar el servidor de desarrollo"
}

# Ejecutar si es llamado directamente
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi
```

## 4. Makefile Completo

```makefile
# Makefile para Cuba Tattoo Studio
# Automatización de tareas de desarrollo y despliegue

.PHONY: help init dev build preview deploy clean test lint format docker-build docker-run docker-clean setup-host

# Variables
PROJECT_NAME := cubatattoostudio
DOCKER_IMAGE := $(PROJECT_NAME)-dev
DOCKER_COMPOSE := docker-compose -f .devcontainer/docker-compose.yml
NODE_VERSION := 20

# Colores para output
GREEN := \033[0;32m
YELLOW := \033[1;33m
BLUE := \033[0;34m
RED := \033[0;31m
NC := \033[0m # No Color

# Función para logging
define log
	@echo -e "$(GREEN)[$(shell date +'%H:%M:%S')] $(1)$(NC)"
endef

define warn
	@echo -e "$(YELLOW)[WARNING] $(1)$(NC)"
endef

define error
	@echo -e "$(RED)[ERROR] $(1)$(NC)"
endef

## help: Mostrar ayuda
help:
	@echo -e "$(BLUE)Cuba Tattoo Studio - Comandos Disponibles$(NC)"
	@echo ""
	@echo -e "$(GREEN)Configuración Inicial:$(NC)"
	@echo "  make init          - Configurar entorno completo (primera vez)"
	@echo "  make setup-host    - Configurar dotfiles en sistema host"
	@echo ""
	@echo -e "$(GREEN)Desarrollo:$(NC)"
	@echo "  make dev           - Iniciar servidor de desarrollo"
	@echo "  make build         - Construir para producción"
	@echo "  make preview       - Vista previa del build"
	@echo "  make test          - Ejecutar tests"
	@echo "  make lint          - Ejecutar linter"
	@echo "  make format        - Formatear código"
	@echo ""
	@echo -e "$(GREEN)Docker:$(NC)"
	@echo "  make docker-build  - Construir imagen Docker"
	@echo "  make docker-run    - Ejecutar contenedor"
	@echo "  make docker-clean  - Limpiar contenedores y volúmenes"
	@echo ""
	@echo -e "$(GREEN)Despliegue:$(NC)"
	@echo "  make deploy        - Desplegar a Cloudflare Pages"
	@echo "  make deploy-preview - Desplegar preview"
	@echo ""
	@echo -e "$(GREEN)Utilidades:$(NC)"
	@echo "  make clean         - Limpiar archivos temporales"
	@echo "  make deps          - Instalar dependencias"
	@echo "  make update        - Actualizar dependencias"

## init: Configuración inicial completa
init:
	$(call log,"🚀 Iniciando configuración completa...")
	@chmod +x scripts/*.sh
	@./scripts/bootstrap.sh
	$(call log,"✅ Configuración inicial completada")

## setup-host: Configurar dotfiles en sistema host
setup-host:
	$(call log,"🔧 Configurando dotfiles en sistema host...")
	@chmod +x scripts/setup-dotfiles.sh
	@./scripts/setup-dotfiles.sh

## deps: Instalar dependencias
deps:
	$(call log,"📦 Instalando dependencias...")
	@if command -v pnpm >/dev/null 2>&1; then \
		pnpm install; \
	else \
		npm install; \
	fi

## dev: Iniciar servidor de desarrollo
dev: deps
	$(call log,"🚀 Iniciando servidor de desarrollo...")
	@if command -v pnpm >/dev/null 2>&1; then \
		pnpm run dev; \
	else \
		npm run dev; \
	fi

## build: Construir para producción
build: deps
	$(call log,"🏗️  Construyendo para producción...")
	@if command -v pnpm >/dev/null 2>&1; then \
		pnpm run build; \
	else \
		npm run build; \
	fi

## preview: Vista previa del build
preview: build
	$(call log,"👀 Iniciando vista previa...")
	@if command -v pnpm >/dev/null 2>&1; then \
		pnpm run preview; \
	else \
		npm run preview; \
	fi

## test: Ejecutar tests
test: deps
	$(call log,"🧪 Ejecutando tests...")
	@if command -v pnpm >/dev/null 2>&1; then \
		pnpm run test; \
	else \
		npm run test; \
	fi

## lint: Ejecutar linter
lint: deps
	$(call log,"🔍 Ejecutando linter...")
	@if command -v pnpm >/dev/null 2>&1; then \
		pnpm run lint; \
	else \
		npm run lint; \
	fi

## format: Formatear código
format: deps
	$(call log,"📝 Formateando código...")
	@if command -v pnpm >/dev/null 2>&1; then \
		pnpm run format; \
	else \
		npm run format; \
	fi

## docker-build: Construir imagen Docker
docker-build:
	$(call log,"🐳 Construyendo imagen Docker...")
	@$(DOCKER_COMPOSE) build --no-cache

## docker-run: Ejecutar contenedor
docker-run:
	$(call log,"🐳 Ejecutando contenedor...")
	@$(DOCKER_COMPOSE) up -d
	$(call log,"Contenedor ejecutándose en http://localhost:4321")

## docker-dev: Desarrollo con Docker
docker-dev: docker-build
	$(call log,"🐳 Iniciando desarrollo con Docker...")
	@$(DOCKER_COMPOSE) up

## docker-clean: Limpiar contenedores y volúmenes
docker-clean:
	$(call log,"🧹 Limpiando contenedores y volúmenes...")
	@$(DOCKER_COMPOSE) down -v --remove-orphans
	@docker system prune -f
	@docker volume prune -f

## deploy: Desplegar a Cloudflare Pages
deploy: build
	$(call log,"🚀 Desplegando a Cloudflare Pages...")
	@if [ -z "$$CLOUDFLARE_API_TOKEN" ]; then \
		$(call error,"CLOUDFLARE_API_TOKEN no está configurado"); \
		exit 1; \
	fi
	@if command -v wrangler >/dev/null 2>&1; then \
		wrangler pages deploy dist; \
	else \
		$(call error,"Wrangler CLI no está instalado"); \
		exit 1; \
	fi

## deploy-preview: Desplegar preview
deploy-preview: build
	$(call log,"🚀 Desplegando preview...")
	@if command -v wrangler >/dev/null 2>&1; then \
		wrangler pages deploy dist --compatibility-date=2023-05-18; \
	else \
		$(call error,"Wrangler CLI no está instalado"); \
		exit 1; \
	fi

## clean: Limpiar archivos temporales
clean:
	$(call log,"🧹 Limpiando archivos temporales...")
	@rm -rf dist/
	@rm -rf .astro/
	@rm -rf node_modules/.cache/
	@rm -rf .output/
	@find . -name "*.log" -type f -delete
	$(call log,"Limpieza completada")

## update: Actualizar dependencias
update:
	$(call log,"📦 Actualizando dependencias...")
	@if command -v pnpm >/dev/null 2>&1; then \
		pnpm update; \
	else \
		npm update; \
	fi

## check: Verificar configuración
check:
	$(call log,"🔍 Verificando configuración...")
	@echo "Node.js: $$(node --version 2>/dev/null || echo 'No instalado')"
	@echo "pnpm: $$(pnpm --version 2>/dev/null || echo 'No instalado')"
	@echo "Docker: $$(docker --version 2>/dev/null || echo 'No instalado')"
	@echo "Wrangler: $$(wrangler --version 2>/dev/null || echo 'No instalado')"
	@echo "Git: $$(git --version 2>/dev/null || echo 'No instalado')"

## install-wrangler: Instalar Wrangler CLI
install-wrangler:
	$(call log,"📦 Instalando Wrangler CLI...")
	@if command -v pnpm >/dev/null 2>&1; then \
		pnpm add -g wrangler; \
	else \
		npm install -g wrangler; \
	fi

# Verificar si estamos en un contenedor
define check_container
	@if [ -f /.dockerenv ]; then \
		echo "Ejecutándose en contenedor Docker"; \
	else \
		echo "Ejecutándose en sistema host"; \
	fi
endef

# Target por defecto
.DEFAULT_GOAL := help
```

## 5. GitHub Actions Workflow

```yaml
# .github/workflows/deploy.yml
name: Deploy to Cloudflare Pages

on:
  push:
    branches:
      - main
      - develop
  pull_request:
    branches:
      - main

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
          
      - name: Install pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8
          
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
        
      - name: Run linter
        run: pnpm run lint
        
      - name: Run type check
        run: pnpm run type-check
        
      - name: Build
        run: pnpm run build
        
      - name: Deploy to Cloudflare Pages
        if: github.ref == 'refs/heads/main'
        uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: cubatattoostudio
          directory: dist
          gitHubToken: ${{ secrets.GITHUB_TOKEN }}
          
      - name: Deploy Preview
        if: github.event_name == 'pull_request'
        uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: cubatattoostudio
          directory: dist
          gitHubToken: ${{ secrets.GITHUB_TOKEN }}
```

## Instrucciones de Uso

### Configuración Inicial

```bash
# 1. Clonar el repositorio
git clone https://github.com/terrerovgh/cubatattoostudio.git
cd cubatattoostudio

# 2. Ejecutar configuración inicial
make init

# 3. Abrir en VS Code con DevContainer
code .
# Ctrl+Shift+P -> "Dev Containers: Reopen in Container"
```

### Desarrollo Diario

```bash
# Iniciar desarrollo
make dev

# Construir para producción
make build

# Vista previa
make preview

# Linting y formato
make lint
make format
```

### Despliegue

```bash
# Configurar variables de entorno
export CLOUDFLARE_API_TOKEN="tu-token"
export CLOUDFLARE_ACCOUNT_ID="tu-account-id"

# Desplegar
make deploy
```

### Características Principales

✅ **Configuración automatizada** con un solo comando
✅ **Soporte multiplataforma** (ARM/AMD)
✅ **DevContainers** para consistencia
✅ **Dotfiles** estilo ThePrimeagen
✅ **Git hooks** automáticos
✅ **CI/CD** con GitHub Actions
✅ **Scripts de desarrollo** optimizados
✅ **Despliegue automático** a Cloudflare Pages

Este conjunto de scripts proporciona una configuración completa y automatizada para el desarrollo del proyecto Cuba Tattoo Studio, garantizando consistencia entre diferentes máquinas y desarrolladores.