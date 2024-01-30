import { h } from '@stencil/core'

export function Skeleton() {
  return (
    <div class="bbc-skeleton-container bbc-bangumi-item">
      <div class="bbc-skeleton-avatar"></div>
      <div class="bbc-skeleton-content bbc-bangumi-content">
        <div class="bbc-skeleton-row" style={{ width: '30%' }}></div>
        <div class="bbc-skeleton-row" style={{ width: '60%', height: '40px' }}></div>
        <div class="bbc-skeleton-row" style={{ width: '90%', height: '32px' }}></div>
      </div>
    </div>
  )
}
