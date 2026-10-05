/**
 * 背景装饰：柔光斑 + 漂浮的几何点。
 * 不用 emoji，靠色块和缓慢移动营造科技感，同时保留一点童趣的呼吸感。
 */
export function Backdrop() {
  const blobs = [
    { className: '-left-24 top-4 h-72 w-72 bg-brand-200/30', delay: '0s' },
    { className: '-right-24 top-32 h-64 w-64 bg-mint-300/25', delay: '1.6s' },
    { className: 'left-1/3 bottom-0 h-56 w-56 bg-ember-300/20', delay: '3.1s' },
  ]

  const dots = [
    { top: '12%', left: '22%', size: 8, color: 'bg-brand-300/60', delay: '0s' },
    { top: '26%', left: '78%', size: 10, color: 'bg-mint-300/60', delay: '0.9s' },
    { top: '58%', left: '12%', size: 6, color: 'bg-ember-300/70', delay: '1.7s' },
    { top: '72%', left: '68%', size: 9, color: 'bg-brand-300/50', delay: '2.4s' },
    { top: '40%', left: '48%', size: 5, color: 'bg-candy-purple/40', delay: '3.3s' },
  ]

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      {blobs.map((blob) => (
        <div
          key={blob.className}
          className={`anim-drift absolute rounded-full blur-3xl ${blob.className}`}
          style={{ animationDelay: blob.delay }}
        />
      ))}

      {dots.map((dot, index) => (
        <span
          key={index}
          className={`anim-float absolute rounded-full ${dot.color}`}
          style={{
            top: dot.top,
            left: dot.left,
            width: dot.size,
            height: dot.size,
            animationDelay: dot.delay,
          }}
        />
      ))}
    </div>
  )
}