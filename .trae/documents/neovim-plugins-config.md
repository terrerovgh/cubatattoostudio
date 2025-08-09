# Configuración Plugins Neovim - Estilo ThePrimeagen

## Estructura de Plugins

```
~/.config/nvim/lua/plugins/
├── telescope.lua       # Fuzzy finder
├── treesitter.lua     # Syntax highlighting
├── lsp.lua            # Language Server Protocol
├── completion.lua     # Autocompletado
├── gitsigns.lua       # Git integration
├── lualine.lua        # Status line
├── harpoon.lua        # File navigation
├── colorscheme.lua    # Tema de colores
├── nvim-tree.lua      # File explorer
└── which-key.lua      # Key bindings helper
```

## 1. Telescope (telescope.lua)

```lua
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
```

## 2. Treesitter (treesitter.lua)

```lua
-- ~/.config/nvim/lua/plugins/treesitter.lua
-- Syntax highlighting avanzado

return {
  'nvim-treesitter/nvim-treesitter',
  build = ':TSUpdate',
  dependencies = {
    'nvim-treesitter/nvim-treesitter-textobjects',
    'nvim-treesitter/nvim-treesitter-context',
  },
  config = function()
    local configs = require('nvim-treesitter.configs')
    
    configs.setup({
      ensure_installed = {
        'astro',
        'javascript',
        'typescript',
        'tsx',
        'html',
        'css',
        'scss',
        'json',
        'yaml',
        'toml',
        'markdown',
        'markdown_inline',
        'lua',
        'vim',
        'vimdoc',
        'bash',
        'dockerfile',
        'gitignore',
        'gitcommit',
      },
      
      sync_install = false,
      auto_install = true,
      
      highlight = {
        enable = true,
        additional_vim_regex_highlighting = false,
      },
      
      indent = {
        enable = true,
      },
      
      incremental_selection = {
        enable = true,
        keymaps = {
          init_selection = '<C-space>',
          node_incremental = '<C-space>',
          scope_incremental = '<C-s>',
          node_decremental = '<C-backspace>',
        },
      },
      
      textobjects = {
        select = {
          enable = true,
          lookahead = true,
          keymaps = {
            ['af'] = '@function.outer',
            ['if'] = '@function.inner',
            ['ac'] = '@class.outer',
            ['ic'] = '@class.inner',
            ['aa'] = '@parameter.outer',
            ['ia'] = '@parameter.inner',
          },
        },
        move = {
          enable = true,
          set_jumps = true,
          goto_next_start = {
            [']m'] = '@function.outer',
            [']]'] = '@class.outer',
          },
          goto_next_end = {
            [']M'] = '@function.outer',
            [']['] = '@class.outer',
          },
          goto_previous_start = {
            ['[m'] = '@function.outer',
            ['[['] = '@class.outer',
          },
          goto_previous_end = {
            ['[M'] = '@function.outer',
            ['[]'] = '@class.outer',
          },
        },
      },
    })
    
    -- Configurar context
    require('treesitter-context').setup({
      enable = true,
      max_lines = 0,
      min_window_height = 0,
      line_numbers = true,
      multiline_threshold = 20,
      trim_scope = 'outer',
      mode = 'cursor',
    })
  end,
}
```

## 3. LSP Configuration (lsp.lua)

