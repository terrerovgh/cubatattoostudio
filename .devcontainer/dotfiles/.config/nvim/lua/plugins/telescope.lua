-- ~/.config/nvim/lua/plugins/telescope.lua
-- Fuzzy finder para archivos, texto, y más

return {
  'nvim-telescope/telescope.nvim',
  tag = '0.1.5',
  dependencies = {
    'nvim-lua/plenary.nvim',
    { 'nvim-telescope/telescope-fzf-native.nvim', build = 'make' },
    'nvim-tree/nvim-web-devicons',
  },
  config = function()
    local telescope = require('telescope')
    local actions = require('telescope.actions')
    local builtin = require('telescope.builtin')
    
    telescope.setup({
      defaults = {
        prompt_prefix = '🔍 ',
        selection_caret = '❯ ',
        path_display = { 'truncate' },
        file_ignore_patterns = {
          'node_modules',
          '.git/',
          'dist/',
          '.next/',
          '.nuxt/',
          '.output/',
          'coverage/',
          '.nyc_output/',
        },
        mappings = {
          i = {
            ['<C-k>'] = actions.move_selection_previous,
            ['<C-j>'] = actions.move_selection_next,
            ['<C-q>'] = actions.send_selected_to_qflist + actions.open_qflist,
            ['<C-x>'] = actions.delete_buffer,
          },
        },
        layout_config = {
          horizontal = {
            prompt_position = 'top',
            preview_width = 0.55,
            results_width = 0.8,
          },
          vertical = {
            mirror = false,
          },
          width = 0.87,
          height = 0.80,
          preview_cutoff = 120,
        },
      },
      pickers = {
        find_files = {
          theme = 'dropdown',
          previewer = false,
          hidden = true,
        },
        live_grep = {
          theme = 'ivy',
        },
        buffers = {
          theme = 'dropdown',
          previewer = false,
          initial_mode = 'normal',
        },
      },
      extensions = {
        fzf = {
          fuzzy = true,
          override_generic_sorter = true,
          override_file_sorter = true,
          case_mode = 'smart_case',
        },
      },
    })
    
    -- Cargar extensiones
    telescope.load_extension('fzf')
    
    -- Keymaps
    local keymap = vim.keymap
    keymap.set('n', '<leader>ff', builtin.find_files, { desc = 'Find files' })
    keymap.set('n', '<leader>fg', builtin.live_grep, { desc = 'Live grep' })
    keymap.set('n', '<leader>fb', builtin.buffers, { desc = 'Find buffers' })
    keymap.set('n', '<leader>fh', builtin.help_tags, { desc = 'Help tags' })
    keymap.set('n', '<leader>fr', builtin.oldfiles, { desc = 'Recent files' })
    keymap.set('n', '<leader>fc', builtin.grep_string, { desc = 'Find string under cursor' })
    keymap.set('n', '<leader>fk', builtin.keymaps, { desc = 'Find keymaps' })
    keymap.set('n', '<leader>fs', builtin.git_status, { desc = 'Git status' })
    keymap.set('n', '<leader>ft', builtin.git_commits, { desc = 'Git commits' })
    
    -- Búsqueda específica para el proyecto
    keymap.set('n', '<leader>fa', function()
      builtin.find_files({
        prompt_title = 'Find Astro Files',
        find_command = { 'fd', '--type', 'f', '--extension', 'astro' },
      })
    end, { desc = 'Find Astro files' })
    
    keymap.set('n', '<leader>fj', function()
      builtin.find_files({
        prompt_title = 'Find JS/TS Files',
        find_command = { 'fd', '--type', 'f', '--extension', 'js', '--extension', 'ts' },
      })
    end, { desc = 'Find JS/TS files' })
  end,
}