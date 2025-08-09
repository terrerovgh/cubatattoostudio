# Configuración DevContainer - Cuba Tattoo Studio

## Archivos de Configuración DevContainer

### 1. .devcontainer/devcontainer.json

```json
{
  "name": "Cuba Tattoo Studio Dev Environment",
  "dockerComposeFile": "docker-compose.yml",
  "service": "dev",
  "workspaceFolder": "/workspace",
  "shutdownAction": "stopCompose",
  
  // Configuración VS Code
  "customizations": {
    "vscode": {
      "extensions": [
        // Astro y Web Development
        "astro-build.astro-vscode",
        "bradlc.vscode-tailwindcss",
        "ms-vscode.vscode-typescript-next",
        "esbenp.prettier-vscode",
        "dbaeumer.vscode-eslint",
        
        // Git y Colaboración
        "eamodio.gitlens",
        "github.vscode-pull-request-github",
        
        // Productividad
        "ms-vscode.vscode-json",
        "redhat.vscode-yaml",
        "ms-vscode-remote.remote-containers",
        
        // Neovim Integration (opcional)
        "asvetliakov.vscode-neovim"
      ],
      
      "settings": {
        "terminal.integrated.defaultProfile.linux": "zsh",
        "terminal.integrated.profiles.linux": {
          "zsh": {
            "path": "/bin/zsh",
            "args": ["-l"]
          }
        },
        
        // Formateo automático
        "editor.formatOnSave": true,
        "editor.defaultFormatter": "esbenp.prettier-vscode",
        "editor.codeActionsOnSave": {
          "source.fixAll.eslint": true
        },
        
        // Tailwind CSS
        "tailwindCSS.includeLanguages": {
          "astro": "html"
        },
        "tailwindCSS.experimental.classRegex": [
          ["class:list=\\{([^}]*)\\}", "[\"'`]([^\"'`]*).*?[\"'`]"]
        ],
        
        // Astro
        "astro.typescript.allowArbitraryAttributes": true,
        
        // Archivos
        "files.associations": {
          "*.astro": "astro"
        }
      }
    }
  },
  
  // Comandos post-creación
  "postCreateCommand": ".devcontainer/scripts/postCreateCommand.sh",
  "postStartCommand": "npm install",
  
  // Configuración de usuario
  "remoteUser": "node",
  "containerUser": "node",
  
  // Puertos a exponer
  "forwardPorts": [4321, 3000],
  "portsAttributes": {
    "4321": {
      "label": "Astro Dev Server",
      "onAutoForward": "notify"
    },
    "3000": {
      "label": "Preview Server",
      "onAutoForward": "silent"
    }
  },
  
  // Features adicionales
  "features": {
    "ghcr.io/devcontainers/features/git:1": {},
    "ghcr.io/devcontainers/features/github-cli:1": {},
    "ghcr.io/devcontainers/features/docker-in-docker:2": {}
  }
}
```

### 2. .devcontainer/Dockerfile

```dockerfile
# Multi-platform Node.js development environment
FROM --platform=$BUILDPLATFORM node:20-alpine AS base

# Argumentos de build para multi-arquitectura
ARG TARGETPLATFORM
ARG BUILDPLATFORM
ARG TARGETOS
ARG TARGETARCH

# Información de build
RUN echo "Building for $TARGETPLATFORM on $BUILDPLATFORM"

