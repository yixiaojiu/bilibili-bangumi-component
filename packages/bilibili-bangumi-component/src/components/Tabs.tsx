import { h } from '@stencil/core'

interface TabProps<T> {
  labels: T[]
  activeLabel: T
  onChange: (index: T) => void
}

export function Tabs<T extends string>({ activeLabel, labels, onChange }: TabProps<T>) {
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
