/**
 * 通过 GitHub API 把当前提交推到指定分支（默认 main）。
 *
 * 用途：国内网络下 github.com 的 HTTPS 经常被重置，git push 推不上去，
 * 但 api.github.com 一般还能用，于是改用 API 提交。
 * 只上传和远端不一样的文件，快的几秒钟。
 *
 * 用法：node scripts/push-source-api.mjs
 */
import { execFileSync, execSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const REPO = process.env.PAGES_REPO ?? 'BestGunners/codekids-keyboard-academy'
const BRANCH = process.argv[2] ?? 'main'
const api = 'https://api.github.com'
const TOKEN =
  process.env.GH_TOKEN ??
  execSync('"' + (process.env.GH_BIN ?? 'C:\\Program Files\\GitHub CLI\\gh.exe') + '" auth token', {
    encoding: 'utf8',
  }).trim()

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
      if ((response.status === 429 || response.status >= 500) && attempt < 5) {
        await new Promise((r) => setTimeout(r, 700 * attempt))
        return call(path, options, attempt + 1)
      }
      throw new Error('API ' + options.method + ' ' + path + ' → ' + response.status + ' ' + (body?.message ?? text))
    }
    return body
  } catch (error) {
    if (attempt < 5) {
      await new Promise((r) => setTimeout(r, 900 * attempt))
      return call(path, options, attempt + 1)
    }
    throw error
  }
}

const git = (args) =>
  execSync('git -c core.quotePath=false ' + args, { cwd: root, encoding: 'utf8' }).trim()

// 1. 本地索引里的全部文件（模式 + 内容哈希都是 git 算好的）
const index = git('ls-files -s')
  .split('\n')
  .filter(Boolean)
  .map((line) => {
    const match = /^(\d+)\s+([0-9a-f]{40})\s+\d+\t(.+)$/.exec(line)
    if (!match) throw new Error('看不懂的索引行：' + line)
    return { mode: match[1], sha: match[2], path: match[3] }
  })

const message = git('log -1 --pretty=%B')

// 2. 远端当前分支的树，用来跳过没变化的文件
const ref = await call('/repos/' + REPO + '/git/ref/heads/' + BRANCH)
const parent = ref.object.sha
const remoteTree = await call('/repos/' + REPO + '/git/trees/' + parent + '?recursive=1')
const remote = new Map()
for (const item of remoteTree.tree ?? []) {
  if (item.type === 'blob') remote.set(item.path, item.sha)
}

console.log('本地 ' + index.length + ' 个文件，远端 ' + remote.size + ' 个，开始比对…')

// 3. 只上传内容变化的文件
const entries = []
let uploaded = 0
for (const item of index) {
  let sha = item.sha
  if (remote.get(item.path) !== item.sha) {
    const content = readFileSync(join(root, item.path)).toString('base64')
    const blob = await call('/repos/' + REPO + '/git/blobs', {
      method: 'POST',
      body: JSON.stringify({ content, encoding: 'base64' }),
    })
    sha = blob.sha
    uploaded += 1
    console.log('   ↑ ' + item.path)
  }
  entries.push({ path: item.path, mode: item.mode, type: 'blob', sha })
}

console.log('需要上传 ' + uploaded + ' 个文件')

// 4. 建树 → 提交 → 更新分支
const tree = await call('/repos/' + REPO + '/git/trees', {
  method: 'POST',
  body: JSON.stringify({ tree: entries }),
})
const commit = await call('/repos/' + REPO + '/git/commits', {
  method: 'POST',
  body: JSON.stringify({ message, tree: tree.sha, parents: [parent] }),
})
await call('/repos/' + REPO + '/git/refs/heads/' + BRANCH, {
  method: 'PATCH',
  body: JSON.stringify({ sha: commit.sha, force: false }),
})

const localTree = execFileSync('git', ['-c', 'core.quotePath=false', 'rev-parse', 'HEAD^{tree}'], {
  cwd: root,
  encoding: 'utf8',
}).trim()
console.log('\n推送完成：' + BRANCH + ' → ' + commit.sha.slice(0, 7))
console.log('本地树 ' + localTree.slice(0, 7) + ' / 远端树 ' + tree.sha.slice(0, 7) + (localTree === tree.sha ? '  ✔ 内容完全一致' : '  ✖ 不一致，请检查'))
