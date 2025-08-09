# Cuba Tattoo Studio - Entorno de Desarrollo Reproducible

🎨 **Sitio web del estudio de tatuajes Cuba Tattoo Studio** construido con Astro, Tailwind CSS y desplegado en Cloudflare Pages.

## 🚀 Características

- **Framework**: Astro con TypeScript
- **Estilos**: Tailwind CSS con configuración personalizada
- **Despliegue**: Cloudflare Pages con Wrangler
- **Entorno**: DevContainer con Docker para desarrollo reproducible
- **Herramientas**: Tmux, Neovim (estilo ThePrimeagen), Zsh con Oh My Zsh
- **Automatización**: Makefile para flujos de trabajo comunes

## 📋 Requisitos Previos

### Para DevContainer (Recomendado)
- Docker Desktop
- Visual Studio Code con extensión Dev Containers

### Para Desarrollo Local
- Node.js 20+
- pnpm
- Git

## 🛠️ Configuración del Entorno

### Opción 1: DevContainer (Recomendado)

1. **Clonar el repositorio**:
   ```bash
   git clone <repository-url>
   cd cubatattoostudio
   ```

2. **Abrir en DevContainer**:
   - Abrir VS Code
   - Comando: `Dev Containers: Reopen in Container`
   - El contenedor se construirá automáticamente con todas las herramientas

3. **¡Listo!** El entorno está completamente configurado.

### Opción 2: Configuración Local Automatizada

1. **Configuración completa**:
   ```bash
   make full-setup
   ```
   
   O paso a paso:
   ```bash
   make bootstrap    # Instalar dependencias del sistema
   make dotfiles     # Configurar dotfiles
   make setup        # Configurar proyecto
   ```

2. **Reiniciar terminal** o ejecutar:
   ```bash
   source ~/.zshrc
   ```

### Opción 3: Configuración Manual

1. **Instalar dependencias**:
   ```bash
   # macOS con Homebrew
   brew install node pnpm git tmux neovim ripgrep fzf fd tree htop starship
   
   # Ubuntu/Debian
   sudo apt-get install nodejs npm git tmux neovim ripgrep fzf fd-find tree htop
   npm install -g pnpm
   ```

2. **Configurar herramientas**:
   ```bash
   ./scripts/bootstrap.sh
   ./scripts/setup-dotfiles.sh
   ./scripts/dev-setup.sh
   ```

## 🎯 Comandos Principales

### Desarrollo
```bash
# Iniciar servidor de desarrollo
make dev          # o pnpm dev

# Construir para producción
make build        # o pnpm build

# Vista previa de producción
make preview      # o pnpm preview

# Verificar tipos TypeScript
make check        # o pnpm check

# Ejecutar linter
make lint         # o pnpm lint
```

### Gestión de Dependencias
```bash
# Instalar dependencias
make install      # o pnpm install

# Limpiar y reinstalar
make reset

# Limpiar archivos temporales
make clean
```

### Docker
```bash
# Construir imagen de desarrollo
make docker-build

# Ejecutar contenedor de desarrollo
make docker-dev

# Servicios con Docker Compose
make docker-compose-up
make docker-compose-down
```

### Cloudflare Pages
```bash
# Desarrollo con Wrangler
make pages-dev

# Desplegar a producción
make deploy

# Autenticarse con Cloudflare
wrangler auth login
```

### Utilidades
```bash
# Ver todos los comandos
make help

# Información del proyecto
make info

# Estado de servicios
make status
```

## 🔧 Herramientas de Desarrollo

### Tmux (Multiplexor de Terminal)
- **Prefix**: `Ctrl-a`
- **Navegación**: `Ctrl-a + hjkl`
- **Nuevas ventanas**: `Ctrl-a + c`
- **Dividir paneles**: `Ctrl-a + |` (vertical), `Ctrl-a + -` (horizontal)
- **Plugins**: TPM, tmux-resurrect, tmux-continuum

### Neovim (Editor)
- **Configuración**: Estilo ThePrimeagen
- **Plugin Manager**: lazy.nvim
- **Plugins principales**:
  - Telescope (fuzzy finder)
  - Treesitter (syntax highlighting)
  - LSP (Language Server Protocol)
  - Harpoon (navegación rápida)
  - Fugitive (Git integration)