```lua
-- ~/.config/nvim/lua/plugins/lsp.lua
-- Language Server Protocol configuration

return {
  'neovim/nvim-lspconfig',
  dependencies = {
    'williamboman/mason.nvim',
    'williamboman/mason-lspconfig.nvim',
    'hrsh7th/cmp-nvim-lsp',
    'folke/neodev.nvim',
  },
  config = function()
    -- Configurar neodev para mejor experiencia con Lua
    require('neodev').setup()
    
    -- Configurar Mason
    require('mason').setup({
      ui = {
        border = 'rounded',
        icons = {
          package_installed = '✓',
          package_pending = '➜',
          package_uninstalled = '✗',
        },
      },
    })
    
    -- Servidores LSP a instalar
    local servers = {
      'astro',
      'tsserver',
      'tailwindcss',
      'html',
      'cssls',
      'jsonls',
      'yamlls',
      'lua_ls',
      'bashls',
      'dockerls',
    }
    
    require('mason-lspconfig').setup({
      ensure_installed = servers,
      automatic_installation = true,
    })
    
    -- Configuración de capacidades
    local capabilities = require('cmp_nvim_lsp').default_capabilities()
    
    -- Función para configurar keymaps cuando LSP se adjunta
    local on_attach = function(client, bufnr)
      local opts = { buffer = bufnr, silent = true }
      
      -- Navegación
      vim.keymap.set('n', 'gd', vim.lsp.buf.definition, opts)
      vim.keymap.set('n', 'gD', vim.lsp.buf.declaration, opts)
      vim.keymap.set('n', 'gi', vim.lsp.buf.implementation, opts)
      vim.keymap.set('n', 'gr', vim.lsp.buf.references, opts)
      vim.keymap.set('n', 'gt', vim.lsp.buf.type_definition, opts)
      
      -- Información
      vim.keymap.set('n', 'K', vim.lsp.buf.hover, opts)
      vim.keymap.set('n', '<C-k>', vim.lsp.buf.signature_help, opts)
      
      -- Acciones
      vim.keymap.set('n', '<leader>rn', vim.lsp.buf.rename, opts)
      vim.keymap.set({ 'n', 'v' }, '<leader>ca', vim.lsp.buf.code_action, opts)
      vim.keymap.set('n', '<leader>f', function()
        vim.lsp.buf.format({ async = true })
      end, opts)
      
      -- Diagnósticos
      vim.keymap.set('n', '[d', vim.diagnostic.goto_prev, opts)
      vim.keymap.set('n', ']d', vim.diagnostic.goto_next, opts)
      vim.keymap.set('n', '<leader>e', vim.diagnostic.open_float, opts)
      vim.keymap.set('n', '<leader>q', vim.diagnostic.setloclist, opts)
      
      -- Workspace
      vim.keymap.set('n', '<leader>wa', vim.lsp.buf.add_workspace_folder, opts)
      vim.keymap.set('n', '<leader>wr', vim.lsp.buf.remove_workspace_folder, opts)
      vim.keymap.set('n', '<leader>wl', function()
        print(vim.inspect(vim.lsp.buf.list_workspace_folders()))
      end, opts)
    end
    
    -- Configurar cada servidor
    local lspconfig = require('lspconfig')
    
    -- Astro
    lspconfig.astro.setup({
      capabilities = capabilities,
      on_attach = on_attach,
      init_options = {
        typescript = {
          tsdk = vim.fn.getcwd() .. '/node_modules/typescript/lib',
        },
      },
    })
    
    -- TypeScript
    lspconfig.tsserver.setup({
      capabilities = capabilities,
      on_attach = on_attach,
      settings = {
        typescript = {
          inlayHints = {
            includeInlayParameterNameHints = 'all',
            includeInlayParameterNameHintsWhenArgumentMatchesName = false,
            includeInlayFunctionParameterTypeHints = true,
            includeInlayVariableTypeHints = true,
            includeInlayPropertyDeclarationTypeHints = true,
            includeInlayFunctionLikeReturnTypeHints = true,
            includeInlayEnumMemberValueHints = true,
          },
        },
        javascript = {
          inlayHints = {
            includeInlayParameterNameHints = 'all',
            includeInlayParameterNameHintsWhenArgumentMatchesName = false,
            includeInlayFunctionParameterTypeHints = true,
            includeInlayVariableTypeHints = true,
            includeInlayPropertyDeclarationTypeHints = true,
            includeInlayFunctionLikeReturnTypeHints = true,
            includeInlayEnumMemberValueHints = true,
          },
        },
      },
    })
    
    -- Tailwind CSS
    lspconfig.tailwindcss.setup({
      capabilities = capabilities,
      on_attach = on_attach,
      settings = {
        tailwindCSS = {
          includeLanguages = {
            astro = 'html',
          },
          experimental = {
            classRegex = {
              { 'class:list=\\{([^}]*)\\}', '["\']([^"\']*).*?["\']' },
            },
          },
        },
      },
    })
    
    -- HTML
    lspconfig.html.setup({
      capabilities = capabilities,
      on_attach = on_attach,
    })
    
    -- CSS
    lspconfig.cssls.setup({
      capabilities = capabilities,
      on_attach = on_attach,
    })
    
    -- JSON
    lspconfig.jsonls.setup({
      capabilities = capabilities,
      on_attach = on_attach,
      settings = {
        json = {
          schemas = require('schemastore').json.schemas(),
          validate = { enable = true },
        },
      },
    })
    
    -- Lua
    lspconfig.lua_ls.setup({
      capabilities = capabilities,
      on_attach = on_attach,
      settings = {
        Lua = {
          runtime = {
            version = 'LuaJIT',
          },
          diagnostics = {
            globals = { 'vim' },
          },
          workspace = {
            library = vim.api.nvim_get_runtime_file('', true),
            checkThirdParty = false,
          },
          telemetry = {
            enable = false,
          },
        },
      },
    })
    
    -- Configurar diagnósticos
    vim.diagnostic.config({
      virtual_text = {
        prefix = '●',
      },
      signs = true,
      underline = true,
      update_in_insert = false,
      severity_sort = true,
      float = {
        border = 'rounded',
        source = 'always',
        header = '',
        prefix = '',
      },
    })
    
    -- Iconos de diagnósticos
    local signs = { Error = ' ', Warn = ' ', Hint = ' ', Info = ' ' }
    for type, icon in pairs(signs) do
      local hl = 'DiagnosticSign' .. type
      vim.fn.sign_define(hl, { text = icon, texthl = hl, numhl = hl })
    end
  end,
}
```

