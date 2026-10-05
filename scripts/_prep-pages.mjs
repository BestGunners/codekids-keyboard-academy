import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')

function editFile(rel, pairs) {
  const file = join(root, rel)
  let text = readFileSync(file, 'utf8')
  pairs.forEach(([oldBlock, newBlock, label]) => {
    const variants = [
      [oldBlock, newBlock],
      [oldBlock.split('\n').join('\r\n'), newBlock.split('\n').join('\r\n')],
    ]
    for (const [from, to] of variants) {
      const index = text.indexOf(from)
      if (index < 0) continue
      if (text.indexOf(from, index + 1) >= 0) throw new Error(rel + '：锚点不唯一 ' + label)
      text = text.slice(0, index) + to + text.slice(index + from.length)
      return
    }
    throw new Error(rel + '：找不到锚点 ' + label)
  })
  writeFileSync(file, text)
  console.log('  ok  ' + rel)
}

// 1. 把字体搬到 src 下，让 Vite 按 base 生成正确路径
const from = join(root, 'public', 'fonts', 'zcool-kuaile.woff2')
const toDir = join(root, 'src', 'assets', 'fonts')
const to = join(toDir, 'zcool-kuaile.woff2')
if (!existsSync(to)) {
  mkdirSync(toDir, { recursive: true })
  copyFileSync(from, to)
  console.log('  ok  字体已复制到 src/assets/fonts/')
}

// 2. kid.css 改成相对路径（打包后会带上子路径前缀）
editFile('src/styles/kid.css', [
  [
    "  src: url('/fonts/zcool-kuaile.woff2') format('woff2');",
    "  src: url('../assets/fonts/zcool-kuaile.woff2') format('woff2');",
    '字体路径',
  ],
])

// 3. vite.config.ts 支持用环境变量切换子路径
editFile('vite.config.ts', [
  [
    'export default defineConfig({\n  plugins: [react()],',
    [
      'export default defineConfig({',
      '  // 默认在根路径运行；部署到 GitHub Pages 的子路径时用 PAGES_BASE 指定，',
      '  // 比如 PAGES_BASE=/codekids-keyboard-academy/',
      "  base: process.env.PAGES_BASE ?? '/',",
      '  plugins: [react()],',
    ].join('\n'),
    'base 配置',
  ],
])

// 4. package.json 加一条一键发布命令
{
  const file = join(root, 'package.json')
  const pkg = JSON.parse(readFileSync(file, 'utf8'))
  if (!pkg.scripts['deploy:pages']) {
    pkg.scripts['deploy:pages'] = 'node scripts/publish-gh-pages.mjs'
    writeFileSync(file, JSON.stringify(pkg, null, 2) + '\n')
    console.log('  ok  package.json 增加了 deploy:pages')
  }
}
