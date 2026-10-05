/**
 * 一键把网站发布到 GitHub Pages（gh-pages 分支）。
 *
 * 做的事：
 * 1. 用子路径 base 构建（默认 /codekids-keyboard-academy/）
 * 2. 给 dist 补上 404.html（前端路由回退）和 .nojekyll
 * 3. 用 git 直接把 dist 的内容推到 gh-pages 分支
 *
 * 用法：npm run deploy:pages
 * 换仓库名时：PAGES_REPO=用户名/仓库名 PAGES_BASE=/仓库名/ npm run deploy:pages
 */
import { execSync } from 'node:child_process'
import { copyFileSync, existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(root, 'dist')
const REPO = process.env.PAGES_REPO ?? 'BestGunners/codekids-keyboard-academy'
const BASE = process.env.PAGES_BASE ?? '/codekids-keyboard-academy/'
const BRANCH = 'gh-pages'
const work = join(tmpdir(), 'codekids-pages-' + Date.now())

function run(command, options = {}) {
  console.log('> ' + command)
  execSync(command, {
    cwd: options.cwd ?? root,
    stdio: 'inherit',
    env: {
      ...process.env,
      ComSpec: process.env.ComSpec ?? 'C:\\Windows\\System32\\cmd.exe',
      ...(options.env ?? {}),
    },
  })
}

console.log('1/3 构建（base = ' + BASE + '）')
run('npm.cmd run build', { env: { PAGES_BASE: BASE } })

if (!existsSync(join(dist, 'index.html'))) throw new Error('没有找到 dist/index.html，构建失败了？')

console.log('2/3 给静态文件补上 404 回退')
copyFileSync(join(dist, 'index.html'), join(dist, '404.html'))
writeFileSync(join(dist, '.nojekyll'), '')

console.log('3/3 推送到 ' + BRANCH + ' 分支')
mkdirSync(work, { recursive: true })
const gitEnv = { GIT_DIR: join(work, '.git'), GIT_WORK_TREE: dist }
run('git init -b ' + BRANCH, { cwd: work })
run('git add -A', { env: gitEnv })
run(
  'git -c user.name=codekids-bot -c user.email=codekids-bot@users.noreply.github.com commit -m "deploy: ' +
    new Date().toISOString() +
    '"',
  { env: gitEnv },
)
run('git push --force https://github.com/' + REPO + '.git HEAD:' + BRANCH, { env: gitEnv })

const [owner, repo] = REPO.split('/')
console.log('\n发布完成：https://' + owner.toLowerCase() + '.github.io/' + repo + '/')
