import { h } from '@stencil/core'

export type ChangeType = 'head' | 'prev' | 'next' | 'tail'

interface PaginationProps {
  pageNumber: number
  totalPages: number
  onChange: (changeType: ChangeType) => void
  onInputChange: (event: Event) => void
}

export function Pagination({ pageNumber, totalPages, onChange, onInputChange }: PaginationProps) {
  return (
    <div class="bbc-pagination">
      <a class="bbc-pagination-button" onClick={() => onChange('head')}>首页</a>
      <a class="bbc-pagination-button" onClick={() => onChange('prev')}>上一页</a>
      <span class="bbc-pagination-pagenum">{`${pageNumber} / ${totalPages}`}</span>
      <a class="bbc-pagination-button" onClick={() => onChange('next')}>下一页</a>
      <a class="bbc-pagination-button" onClick={() => onChange('tail')}>尾页</a>
      <div class="bbc-pagination-input">
        <span>跳至</span>
        <input type="text" maxLength={4} onChange={onInputChange} />
        <span>页</span>
      </div>
    </div>
  )
}
