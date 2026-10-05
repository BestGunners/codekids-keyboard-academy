import { useMemo, type ReactNode } from 'react'
import { STAGE_HEIGHT, STAGE_WIDTH, type SceneCommand } from '@/engine/cpp/interpreter'
import { cn } from '@/utils/cn'

const COLOR_VALUES: Record<string, string> = {
  orange: '#ff9f43',
  red: '#ef5350',
  pink: '#ff8fb1',
  purple: '#a78bfa',
  blue: '#4f9cf9',
  sky: '#7fd6ea',
  green: '#6fd08c',
  yellow: '#ffd95c',
  brown: '#b08968',
  black: '#1f2a44',
}

/** 五角星的十个顶点 */
function starPoints(cx: number, cy: number, outer = 10, inner = 4.4): string {
  const points: string[] = []
  for (let index = 0; index < 10; index += 1) {
    const radius = index % 2 === 0 ? outer : inner
    const angle = (Math.PI / 5) * index - Math.PI / 2
    points.push(`${(cx + radius * Math.cos(angle)).toFixed(1)},${(cy + radius * Math.sin(angle)).toFixed(1)}`)
  }
  return points.join(' ')
}

export interface StageCanvasProps {
  scene: SceneCommand[]
  className?: string
}

/**
 * 编程舞台的画布：把程序里的 star / circle / rect / line / text 画出来。
 * 坐标左上角是 (0, 0)，x 向右、y 向下，和数组从 0 开始数的思路一致。
 */
export function StageCanvas({ scene, className }: StageCanvasProps) {
  const nodes = useMemo(() => {
    const items: ReactNode[] = []
    let activeColor = COLOR_VALUES.orange
    let key = 0

    scene.forEach((command) => {
      if (command.type === 'clear') {
        items.length = 0
        return
      }

      if (command.type === 'color') {
        activeColor = COLOR_VALUES[command.color] ?? activeColor
        return
      }

      // 帧里只会有图形，这里顺手兜住其它指令
      if (command.type === 'wait') return

      const color = COLOR_VALUES[command.color] ?? activeColor
      key += 1

      switch (command.type) {
        case 'star':
          items.push(<polygon key={key} points={starPoints(command.x, command.y)} fill={color} />)
          break
        case 'circle':
          items.push(
            <circle key={key} cx={command.x} cy={command.y} r={Math.max(command.radius, 2)} fill={color} />,
          )
          break
        case 'rect':
          items.push(
            <rect
              key={key}
              x={command.x}
              y={command.y}
              width={command.width}
              height={command.height}
              rx={4}
              fill={color}
            />,
          )
          break
        case 'line':
          items.push(
            <line
              key={key}
              x1={command.x1}
              y1={command.y1}
              x2={command.x2}
              y2={command.y2}
              stroke={color}
              strokeWidth={4}
              strokeLinecap="round"
            />,
          )
          break
        case 'text':
          items.push(
            <text
              key={key}
              x={command.x}
              y={command.y}
              fontSize={15}
              fontWeight={700}
              fill={color}
              fontFamily="'Baloo 2', 'Microsoft YaHei', system-ui"
            >
              {command.text}
            </text>,
          )
          break
        default:
          break
      }
    })

    return items
  }, [scene])

  const gridLines: ReactNode[] = []
  for (let x = 40; x < STAGE_WIDTH; x += 40) {
    gridLines.push(<line key={`vx-${x}`} x1={x} y1={0} x2={x} y2={STAGE_HEIGHT} stroke="#e6f0fa" strokeWidth={1} />)
  }
  for (let y = 40; y < STAGE_HEIGHT; y += 40) {
    gridLines.push(<line key={`hy-${y}`} x1={0} y1={y} x2={STAGE_WIDTH} y2={y} stroke="#e6f0fa" strokeWidth={1} />)
  }

  return (
    <svg
      viewBox={`0 0 ${STAGE_WIDTH} ${STAGE_HEIGHT}`}
      className={cn('h-full w-full', className)}
      role="img"
      aria-label="编程舞台"
    >
      <rect x={0} y={0} width={STAGE_WIDTH} height={STAGE_HEIGHT} fill="#f8fcff" />
      {gridLines}
      {nodes}
      {nodes.length === 0 ? (
        <text x={STAGE_WIDTH / 2} y={STAGE_HEIGHT / 2} fontSize={14} fill="#a9bdd2" textAnchor="middle">
          舞台还是空的，点「运行」试试看
        </text>
      ) : null}
      <text x={6} y={STAGE_HEIGHT - 8} fontSize={9} fill="#b9c9da">
        0,0
      </text>
      <text x={STAGE_WIDTH - 60} y={12} fontSize={9} fill="#b9c9da">
        x→ {STAGE_WIDTH}
      </text>
      <text x={6} y={14} fontSize={9} fill="#b9c9da">
        y↓ {STAGE_HEIGHT}
      </text>
    </svg>
  )
}
