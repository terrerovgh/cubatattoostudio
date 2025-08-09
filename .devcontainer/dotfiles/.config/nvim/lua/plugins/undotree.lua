-- ~/.config/nvim/lua/plugins/undotree.lua
-- Visualizador de historial de cambios

return {
  'mbbill/undotree',
  config = function()
    vim.keymap.set('n', '<leader>u', vim.cmd.UndotreeToggle, { desc = 'Toggle undotree' })
    
    -- Configuración
    vim.g.undotree_WindowLayout = 2
    vim.g.undotree_SplitWidth = 40
    vim.g.undotree_SetFocusWhenToggle = 1
    vim.g.undotree_ShortIndicators = 1
  end,
}