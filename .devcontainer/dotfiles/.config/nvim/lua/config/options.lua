-- ~/.config/nvim/lua/config/options.lua
-- Configuración de opciones de Neovim

local opt = vim.opt

-- Configuración de UI
opt.number = true
opt.relativenumber = true
opt.signcolumn = "yes"
opt.cursorline = true
opt.termguicolors = true
opt.showmode = false
opt.laststatus = 3

-- Configuración de edición
opt.tabstop = 2
opt.shiftwidth = 2
opt.expandtab = true
opt.autoindent = true
opt.smartindent = true
opt.wrap = false

-- Configuración de búsqueda
opt.ignorecase = true
opt.smartcase = true
opt.hlsearch = false
opt.incsearch = true

-- Configuración de archivos
opt.backup = false
opt.writebackup = false
opt.swapfile = false
opt.undofile = true
opt.undodir = os.getenv("HOME") .. "/.vim/undodir"

-- Configuración de scroll
opt.scrolloff = 8
opt.sidescrolloff = 8

-- Configuración de split
opt.splitbelow = true
opt.splitright = true

-- Configuración de tiempo
opt.updatetime = 50
opt.timeoutlen = 300

-- Configuración de clipboard
opt.clipboard = "unnamedplus"

-- Configuración de mouse
opt.mouse = "a"

-- Configuración de completado
opt.completeopt = "menu,menuone,noselect"

-- Configuración de fold
opt.foldmethod = "expr"
opt.foldexpr = "nvim_treesitter#foldexpr()"
opt.foldenable = false