# Instalar dependencias del sistema
RUN apk add --no-cache \
    git \
    curl \
    wget \
    unzip \
    bash \
    zsh \
    tmux \
    neovim \
    ripgrep \
    fzf \
    fd \
    tree \
    htop \
    python3 \
    make \
    g++ \
    && rm -rf /var/cache/apk/*

# Crear usuario de desarrollo
RUN addgroup -g 1000 node \
    && adduser -u 1000 -G node -s /bin/zsh -D node

# Cambiar a usuario node
USER node
WORKDIR /home/node

# Instalar Oh My Zsh
RUN sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" "" --unattended

# Instalar Starship prompt
RUN curl -sS https://starship.rs/install.sh | sh -s -- --yes

# Instalar pnpm globalmente
RUN npm install -g pnpm wrangler

# Configurar directorio de trabajo
WORKDIR /workspace

# Copiar archivos de configuración
COPY --chown=node:node .devcontainer/dotfiles/ /home/node/

# Hacer ejecutables los scripts
RUN chmod +x /home/node/.local/bin/* 2>/dev/null || true

# Configurar Git (será sobrescrito por el usuario)
RUN git config --global init.defaultBranch main \
    && git config --global core.editor "nvim"

# Exponer puertos
EXPOSE 4321 3000

# Comando por defecto
CMD ["zsh"]
```

### 3. .devcontainer/docker-compose.yml

```yaml
version: '3.8'

services:
  dev:
    build:
      context: ..
      dockerfile: .devcontainer/Dockerfile
      platforms:
        - linux/amd64
        - linux/arm64
    
    volumes:
      # Código fuente
      - ..:/workspace:cached
      
      # Persistir node_modules para mejor performance
      - node_modules:/workspace/node_modules
      
      # Configuraciones de usuario
      - ~/.gitconfig:/home/node/.gitconfig:ro
      - ~/.ssh:/home/node/.ssh:ro
      
      # Cache de npm/pnpm
      - npm_cache:/home/node/.npm
      - pnpm_cache:/home/node/.local/share/pnpm
    
    ports:
      - "4321:4321"  # Astro dev server
      - "3000:3000"  # Preview server
    
    environment:
      - NODE_ENV=development
      - CHOKIDAR_USEPOLLING=true  # Para hot reload en algunos sistemas
    
    # Mantener el contenedor corriendo
    command: sleep infinity
    
    # Configuración de red
    networks:
      - dev_network

  # Servicio opcional para base de datos local (si se necesita)
  # postgres:
  #   image: postgres:15-alpine
  #   environment:
  #     POSTGRES_DB: cubatattoostudio
  #     POSTGRES_USER: dev
  #     POSTGRES_PASSWORD: dev
  #   volumes:
  #     - postgres_data:/var/lib/postgresql/data
  #   ports:
  #     - "5432:5432"
  #   networks:
  #     - dev_network

volumes:
  node_modules:
  npm_cache:
  pnpm_cache:
  # postgres_data:

networks:
  dev_network:
    driver: bridge
```

### 4. .devcontainer/scripts/postCreateCommand.sh

```bash
#!/bin/bash
set -e

echo "🚀 Configurando entorno de desarrollo..."

# Configurar tmux
echo "📺 Configurando tmux..."
if [ ! -d "$HOME/.tmux/plugins/tpm" ]; then
    git clone https://github.com/tmux-plugins/tpm ~/.tmux/plugins/tpm
fi

# Instalar plugins de tmux
~/.tmux/plugins/tpm/scripts/install_plugins.sh

# Configurar Neovim
echo "⚡ Configurando Neovim..."
if [ ! -d "$HOME/.local/share/nvim/lazy" ]; then
    # Instalar lazy.nvim
    git clone --filter=blob:none --branch=stable https://github.com/folke/lazy.nvim.git \
        ~/.local/share/nvim/lazy/lazy.nvim
fi

# Instalar plugins de Neovim (se ejecutará en el primer arranque)
nvim --headless "+Lazy! sync" +qa 2>/dev/null || true

# Configurar shell
echo "🐚 Configurando shell..."
# Cambiar shell por defecto a zsh si no está configurado
if [ "$SHELL" != "/bin/zsh" ]; then
    echo "Cambiando shell por defecto a zsh..."
    # En contenedor, solo configuramos la variable
    export SHELL=/bin/zsh
fi

# Instalar dependencias del proyecto
echo "📦 Instalando dependencias del proyecto..."
if [ -f "package.json" ]; then
    if command -v pnpm &> /dev/null; then
        pnpm install
    else
        npm install
    fi
fi

# Configurar Git hooks (si existen)
if [ -d ".githooks" ]; then
    git config core.hooksPath .githooks
    chmod +x .githooks/*
fi

echo "✅ Entorno configurado correctamente!"
echo "💡 Comandos útiles:"
echo "  - npm run dev     # Iniciar servidor de desarrollo"
echo "  - npm run build   # Build para producción"
echo "  - make deploy     # Desplegar a Cloudflare Pages"
echo "  - tmux            # Iniciar sesión tmux"
echo "  - nvim            # Abrir Neovim"
```

### 5. .devcontainer/scripts/setup-tools.sh

```bash
#!/bin/bash
# Script para instalar herramientas adicionales

set -e

echo "🔧 Instalando herramientas adicionales..."

# Instalar herramientas de Node.js
npm install -g \
    @astrojs/cli \
    wrangler \
    prettier \
    eslint \
    typescript

# Instalar herramientas de sistema (si no están)
command -v fzf >/dev/null 2>&1 || {
    echo "Instalando fzf..."
    git clone --depth 1 https://github.com/junegunn/fzf.git ~/.fzf
    ~/.fzf/install --all
}

# Configurar aliases útiles
cat >> ~/.zshrc << 'EOF'

# Aliases para el proyecto
alias dev='npm run dev'
alias build='npm run build'
alias preview='npm run preview'
alias deploy='make deploy'

# Aliases de desarrollo
alias ll='ls -la'
alias la='ls -A'
alias l='ls -CF'
alias ..='cd ..'
alias ...='cd ../..'

# Git aliases
alias gs='git status'
alias ga='git add'
alias gc='git commit'
alias gp='git push'
alias gl='git log --oneline'

# Tmux aliases
alias t='tmux'
alias ta='tmux attach'
alias tls='tmux list-sessions'

EOF

echo "✅ Herramientas instaladas correctamente"
```

## Uso del DevContainer

### Inicialización

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/terrerovgh/cubatattoostudio.git
   cd cubatattoostudio
   ```

2. **Abrir en VS Code:**
   ```bash
   code .
   ```

3. **Reabrir en contenedor:**
   - VS Code detectará la configuración DevContainer
   - Hacer clic en "Reopen in Container"
   - O usar Command Palette: `Dev Containers: Reopen in Container`

### Comandos de Desarrollo

```bash
# Dentro del contenedor
npm run dev      # Servidor de desarrollo
npm run build    # Build de producción
npm run preview  # Preview del build

# Tmux session
tmux new-session -d -s dev
tmux attach -t dev

# Neovim
nvim src/pages/index.astro
```

### Troubleshooting

**Problema: Puerto ocupado**
```bash
# Matar proceso en puerto 4321
lsof -ti:4321 | xargs kill -9
```

**Problema: Permisos de archivos**
```bash
# Cambiar propietario de archivos
sudo chown -R node:node /workspace
```

**Problema: Cache corrupto**
```bash
# Limpiar cache de npm
npm cache clean --force

# Rebuild del contenedor
Docker: Rebuild Container (Command Palette)
```

## Ventajas de esta Configuración

✅ **Consistencia total** entre desarrolladores
✅ **Setup automático** en menos de 5 minutos
✅ **Soporte multiplataforma** ARM/AMD
✅ **Integración VS Code** nativa
✅ **Herramientas preconfiguradas** (tmux, neovim, etc.)
✅ **Aislamiento completo** del sistema anfitrión
✅ **Performance optimizada** con volúmenes cached
✅ **Extensiones automáticas** para Astro/Tailwind

Esta configuración garantiza que cualquier desarrollador pueda contribuir al proyecto inmediatamente, sin importar su sistema operativo o configuración local.