## 4. Autocompletado (completion.lua)

```lua
-- ~/.config/nvim/lua/plugins/completion.lua
-- Configuración de autocompletado

return {
  'hrsh7th/nvim-cmp',
  event = 'InsertEnter',
  dependencies = {
    'hrsh7th/cmp-buffer',
    'hrsh7th/cmp-path',
    'hrsh7th/cmp-nvim-lsp',
    'hrsh7th/cmp-nvim-lua',
    'saadparwaiz1/cmp_luasnip',
    {
      'L3MON4D3/LuaSnip',
      version = 'v2.*',
      build = 'make install_jsregexp',
      dependencies = {
        'rafamadriz/friendly-snippets',
      },
    },
  },
  config = function()
    local cmp = require('cmp')
    local luasnip = require('luasnip')
    
    -- Cargar snippets
    require('luasnip.loaders.from_vscode').lazy_load()
    
    -- Configurar LuaSnip
    luasnip.config.setup({
      history = true,
      updateevents = 'TextChanged,TextChangedI',
      enable_autosnippets = true,
    })
    
    cmp.setup({
      snippet = {
        expand = function(args)
          luasnip.lsp_expand(args.body)
        end,
      },
      
      mapping = cmp.mapping.preset.insert({
        ['<C-b>'] = cmp.mapping.scroll_docs(-4),
        ['<C-f>'] = cmp.mapping.scroll_docs(4),
        ['<C-Space>'] = cmp.mapping.complete(),
        ['<C-e>'] = cmp.mapping.abort(),
        ['<CR>'] = cmp.mapping.confirm({ select = true }),
        
        -- Navegación con Tab
        ['<Tab>'] = cmp.mapping(function(fallback)
          if cmp.visible() then
            cmp.select_next_item()
          elseif luasnip.expand_or_jumpable() then
            luasnip.expand_or_jump()
          else
            fallback()
          end
        end, { 'i', 's' }),
        
        ['<S-Tab>'] = cmp.mapping(function(fallback)
          if cmp.visible() then
            cmp.select_prev_item()
          elseif luasnip.jumpable(-1) then
            luasnip.jump(-1)
          else
            fallback()
          end
        end, { 'i', 's' }),
      }),
      
      sources = cmp.config.sources({
        { name = 'nvim_lsp' },
        { name = 'luasnip' },
        { name = 'nvim_lua' },
      }, {
        { name = 'buffer' },
        { name = 'path' },
      }),
      
      formatting = {
        format = function(entry, vim_item)
          -- Iconos para diferentes tipos
          local icons = {
            Text = '',
            Method = '',
            Function = '',
            Constructor = '',
            Field = '',
            Variable = '',
            Class = '',
            Interface = '',
            Module = '',
            Property = '',
            Unit = '',
            Value = '',
            Enum = '',
            Keyword = '',
            Snippet = '',
            Color = '',
            File = '',
            Reference = '',
            Folder = '',
            EnumMember = '',
            Constant = '',
            Struct = '',
            Event = '',
            Operator = '',
            TypeParameter = '',
          }
          
          vim_item.kind = string.format('%s %s', icons[vim_item.kind], vim_item.kind)
          vim_item.menu = ({
            nvim_lsp = '[LSP]',
            luasnip = '[Snippet]',
            buffer = '[Buffer]',
            path = '[Path]',
            nvim_lua = '[Lua]',
          })[entry.source.name]
          
          return vim_item
        end,
      },
      
      window = {
        completion = cmp.config.window.bordered(),
        documentation = cmp.config.window.bordered(),
      },
      
      experimental = {
        ghost_text = true,
      },
    })
    
    -- Configuración específica para tipos de archivo
    cmp.setup.filetype('gitcommit', {
      sources = cmp.config.sources({
        { name = 'buffer' },
      })
    })
    
    -- Snippets personalizados para Astro
    luasnip.add_snippets('astro', {
      luasnip.snippet('component', {
        luasnip.text_node('---'),
        luasnip.text_node({'', 'export interface Props {', '  '}),
        luasnip.insert_node(1, 'title: string;'),
        luasnip.text_node({'', '}', '', 'const { '}),
        luasnip.insert_node(2, 'title'),
        luasnip.text_node(' } = Astro.props;'),
        luasnip.text_node({'', '---', '', '<div>', '  <h1>{'}),
        luasnip.insert_node(3, 'title'),
        luasnip.text_node('}</h1>'),
        luasnip.text_node({'', '</div>'}),
      }),
    })
  end,
}
```

