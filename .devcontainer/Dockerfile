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