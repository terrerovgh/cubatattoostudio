-- ~/.config/nvim/lua/plugins/fugitive.lua
-- Integración con Git

return {
  'tpope/vim-fugitive',
  config = function()
    local keymap = vim.keymap
    
    keymap.set('n', '<leader>gs', vim.cmd.Git, { desc = 'Git status' })
    keymap.set('n', '<leader>gf', '<cmd>diffget //2<CR>', { desc = 'Get left diff' })
    keymap.set('n', '<leader>gj', '<cmd>diffget //3<CR>', { desc = 'Get right diff' })
  end,
}