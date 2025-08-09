-- ~/.config/nvim/lua/plugins/harpoon.lua
-- Navegación rápida entre archivos favoritos

return {
  'ThePrimeagen/harpoon',
  branch = 'harpoon2',
  dependencies = { 'nvim-lua/plenary.nvim' },
  config = function()
    local harpoon = require('harpoon')
    
    harpoon:setup({
      settings = {
        save_on_toggle = true,
        sync_on_ui_close = true,
        key = function()
          return vim.loop.cwd()
        end,
      },
    })
    
    -- Keymaps
    local keymap = vim.keymap
    
    keymap.set('n', '<leader>a', function() harpoon:list():append() end, { desc = 'Add file to harpoon' })
    keymap.set('n', '<C-e>', function() harpoon.ui:toggle_quick_menu(harpoon:list()) end, { desc = 'Toggle harpoon menu' })
    
    keymap.set('n', '<C-h>', function() harpoon:list():select(1) end, { desc = 'Harpoon file 1' })
    keymap.set('n', '<C-t>', function() harpoon:list():select(2) end, { desc = 'Harpoon file 2' })
    keymap.set('n', '<C-n>', function() harpoon:list():select(3) end, { desc = 'Harpoon file 3' })
    keymap.set('n', '<C-s>', function() harpoon:list():select(4) end, { desc = 'Harpoon file 4' })
    
    -- Toggle previous & next buffers stored within Harpoon list
    keymap.set('n', '<C-S-P>', function() harpoon:list():prev() end, { desc = 'Previous harpoon file' })
    keymap.set('n', '<C-S-N>', function() harpoon:list():next() end, { desc = 'Next harpoon file' })
  end,
}