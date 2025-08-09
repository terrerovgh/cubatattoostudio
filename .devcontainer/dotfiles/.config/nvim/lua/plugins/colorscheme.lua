-- ~/.config/nvim/lua/plugins/colorscheme.lua
-- Configuración de tema y colores

return {
  'folke/tokyonight.nvim',
  lazy = false,
  priority = 1000,
  config = function()
    require('tokyonight').setup({
      style = 'night',
      light_style = 'day',
      transparent = false,
      terminal_colors = true,
      styles = {
        comments = { italic = true },
        keywords = { italic = true },
        functions = {},
        variables = {},
        sidebars = 'dark',
        floats = 'dark',
      },
      sidebars = { 'qf', 'help' },
      day_brightness = 0.3,
      hide_inactive_statusline = false,
      dim_inactive = false,
      lualine_bold = false,
      
      on_colors = function(colors)
        colors.hint = colors.orange
        colors.error = '#ff0000'
      end,
      
      on_highlights = function(highlights, colors)
        highlights.TelescopeNormal = {
          bg = colors.bg_dark,
          fg = colors.fg_dark,
        }
        highlights.TelescopeBorder = {
          bg = colors.bg_dark,
          fg = colors.bg_dark,
        }
        highlights.TelescopePromptNormal = {
          bg = colors.bg_highlight,
        }
        highlights.TelescopePromptBorder = {
          bg = colors.bg_highlight,
          fg = colors.bg_highlight,
        }
        highlights.TelescopePromptTitle = {
          bg = colors.bg_highlight,
          fg = colors.fg,
        }
        highlights.TelescopePreviewTitle = {
          bg = colors.bg_dark,
          fg = colors.bg_dark,
        }
        highlights.TelescopeResultsTitle = {
          bg = colors.bg_dark,
          fg = colors.bg_dark,
        }
      end,
    })
    
    vim.cmd.colorscheme('tokyonight')
  end,
}