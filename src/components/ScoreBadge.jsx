import { scoreColor } from '../utils/scoring'

export default function ScoreBadge({ score, size = 'md' }) {
  const isLg = size === 'lg'
  const sizePx = isLg ? 48 : 32
  const fontPx = isLg ? 18 : 12

  return (
    <div
      className="rounded-full flex items-center justify-center font-bold"
      style={{
        width: sizePx,
        height: sizePx,
        backgroundColor: scoreColor(score),
        color: '#fff',
        fontSize: fontPx,
        boxShadow: `0 0 12px ${scoreColor(score)}80`
      }}
    >
      {score}
    </div>
  )
}
