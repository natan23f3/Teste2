import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { compression } from 'vite-plugin-compression2';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const isProduction = mode === 'production';
  
  return {
    plugins: [
      react(),
      // Compressão de assets para produção
      isProduction && compression({
        algorithms: ['gzip'], // ou ['brotliCompress']
        exclude: [/\.(br)$/, /\.(gz)$/],
        threshold: 10240, // Tamanho mínimo para compressão (10KB)
      }),
    ],
    
    // Resolução de caminhos
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
    
    // Configuração do servidor de desenvolvimento
    server: {
      port: 5173,
      strictPort: true,
      proxy: {
        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true,
          secure: false,
        },
      },
    },
    
    // Configuração de build
    build: {
      // Diretório de saída
      outDir: 'dist',
      
      // Limpeza do diretório de saída antes do build
      emptyOutDir: true,
      
      // Divisão de código (code splitting)
      rollupOptions: {
        output: {
          // Divisão de chunks por tipo
          manualChunks: {
            // Vendor chunk para bibliotecas externas
            vendor: [
              'react', 
              'react-dom', 
              'react-router-dom',
              '@tanstack/react-query',
            ],
            // UI chunk para componentes de UI
            ui: [
              '@headlessui/react',
              'recharts',
            ],
          },
          // Nomeação de chunks
          chunkFileNames: isProduction 
            ? 'assets/js/[name]-[hash].js' 
            : 'assets/js/[name].js',
          // Nomeação de assets
          assetFileNames: (assetInfo) => {
            if (!assetInfo.name) return 'assets/[name]-[hash][extname]';
            
            const info = assetInfo.name.split('.');
            const ext = info[info.length - 1];
            
            if (/\.(png|jpe?g|gif|svg|webp|ico)$/.test(assetInfo.name)) {
              return `assets/images/[name]-[hash][extname]`;
            }
            
            if (/\.(woff2?|eot|ttf|otf)$/.test(assetInfo.name)) {
              return `assets/fonts/[name]-[hash][extname]`;
            }
            
            if (/\.css$/.test(assetInfo.name)) {
              return `assets/css/[name]-[hash][extname]`;
            }
            
            return `assets/[name]-[hash][extname]`;
          },
        },
      },
      
      // Minificação
      minify: isProduction ? 'terser' : false,
      terserOptions: {
        compress: {
          drop_console: isProduction,
          drop_debugger: isProduction,
        },
      },
      
      // Tamanho máximo para inlining de assets
      assetsInlineLimit: 4096, // 4KB
      
      // Habilitar source maps em desenvolvimento
      sourcemap: !isProduction,
      
      // Configurações de CSS
      cssCodeSplit: true,
      
      // Reportar tamanho dos chunks
      reportCompressedSize: true,
      chunkSizeWarningLimit: 1000, // em KB
    },
    
    // Otimização de dependências
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        '@tanstack/react-query',
      ],
    },
    
    // Configurações de preview
    preview: {
      port: 5173,
      strictPort: true,
    },
    
    // Configurações de cache
    cacheDir: '.vite',
  };
});