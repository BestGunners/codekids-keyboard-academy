import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // 主色：偏科技感的蓝
        brand: {
          50: '#eef4ff',
          100: '#dbe7ff',
          200: '#bcd2ff',
          300: '#93b6ff',
          400: '#6693fb',
          500: '#3d74f0',
          600: '#2757d6',
          700: '#2046ad',
          800: '#1f3d8a',
          900: '#1d3670',
        },
        // 状态色：青绿=正确/进行中，琥珀=奖励/提醒
        mint: { 50: '#e9fbf7', 100: '#cdf5ee', 300: '#7ae4d6', 500: '#2fd4c4', 600: '#1cb3a6' },
        ember: { 50: '#fff5e8', 100: '#ffe8cc', 300: '#ffc978', 500: '#ff9f43', 600: '#e8862b' },
        // 文字与表面
        ink: { DEFAULT: '#12203a', soft: '#5b6b88', faint: '#94a3b8' },
        surface: { DEFAULT: '#ffffff', muted: '#f4f7fb', line: '#e3eaf4' },
        // 童趣用色（只用在岛屿、徽章、舞台这些"内容"上）
        candy: {
          pink: '#ff8fb1',
          orange: '#ffb35c',
          yellow: '#ffd95c',
          green: '#6fd08c',
          mint: '#57d6c4',
          purple: '#a78bfa',
        },
      },
      fontFamily: {
        kid: ['"Baloo 2"', '"Noto Sans SC Variable"', '"Microsoft YaHei"', 'system-ui', 'sans-serif'],
        display: ['"ZCOOL KuaiLe"', '"Baloo 2"', '"Noto Sans SC Variable"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'Consolas', 'monospace'],
      },
      borderRadius: {
        kid: '1rem',
      },
      boxShadow: {
        kid: 'inset 0 1px 0 rgba(255,255,255,0.28), 0 10px 20px -14px rgba(24,52,120,0.6)',
        pop: '0 1px 2px rgba(18,32,58,0.05), 0 20px 36px -26px rgba(18,32,58,0.5)',
        glow: '0 0 0 4px rgba(61,116,240,0.14)',
      },
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-4px)' },
          '75%': { transform: 'translateX(4px)' },
        },
        pop: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.18)' },
          '100%': { transform: 'scale(1)' },
        },
        breathe: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.05)', opacity: '0.9' },
        },
      },
      animation: {
        shake: 'shake 0.28s ease-in-out',
        pop: 'pop 0.22s ease-out',
        breathe: 'breathe 1.8s ease-in-out infinite',
      },
    },
  },
  plugins: [],
} satisfies Config