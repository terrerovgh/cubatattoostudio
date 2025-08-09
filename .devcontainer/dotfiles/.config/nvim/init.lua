-- ~/.config/nvim/init.lua
-- Configuración principal de Neovim estilo ThePrimeagen

-- Configurar leader key antes de cargar plugins
vim.g.mapleader = " "
vim.g.maplocalleader = " "

-- Cargar configuraciones
require("config.lazy")
require("config.options")
require("config.keymaps")

-- Configuración específica para el proyecto
vim.api.nvim_create_autocmd("FileType", {
  pattern = "astro",
  callback = function()
    vim.bo.commentstring = "<!-- %s -->"
  end,
})

-- Auto-formateo al guardar
vim.api.nvim_create_autocmd("BufWritePre", {
  pattern = "*",
  callback = function()
    vim.lsp.buf.format({ async = false })
  end,
})