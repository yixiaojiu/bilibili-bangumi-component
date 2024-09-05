import { h } from '@stencil/core'
import type { ContainerState } from '../shared/types'

interface TabProps<T> {
  labels: T[]
  activeLabel: T
  containerState: ContainerState
  onChange: (index: T) => void
}

export function Tabs<T extends string>({ activeLabel, labels, containerState, onChange }: TabProps<T>) {
  const handleClick = (label: T) => {
    if (activeLabel !== label)
      onChange(label)
  }

  return (
    <div class="bbc-tabs">
      {labels.map(label => (
        <div
          class={{
            'bbc-tab-item': true,
            'bbc-tab-item-active': label === activeLabel,
            'bbc-md-tab-item': containerState !== 'large',
          }}
          key={label}
          onClick={() => handleClick(label)}
        >
          {label}
        </div>
      ))}
    </div>
  )
}
