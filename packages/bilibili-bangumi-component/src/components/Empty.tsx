import { h } from '@stencil/core'

export function Empty() {
  return (
    <div class="bbc-empty">
      {/* @ts-expect-error */}
      <img src="https://s1.hdslb.com/bfs/static/webssr/article/empty.png" alt="empty" referrerpolicy="no-referrer" />
    </div>
  )
}