- **Tema**: TokyoNight
- **Keymaps**:
  - `<leader>` = `Space`
  - `<leader>ff` = Find files
  - `<leader>fg` = Live grep
  - `<leader>a` = Add to harpoon
  - `<C-e>` = Toggle harpoon menu

### Zsh + Oh My Zsh
- **Plugins**: git, npm, node, docker, autosuggestions, syntax-highlighting
- **Prompt**: Starship con tema personalizado
- **Aliases útiles**:
  - `ll`, `la`, `l` = Listados de archivos
  - `g*` = Comandos de Git
  - `d*` = Comandos de Docker
  - `work` = Configurar sesión de trabajo

## 📁 Estructura del Proyecto

```
cubatattoostudio/
├── .devcontainer/          # Configuración DevContainer
│   ├── devcontainer.json   # Configuración principal
│   ├── Dockerfile          # Imagen de desarrollo
│   ├── docker-compose.yml  # Servicios adicionales
│   ├── dotfiles/           # Dotfiles (tmux, zsh, nvim, starship)
│   ├── post-create.sh      # Script post-creación
│   └── post-start.sh       # Script post-inicio
├── scripts/                # Scripts de automatización
│   ├── bootstrap.sh        # Instalación de dependencias
│   ├── setup-dotfiles.sh   # Configuración de dotfiles
│   └── dev-setup.sh        # Configuración del proyecto
├── src/                    # Código fuente Astro
│   ├── components/         # Componentes reutilizables
│   ├── layouts/            # Layouts de página
│   ├── pages/              # Páginas del sitio
│   └── styles/             # Estilos globales
├── public/                 # Archivos estáticos
├── Makefile               # Automatización de tareas
├── astro.config.mjs       # Configuración Astro
├── tailwind.config.js     # Configuración Tailwind
├── tsconfig.json          # Configuración TypeScript
├── wrangler.toml          # Configuración Cloudflare
└── package.json           # Dependencias y scripts
```

## 🎨 Configuración de Tailwind

El proyecto incluye una configuración personalizada de Tailwind:

- **Colores personalizados**: `cuba-black`, `cuba-white`, `cuba-gray`
- **Fuentes**: Bebas Neue, Inter
- **Animaciones**: fade-in, slide-up, stagger, bounce-pulse

## 🚀 Despliegue

### Cloudflare Pages (Automático)
1. Conectar repositorio a Cloudflare Pages
2. Configurar build command: `pnpm build`
3. Configurar output directory: `dist`
4. Los deploys se ejecutan automáticamente en cada push

### Manual con Wrangler
```bash
# Autenticarse
wrangler auth login

# Desplegar
make deploy
```

## 🔍 Solución de Problemas

### DevContainer no inicia
- Verificar que Docker Desktop esté ejecutándose
- Reconstruir contenedor: `Dev Containers: Rebuild Container`

### Dependencias no se instalan
```bash
# Limpiar caché y reinstalar
make clean
make install
```

### Problemas con Tmux
```bash
# Instalar plugins manualmente
prefix + I

# Recargar configuración
prefix + r
```

### Problemas con Neovim
```bash
# Limpiar datos de Neovim
rm -rf ~/.local/share/nvim
rm -rf ~/.local/state/nvim
rm -rf ~/.cache/nvim

# Reinstalar plugins
nvim --headless "+Lazy! sync" +qa
```

## 🤝 Contribución

1. Fork el repositorio
2. Crear rama feature: `git checkout -b feature/nueva-funcionalidad`
3. Commit cambios: `git commit -am 'Agregar nueva funcionalidad'`
4. Push a la rama: `git push origin feature/nueva-funcionalidad`
5. Crear Pull Request

## 📝 Notas de Desarrollo

- **Compatibilidad**: El entorno funciona en ARM64 y AMD64
- **Performance**: Optimizado para desarrollo rápido
- **Consistencia**: Mismo entorno en todos los dispositivos
- **Productividad**: Herramientas configuradas para máxima eficiencia

## 📄 Licencia

[Especificar licencia del proyecto]

---

**¿Necesitas ayuda?** Ejecuta `make help` para ver todos los comandos disponibles.