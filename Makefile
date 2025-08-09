# Makefile para Cuba Tattoo Studio
# Automatización del flujo de desarrollo

.PHONY: help install dev build preview check lint clean docker-build docker-dev docker-clean setup bootstrap dotfiles

# Variables
PROJECT_NAME := cubatattoostudio
DOCKER_IMAGE := $(PROJECT_NAME)-dev
DOCKER_CONTAINER := $(PROJECT_NAME)-container
NODE_VERSION := 20
PORT := 4321

# Colores para output
RED := \033[0;31m
GREEN := \033[0;32m
YELLOW := \033[1;33m
BLUE := \033[0;34m
NC := \033[0m # No Color

# Función para logging
define log
	@echo "$(BLUE)[$(shell date +'%H:%M:%S')]$(NC) $(1)"
endef

define log_success
	@echo "$(GREEN)[SUCCESS]$(NC) $(1)"
endef

define log_warning
	@echo "$(YELLOW)[WARNING]$(NC) $(1)"
endef

define log_error
	@echo "$(RED)[ERROR]$(NC) $(1)"
endef

# Ayuda por defecto
help: ## Mostrar esta ayuda
	@echo "$(BLUE)Cuba Tattoo Studio - Comandos disponibles:$(NC)"
	@echo ""
	@echo "$(YELLOW)🏗️  Setup y Bootstrap:$(NC)"
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  $(GREEN)%-15s$(NC) %s\n", $$1, $$2}' $(MAKEFILE_LIST) | grep -E "(bootstrap|setup|dotfiles)"
	@echo ""
	@echo "$(YELLOW)📦 Gestión de Dependencias:$(NC)"
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  $(GREEN)%-15s$(NC) %s\n", $$1, $$2}' $(MAKEFILE_LIST) | grep -E "(install|clean)"
	@echo ""
	@echo "$(YELLOW)🚀 Desarrollo:$(NC)"
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  $(GREEN)%-15s$(NC) %s\n", $$1, $$2}' $(MAKEFILE_LIST) | grep -E "(dev|build|preview|check|lint)"
	@echo ""
	@echo "$(YELLOW)🐳 Docker:$(NC)"
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  $(GREEN)%-15s$(NC) %s\n", $$1, $$2}' $(MAKEFILE_LIST) | grep -E "docker"
	@echo ""
	@echo "$(YELLOW)☁️  Cloudflare:$(NC)"
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  $(GREEN)%-15s$(NC) %s\n", $$1, $$2}' $(MAKEFILE_LIST) | grep -E "(deploy|pages)"
	@echo ""

# Setup y Bootstrap
bootstrap: ## Instalar dependencias del sistema y herramientas
	$(call log,"🚀 Ejecutando bootstrap del sistema...")
	@chmod +x scripts/bootstrap.sh
	@./scripts/bootstrap.sh
	$(call log_success,"Bootstrap completado")

dotfiles: ## Configurar dotfiles (tmux, zsh, neovim, starship)
	$(call log,"🔧 Configurando dotfiles...")
	@chmod +x scripts/setup-dotfiles.sh
	@./scripts/setup-dotfiles.sh
	$(call log_success,"Dotfiles configurados")

setup: ## Configurar entorno de desarrollo del proyecto
	$(call log,"⚙️ Configurando proyecto...")
	@chmod +x scripts/dev-setup.sh
	@./scripts/dev-setup.sh
	$(call log_success,"Proyecto configurado")

full-setup: bootstrap dotfiles setup ## Configuración completa (bootstrap + dotfiles + setup)
	$(call log_success,"🎉 Configuración completa terminada!")

# Gestión de Dependencias
install: ## Instalar dependencias del proyecto
	$(call log,"📦 Instalando dependencias...")
	@if command -v pnpm >/dev/null 2>&1; then \
		pnpm install; \
	else \
		npm install; \
	fi
	$(call log_success,"Dependencias instaladas")

clean: ## Limpiar node_modules y archivos de build
	$(call log,"🧹 Limpiando archivos...")
	@rm -rf node_modules
	@rm -rf dist
	@rm -rf .astro
	@if command -v pnpm >/dev/null 2>&1; then pnpm store prune; fi
	$(call log_success,"Limpieza completada")

reset: clean install ## Reinstalar dependencias desde cero
	$(call log_success,"Reset completado")

# Desarrollo
dev: ## Iniciar servidor de desarrollo
	$(call log,"🚀 Iniciando servidor de desarrollo en http://localhost:$(PORT)")
	@if command -v pnpm >/dev/null 2>&1; then \
		pnpm dev; \
	else \
		npm run dev; \
	fi

build: ## Construir para producción
	$(call log,"🏗️ Construyendo para producción...")
	@if command -v pnpm >/dev/null 2>&1; then \
		pnpm build; \
	else \
		npm run build; \
	fi
	$(call log_success,"Build completada")

preview: build ## Vista previa de la build de producción
	$(call log,"👀 Iniciando vista previa...")
	@if command -v pnpm >/dev/null 2>&1; then \
		pnpm preview; \
	else \
		npm run preview; \
	fi

check: ## Verificar tipos TypeScript
	$(call log,"🔍 Verificando tipos...")
	@if command -v pnpm >/dev/null 2>&1; then \
		pnpm check; \
	else \
		npm run check; \
	fi
	$(call log_success,"Verificación de tipos completada")

lint: ## Ejecutar linter
	$(call log,"📝 Ejecutando linter...")
	@if command -v pnpm >/dev/null 2>&1; then \
		pnpm lint; \
	else \
		npm run lint; \
	fi
	$(call log_success,"Linting completado")

test: check lint ## Ejecutar todas las verificaciones
	$(call log_success,"Todas las verificaciones completadas")

# Docker
docker-build: ## Construir imagen Docker para desarrollo
	$(call log,"🐳 Construyendo imagen Docker...")
	@docker build -f .devcontainer/Dockerfile -t $(DOCKER_IMAGE) .
	$(call log_success,"Imagen Docker construida: $(DOCKER_IMAGE)")

docker-dev: ## Ejecutar contenedor de desarrollo
	$(call log,"🐳 Iniciando contenedor de desarrollo...")
	@docker run -it --rm \
		--name $(DOCKER_CONTAINER) \
		-p $(PORT):$(PORT) \
		-p 3000:3000 \
		-v $(PWD):/workspace \
		-v /var/run/docker.sock:/var/run/docker.sock \
		-w /workspace \
		$(DOCKER_IMAGE) \
		zsh

docker-compose-up: ## Iniciar servicios con Docker Compose
	$(call log,"🐳 Iniciando servicios con Docker Compose...")
	@cd .devcontainer && docker-compose up -d
	$(call log_success,"Servicios iniciados")

docker-compose-down: ## Detener servicios de Docker Compose
	$(call log,"🐳 Deteniendo servicios...")
	@cd .devcontainer && docker-compose down
	$(call log_success,"Servicios detenidos")

docker-clean: ## Limpiar imágenes y contenedores Docker
	$(call log,"🧹 Limpiando Docker...")
	@docker system prune -f
	@docker image prune -f
	$(call log_success,"Limpieza de Docker completada")

# Cloudflare Pages
pages-dev: ## Desarrollo con Wrangler Pages
	$(call log,"☁️ Iniciando desarrollo con Wrangler...")
	@if command -v wrangler >/dev/null 2>&1; then \
		wrangler pages dev dist --port $(PORT); \
	else \
		$(call log_error,"Wrangler no está instalado. Ejecuta: npm install -g wrangler"); \
		exit 1; \
	fi

deploy: build ## Desplegar a Cloudflare Pages
	$(call log,"🚀 Desplegando a Cloudflare Pages...")
	@if command -v wrangler >/dev/null 2>&1; then \
		wrangler pages publish dist; \
	else \
		$(call log_error,"Wrangler no está instalado. Ejecuta: npm install -g wrangler"); \
		exit 1; \
	fi
	$(call log_success,"Despliegue completado")

# Utilidades
info: ## Mostrar información del proyecto
	$(call log,"📋 Información del proyecto:")
	@echo "  Nombre: $(PROJECT_NAME)"
	@echo "  Node.js: $(shell node --version 2>/dev/null || echo 'No instalado')"
	@echo "  pnpm: $(shell pnpm --version 2>/dev/null || echo 'No instalado')"
	@echo "  Wrangler: $(shell wrangler --version 2>/dev/null || echo 'No instalado')"
	@echo "  Docker: $(shell docker --version 2>/dev/null || echo 'No instalado')"
	@echo "  Puerto: $(PORT)"

status: ## Mostrar estado de servicios
	$(call log,"📊 Estado de servicios:")
	@echo "  Contenedores Docker:"
	@docker ps --filter "name=$(DOCKER_CONTAINER)" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" 2>/dev/null || echo "    Ninguno ejecutándose"
	@echo "  Procesos Node.js:"
	@pgrep -f "node.*$(PORT)" >/dev/null && echo "    Servidor ejecutándose en puerto $(PORT)" || echo "    Ningún servidor ejecutándose"

# Shortcuts comunes
s: setup ## Shortcut para setup
i: install ## Shortcut para install
d: dev ## Shortcut para dev
b: build ## Shortcut para build
c: check ## Shortcut para check
l: lint ## Shortcut para lint

# Meta
.DEFAULT_GOAL := help