## 5. Git Integration (gitsigns.lua)

```lua
-- ~/.config/nvim/lua/plugins/gitsigns.lua
-- Integración con Git

return {
  'lewis6991/gitsigns.nvim',
  event = { 'BufReadPre', 'BufNewFile' },
  config = function()
    require('gitsigns').setup({
      signs = {
        add = { text = '│' },
        change = { text = '│' },
        delete = { text = '_' },
        topdelete = { text = '‾' },
        changedelete = { text = '~' },
        untracked = { text = '┆' },
      },
      
      signcolumn = true,
      numhl = false,
      linehl = false,
      word_diff = false,
      
      watch_gitdir = {
        follow_files = true
      },
      
      attach_to_untracked = true,
      current_line_blame = false,
      
      current_line_blame_opts = {
        virt_text = true,
        virt_text_pos = 'eol',
        delay = 1000,
        ignore_whitespace = false,
      },
      
      sign_priority = 6,
      update_debounce = 100,
      status_formatter = nil,
      max_file_length = 40000,
      
      preview_config = {
        border = 'single',
        style = 'minimal',
        relative = 'cursor',
        row = 0,
        col = 1
      },
      
      on_attach = function(bufnr)
        local gs = package.loaded.gitsigns
        
        local function map(mode, l, r, opts)
          opts = opts or {}
          opts.buffer = bufnr
          vim.keymap.set(mode, l, r, opts)
        end
        
        -- Navegación
        map('n', ']c', function()
          if vim.wo.diff then return ']c' end
          vim.schedule(function() gs.next_hunk() end)
          return '<Ignore>'
        end, { expr = true })
        
        map('n', '[c', function()
          if vim.wo.diff then return '[c' end
          vim.schedule(function() gs.prev_hunk() end)
          return '<Ignore>'
        end, { expr = true })
        
        -- Acciones
        map('n', '<leader>hs', gs.stage_hunk)
        map('n', '<leader>hr', gs.reset_hunk)
        map('v', '<leader>hs', function() gs.stage_hunk {vim.fn.line('.'), vim.fn.line('v')} end)
        map('v', '<leader>hr', function() gs.reset_hunk {vim.fn.line('.'), vim.fn.line('v')} end)
        map('n', '<leader>hS', gs.stage_buffer)
        map('n', '<leader>hu', gs.undo_stage_hunk)
        map('n', '<leader>hR', gs.reset_buffer)
        map('n', '<leader>hp', gs.preview_hunk)
        map('n', '<leader>hb', function() gs.blame_line{full=true} end)
        map('n', '<leader>tb', gs.toggle_current_line_blame)
        map('n', '<leader>hd', gs.diffthis)
        map('n', '<leader>hD', function() gs.diffthis('~') end)
        map('n', '<leader>td', gs.toggle_deleted)
        
        -- Text object
        map({'o', 'x'}, 'ih', ':<C-U>Gitsigns select_hunk<CR>')
      end
    })
  end,
}
```

