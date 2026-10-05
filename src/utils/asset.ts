/**
 * 静态资源地址。
 *
 * public 目录里的图片如果直接写 "/hedgehog.png"，部署到子路径
 * （比如 GitHub Pages 的 /codekids-keyboard-academy/）就会 404。
 * 用这个函数拼上构建时的 base 前缀，本地开发和线上都能用。
 */
export function assetUrl(name: string): string {
  return `${import.meta.env.BASE_URL}${name}`
}
