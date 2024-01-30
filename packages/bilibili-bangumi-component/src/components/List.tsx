import type { FunctionalComponent } from '@stencil/core'
import { h } from '@stencil/core'
import type { ListItem } from '../shared/types'
import { Skeleton } from './Skeleton'

interface ListProps {
  loading: boolean
  list: ListItem[]
}

export const List: FunctionalComponent<ListProps> = ({ list, loading }) => {
  return (
    <div class="bbc-bangumi">
      {list.map(item => (
        <div>
          {loading
            ? <Skeleton />
            : (
              <div class="bbc-bangumi-item">
                <a href={item.url} target="_blank" rel="noreferrer">
                  {/* @ts-expect-error */}
                  <img src={item.cover} alt="cover" referrerpolicy="no-referrer" />
                </a>
                <div class="bbc-bangumi-content">
                  <h3 class="bbc-bangumi-title">
                    <a href={item.url} target="_blank" rel="noreferrer">{item.name ? item.name : item.nameCN}</a>
                    {item.name && <small>{item.nameCN}</small>}
                  </h3>
                  <div class="bbc-bangumi-labels">
                    {item.labels.map(label => (
                      <div class="bbc-bangumi-label">
                        <p class="bbc-bangumi-label-title">{label.label}</p>
                        {label.value && <p>{label.value}</p>}
                      </div>
                    ))}
                  </div>
                  <p class="bbc-bangumi-summary">{item.summary}</p>
                </div>
              </div>
              )}
        </div>
      ))}
    </div>
  )
}
