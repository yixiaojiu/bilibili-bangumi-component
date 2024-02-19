import { h } from '@stencil/core'

interface ErrorProps {
  error: Error
}

export function Error({ error }: ErrorProps) {
  return (
    <div class="bbc-error">
      <img
        src="https://s1.hdslb.com/bfs/static/jinkela/long/bitmap/error_01.png"
        alt="parse failed"
        // @ts-expect-error
        referrerpolicy="no-referrer"
      />
      <p>Σ(oﾟдﾟoﾉ) 发生了一些错误</p>
      <p>{`message: ${error.message}`}</p>
    </div>
  )
}