## 6. Status Line (lualine.lua)

```lua
-- ~/.config/nvim/lua/plugins/lualine.lua
-- Status line minimalista

return {
  'nvim-lualine/lualine.nvim',
  dependencies = { 'nvim-tree/nvim-web-devicons' },
  config = function()
    local lualine = require('lualine')
    
    -- Función para mostrar LSP status
    local function lsp_status()
      local clients = vim.lsp.get_active_clients({ bufnr = 0 })
      if #clients == 0 then
        return ''
      end
      
      local names = {}
      for _, client in ipairs(clients) do
        table.insert(names, client.name)
      end
      return ' ' .. table.concat(names, ', ')
    end
    
    -- Función para mostrar diagnósticos
    local function diagnostics_status()
      local diagnostics = vim.diagnostic.get(0)
      local count = { errors = 0, warnings = 0, info = 0, hints = 0 }
      
      for _, diagnostic in ipairs(diagnostics) do
        if diagnostic.severity == vim.diagnostic.severity.ERROR then
          count.errors = count.errors + 1
        elseif diagnostic.severity == vim.diagnostic.severity.WARN then
          count.warnings = count.warnings + 1
        elseif diagnostic.severity == vim.diagnostic.severity.INFO then
          count.info = count.info + 1
        elseif diagnostic.severity == vim.diagnostic.severity.HINT then
          count.hints = count.hints + 1
        end
      end
      
      local parts = {}
      if count.errors > 0 then
        table.insert(parts, ' ' .. count.errors)
      end
      if count.warnings > 0 then
        table.insert(parts, ' ' .. count.warnings)
      end
      if count.info > 0 then
        table.insert(parts, ' ' .. count.info)
      end
      if count.hints > 0 then
        table.insert(parts, ' ' .. count.hints)
      end
      
      return table.concat(parts, ' ')
    end
    
    lualine.setup({
      options = {
        icons_enabled = true,
        theme = 'auto',
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
        }
      },
      
      sections = {
        lualine_a = { 'mode' },
        lualine_b = {
          'branch',
          {
            'diff',
            symbols = { added = ' ', modified = ' ', removed = ' ' },
          },
        },
        lualine_c = {
          {
            'filename',
            file_status = true,
            newfile_status = false,
            path = 1,
            symbols = {
              modified = '[+]',
              readonly = '[RO]',
              unnamed = '[No Name]',
              newfile = '[New]',
            }
          },
        },
        lualine_x = {
          diagnostics_status,
          lsp_status,
          'encoding',
          'fileformat',
          'filetype'
        },
        lualine_y = { 'progress' },
        lualine_z = { 'location' }
      },
      
      inactive_sections = {
        lualine_a = {},
        lualine_b = {},
        lualine_c = { 'filename' },
        lualine_x = { 'location' },
        lualine_y = {},
        lualine_z = {}
      },
      
      tabline = {},
      winbar = {},
      inactive_winbar = {},
      extensions = { 'nvim-tree', 'telescope', 'quickfix' }
    })
  end,
}
```

## 7. Harpoon (harpoon.lua)

