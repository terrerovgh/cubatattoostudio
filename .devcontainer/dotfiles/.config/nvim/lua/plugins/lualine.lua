-- ~/.config/nvim/lua/plugins/lualine.lua
-- Statusline moderna y configurable

return {
  'nvim-lualine/lualine.nvim',
  dependencies = { 'nvim-tree/nvim-web-devicons' },
  config = function()
    local lualine = require('lualine')
    
    -- Función para mostrar macro recording
    local function show_macro_recording()
      local recording_register = vim.fn.reg_recording()
      if recording_register == '' then
        return ''
      else
        return 'Recording @' .. recording_register
      end
    end
    
    -- Función para mostrar LSP status
    local function lsp_status()
      local clients = vim.lsp.get_active_clients({ bufnr = 0 })
      if #clients == 0 then
        return 'No LSP'
      end
      
      local names = {}
      for _, client in ipairs(clients) do
        table.insert(names, client.name)
      end
      return table.concat(names, ', ')
    end
    
    lualine.setup({
      options = {
        icons_enabled = true,
        theme = 'tokyonight',
        component_separators = { left = '', right = '' },
        section_separators = { left = '', right = '' },
        disabled_filetypes = {
          statusline = {},
          winbar = {},
        },
        ignore_focus = {},
        always_divide_middle = true,
        globalstatus = true,
        refresh = {
          statusline = 1000,
          tabline = 1000,
          winbar = 1000,
        },
      },
      sections = {
        lualine_a = { 'mode' },
        lualine_b = {
          'branch',
          'diff',
          {
            'diagnostics',
            sources = { 'nvim_diagnostic' },
            symbols = { error = ' ', warn = ' ', info = ' ' },
          },
        },
        lualine_c = {
          {
            'filename',
            file_status = true,
            newfile_status = false,
            path = 1,
            shorting_target = 40,
            symbols = {
              modified = '[+]',
              readonly = '[-]',
              unnamed = '[No Name]',
              newfile = '[New]',
            },
          },
          {
            show_macro_recording,
            color = { fg = '#ff9e64' },
          },
        },
        lualine_x = {
          {
            lsp_status,
            icon = ' LSP:',
            color = { fg = '#7aa2f7' },
          },
          'encoding',
          'fileformat',
          'filetype',
        },
        lualine_y = { 'progress' },
        lualine_z = { 'location' },
      },
      inactive_sections = {
        lualine_a = {},
        lualine_b = {},
        lualine_c = { 'filename' },
        lualine_x = { 'location' },
        lualine_y = {},
        lualine_z = {},
      },
      tabline = {},
      winbar = {},
      inactive_winbar = {},
      extensions = { 'fugitive', 'nvim-tree', 'quickfix' },
    })
    
    -- Actualizar lualine cuando se grabe una macro
    vim.api.nvim_create_autocmd('RecordingEnter', {
      callback = function()
        lualine.refresh()
      end,
    })
    
    vim.api.nvim_create_autocmd('RecordingLeave', {
      callback = function()
        local timer = vim.loop.new_timer()
        timer:start(
          50,
          0,
          vim.schedule_wrap(function()
            lualine.refresh()
          end)
        )
      end,
    })
  end,
}