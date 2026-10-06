/**
 * 通过 GitHub API 把 dist 发布到 gh-pages 分支（带重试，适配国内网络）。
 *
 * 为什么不用 git push：国内网络下 github.com 的 HTTPS 经常被重置
 * （Connection was reset / errno 10054），而 api.github.com 通常还能用。
 *
 * 用法：npm run deploy:pages（会自动向 gh 取令牌）
 */
import { execSync } from 'node:child_process'
import { copyFileSync, existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { dirname, join, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(root, 'dist')
const REPO = process.env.PAGES_REPO ?? 'BestGunners/qiaoqiaodao'
const BASE = process.env.PAGES_BASE ?? '/qiaoqiaodao/'
const BRANCH = process.env.PAGES_BRANCH ?? 'gh-pages'
const api = 'https://api.github.com'

const sleep = (ms) => new Promise((done) => setTimeout(done, ms))

function token() {
  if (process.env.GH_TOKEN) return process.env.GH_TOKEN
  const gh = process.env.GH_BIN ?? 'C:\\Program Files\\GitHub CLI\\gh.exe'
  return execSync('"' + gh + '" auth token', { encoding: 'utf8' }).trim()
}

const TOKEN = token()
if (!TOKEN) {
  console.error('拿不到 GitHub 令牌，先确认 gh auth login 过')
  process.exit(1)
}

async function call(path, options = {}, attempt = 1) {
  try {
    const response = await fetch(api + path, {
      ...options,
      headers: {
        Authorization: 'Bearer ' + TOKEN,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        'Content-Type': 'application/json',
        ...(options.headers ?? {}),
      },
    })

    const text = await response.text()
    const body = text ? JSON.parse(text) : null

    if (!response.ok) {
      const retryable = response.status === 429 || response.status >= 500
      if (retryable && attempt < 5) {
        await sleep(700 * attempt)
        return call(path, options, attempt + 1)
      }
      throw new Error(
        'GitHub API ' + options.method + ' ' + path + ' 失败：' + response.status + ' ' + (body?.message ?? text),
      )
    }

    return body
  } catch (error) {
    if (attempt < 5) {
      await sleep(900 * attempt)
      return call(path, options, attempt + 1)
    }
    throw error
  }
}

function listFiles(dir) {
  const out = []
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) out.push(...listFiles(full))
    else out.push(full)
  }
  return out
}

console.log('1/4 构建（base = ' + BASE + '）')
execSync('npm.cmd run build', {
  cwd: root,
  stdio: 'inherit',
  env: {
    ...process.env,
    PAGES_BASE: BASE,
    ComSpec: process.env.ComSpec ?? 'C:\\Windows\\System32\\cmd.exe',
  },
})

if (!existsSync(join(dist, 'index.html'))) throw new Error('没有找到 dist/index.html')
copyFileSync(join(dist, 'index.html'), join(dist, '404.html'))
writeFileSync(join(dist, '.nojekyll'), '')

const files = listFiles(dist)
console.log('2/4 上传 ' + files.length + ' 个文件（串行上传，慢一点但不容易被重置）')

const blobs = []
for (let index = 0; index < files.length; index += 1) {
  const file = files[index]
  const content = readFileSync(file).toString('base64')
  const blob = await call('/repos/' + REPO + '/git/blobs', {
    method: 'POST',
    body: JSON.stringify({ content, encoding: 'base64' }),
  })
  blobs.push({ blob, file })
  if ((index + 1) % 10 === 0 || index === files.length - 1) {
    console.log('   已上传 ' + (index + 1) + '/' + files.length)
  }
}

console.log('3/4 建目录树和提交')
const tree = await call('/repos/' + REPO + '/git/trees', {
  method: 'POST',
  body: JSON.stringify({
    tree: blobs.map(({ blob, file }) => ({
      path: relative(dist, file).split(sep).join('/'),
      mode: '100644',
      type: 'blob',
      sha: blob.sha,
    })),
  }),
})

const commit = await call('/repos/' + REPO + '/git/commits', {
  method: 'POST',
  body: JSON.stringify({
    message: 'deploy: ' + new Date().toISOString(),
    tree: tree.sha,
    parents: [],
  }),
})

console.log('4/4 更新 ' + BRANCH + ' 分支')
const refPath = '/repos/' + REPO + '/git/refs/heads/' + BRANCH
let exists = true
try {
  await call(refPath)
} catch {
  exists = false
}

if (exists) {
  await call(refPath, { method: 'PATCH', body: JSON.stringify({ sha: commit.sha, force: true }) })
} else {
  await call('/repos/' + REPO + '/git/refs', {
    method: 'POST',
    body: JSON.stringify({ ref: 'refs/heads/' + BRANCH, sha: commit.sha }),
  })
}

const [owner, repo] = REPO.split('/')
console.log('\n发布完成：https://' + owner.toLowerCase() + '.github.io/' + repo + '/')