```lua
-- ~/.config/nvim/lua/plugins/harpoon.lua
-- Navegación rápida entre archivos estilo ThePrimeagen

return {
  'ThePrimeagen/harpoon',
  branch = 'harpoon2',
  dependencies = { 'nvim-lua/plenary.nvim' },
  config = function()
    local harpoon = require('harpoon')
    
    harpoon:setup({
      settings = {
        save_on_toggle = false,
        sync_on_ui_close = true,
        key = function()
          return vim.loop.cwd()
        end,
      },
    })
    
    -- Keymaps básicos
    vim.keymap.set('n', '<leader>a', function() harpoon:list():append() end)
    vim.keymap.set('n', '<C-e>', function() harpoon.ui:toggle_quick_menu(harpoon:list()) end)
    
    -- Navegación rápida
    vim.keymap.set('n', '<C-h>', function() harpoon:list():select(1) end)
    vim.keymap.set('n', '<C-t>', function() harpoon:list():select(2) end)
    vim.keymap.set('n', '<C-n>', function() harpoon:list():select(3) end)
    vim.keymap.set('n', '<C-s>', function() harpoon:list():select(4) end)
    
    -- Toggle previous & next buffers stored within Harpoon list
    vim.keymap.set('n', '<C-S-P>', function() harpoon:list():prev() end)
    vim.keymap.set('n', '<C-S-N>', function() harpoon:list():next() end)
    
    -- Integración con Telescope
    vim.keymap.set('n', '<leader>fh', function()
      local conf = require('telescope.config').values
      local function toggle_telescope(harpoon_files)
        local file_paths = {}
        for _, item in ipairs(harpoon_files.items) do
          table.insert(file_paths, item.value)
        end
        
        require('telescope.pickers').new({}, {
          prompt_title = 'Harpoon',
          finder = require('telescope.finders').new_table({
            results = file_paths,
          }),
          previewer = conf.file_previewer({}),
          sorter = conf.generic_sorter({}),
        }):find()
      end
      
      toggle_telescope(harpoon:list())
    end, { desc = 'Open harpoon window' })
  end,
}
```

## 8. Tema de Colores (colorscheme.lua)

```lua
-- ~/.config/nvim/lua/plugins/colorscheme.lua
-- Configuración de tema de colores

return {
  'folke/tokyonight.nvim',
  lazy = false,
  priority = 1000,
  config = function()
    require('tokyonight').setup({
      style = 'night',
      light_style = 'day',
      transparent = true,
      terminal_colors = true,
      styles = {
        comments = { italic = true },
        keywords = { italic = true },
        functions = {},
        variables = {},
        sidebars = 'transparent',
        floats = 'transparent',
      },
      sidebars = { 'qf', 'help', 'nvim-tree' },
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
          fg = colors.fg_dark,
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
```

## Instalación y Uso

### Comandos Útiles

```bash
# Gestión de plugins
:Lazy                    # Abrir gestor de plugins
:Lazy sync              # Sincronizar plugins
:Lazy update            # Actualizar plugins
:Lazy clean             # Limpiar plugins no usados

# LSP
:Mason                  # Gestionar LSP servers
:LspInfo               # Información de LSP
:LspRestart            # Reiniciar LSP

# Telescope
<leader>ff             # Buscar archivos
<leader>fg             # Buscar en contenido
<leader>fb             # Buscar buffers
<leader>fa             # Buscar archivos .astro

# Harpoon
<leader>a              # Agregar archivo actual
<C-e>                  # Abrir menú de harpoon
<C-h/t/n/s>           # Navegar a archivos 1-4

# Git
]c / [c               # Siguiente/anterior hunk
<leader>hs            # Stage hunk
<leader>hr            # Reset hunk
<leader>hp            # Preview hunk
```

### Características Principales

✅ **Telescope** configurado para Astro/JS/TS
✅ **Treesitter** con soporte completo para el stack
✅ **LSP** optimizado para desarrollo web
✅ **Autocompletado** inteligente con snippets
✅ **Git integration** completa con Gitsigns
✅ **Harpoon** para navegación rápida
✅ **Tema consistente** con tmux
✅ **Performance optimizada** con lazy loading

Esta configuración proporciona una experiencia de desarrollo moderna y eficiente, específicamente optimizada para el desarrollo del proyecto Cuba Tattoo Studio con Astro, Tailwind CSS y GSAP.