import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import lagacy from '@vitejs/plugin-legacy'
const { resolve } = require('path')
import Components from 'unplugin-vue-components/vite'
import { VantResolver } from 'unplugin-vue-components/resolvers'
import postCssPxToRem from 'postcss-pxtorem'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), ['VITE', 'NODE_ENV'])

  return {
    plugins: [
      vue(),
      lagacy(),
      Components({
        dts: './src/typings/components.d.ts',
        resolvers: [VantResolver()],
      }),
    ],

    css: {
      // css预处理器
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
        },
      },

      postcss: {
        plugins: [
          require('autoprefixer'),
          postCssPxToRem({
            rootValue: ({ file }) => (file.indexOf('vant') !== -1 ? 37.5 : 75), // 1rem的大小
            propList: ['*'], // 需要转换的属性，这里选择全部都进行转换
          }),
        ],
      },
    },

    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'), // 设置 `@` 指向 `src` 目录
      },
    },

    build: {
      outDir: env.VITE_OUTPUT_DIR,
      sourcemap: false,
    },

    base: env.VITE_BASE_URL,

    server: {
      // 是否自动在浏览器打开
      open: false,
      // https: true,
      port: Number(env.VITE_PORT),
      // hmr: false,
      // hmr: {
      //     // host: env.VITE_HOST,
      //     port: Number(env.VITE_PORT)
      // }
      // base: env.VITE_BASE_URL
      // proxy: {
      //     '/api': env.VITE_API_DOMAIN //代理网址
      // }
    },
  }
})
