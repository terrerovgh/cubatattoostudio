-- ~/.config/nvim/lua/config/keymaps.lua
-- Configuración de keymaps estilo ThePrimeagen

local keymap = vim.keymap
local opts = { noremap = true, silent = true }

-- Navegación básica
keymap.set("n", "<C-d>", "<C-d>zz", opts)
keymap.set("n", "<C-u>", "<C-u>zz", opts)
keymap.set("n", "n", "nzzzv", opts)
keymap.set("n", "N", "Nzzzv", opts)

-- Movimiento de líneas
keymap.set("v", "J", ":m '>+1<CR>gv=gv", opts)
keymap.set("v", "K", ":m '<-2<CR>gv=gv", opts)

-- Mantener cursor en lugar al hacer J
keymap.set("n", "J", "mzJ`z", opts)

-- Mejor experiencia de paste
keymap.set("x", "<leader>p", '"_dP', opts)

-- Copiar al clipboard del sistema
keymap.set("n", "<leader>y", '"+y', opts)
keymap.set("v", "<leader>y", '"+y', opts)
keymap.set("n", "<leader>Y", '"+Y', opts)

-- Borrar sin copiar
keymap.set("n", "<leader>d", '"_d', opts)
keymap.set("v", "<leader>d", '"_d', opts)

-- Salir de insert mode
keymap.set("i", "<C-c>", "<Esc>", opts)

-- Deshabilitar Q
keymap.set("n", "Q", "<nop>", opts)

-- Navegación entre ventanas
keymap.set("n", "<C-h>", "<C-w>h", opts)
keymap.set("n", "<C-j>", "<C-w>j", opts)
keymap.set("n", "<C-k>", "<C-w>k", opts)
keymap.set("n", "<C-l>", "<C-w>l", opts)

-- Resize de ventanas
keymap.set("n", "<C-Up>", ":resize +2<CR>", opts)
keymap.set("n", "<C-Down>", ":resize -2<CR>", opts)
keymap.set("n", "<C-Left>", ":vertical resize -2<CR>", opts)
keymap.set("n", "<C-Right>", ":vertical resize +2<CR>", opts)

-- Navegación en modo insert
keymap.set("i", "<C-h>", "<Left>", opts)
keymap.set("i", "<C-j>", "<Down>", opts)
keymap.set("i", "<C-k>", "<Up>", opts)
keymap.set("i", "<C-l>", "<Right>", opts)

-- Mejor indentación
keymap.set("v", "<", "<gv", opts)
keymap.set("v", ">", ">gv", opts)

-- Navegación en quickfix
keymap.set("n", "<C-k>", "<cmd>cnext<CR>zz", opts)
keymap.set("n", "<C-j>", "<cmd>cprev<CR>zz", opts)
keymap.set("n", "<leader>k", "<cmd>lnext<CR>zz", opts)
keymap.set("n", "<leader>j", "<cmd>lprev<CR>zz", opts)

-- Reemplazar palabra bajo cursor
keymap.set("n", "<leader>s", [[:%s/\<<C-r><C-w>\>/<C-r><C-w>/gI<Left><Left><Left>]], opts)

-- Hacer archivo ejecutable
keymap.set("n", "<leader>x", "<cmd>!chmod +x %<CR>", { silent = true })

-- Source archivo actual
keymap.set("n", "<leader><leader>", function()
  vim.cmd("so")
end, opts)