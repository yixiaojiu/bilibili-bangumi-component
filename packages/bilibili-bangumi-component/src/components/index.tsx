import { Component, Prop, State, h } from '@stencil/core'
import type { AnimeCollection, Collection, GameCollection, Platform, ResponseData, Subject } from '../shared/types'
import type { UnionToTuple } from '../shared/typeUtils'
import type { BilibiliParams } from '../shared/api'
import { getBangumi, getBilibili } from '../shared/api'
import { Tabs } from './Tabs'
import { List } from './List'
import { type ChangeType, Pagination } from './Pagination'
import { Skeleton } from './Skeleton'
import { Empty } from './Empty'
import { Error } from './Error'

@Component({
  tag: 'bilibili-bangumi',
  styleUrl: 'index.css',
  shadow: true,
})
export class BilibiliBangumi {
  @Prop() api: string
  @Prop() bilibiliUid?: string
  @Prop() bgmUid?: string
  @Prop() bilibiliEnabled = true
  @Prop() bgmEnabled = true

  @State() loading = false
  @State() error?: Error

  @State() pageNumber = 1
  @State() pageSize = 15
  @State() responseData: ResponseData

  platformLabels: UnionToTuple<Platform> = ['Bilibili', 'Bangumi']
  @State() activePlatform: Platform = 'Bilibili'

  subjectLabels: UnionToTuple<Subject> = ['动画', '游戏']
  @State() activeSubject: Subject = '动画'

  @State() collectionLabels: UnionToTuple<AnimeCollection> | UnionToTuple<GameCollection> = ['全部', '想看', '在看', '看过']
  @State() activeCollection: Collection = '全部'

  componentWillLoad() {
    const filterArr = [this.bilibiliEnabled, this.bgmEnabled]
    // @ts-expect-error
    this.platformLabels = this.platformLabels.filter((_, index) => filterArr[index])
    this.activePlatform = this.platformLabels[0]
    this.fetchData()
  }

  private fetchData = async () => {
    try {
      this.loading = true
      this.error = null
      let response
      const bilibiliParams: BilibiliParams = {
        uid: this.bilibiliUid,
        collectionType: this.activeCollection,
        pageSize: this.pageSize,
        pageNumber: this.pageNumber,
      }
      if (this.activePlatform === 'Bilibili') {
        response = await getBilibili(this.api, bilibiliParams)
      }
      else {
        response = await getBangumi(this.api, {
          ...bilibiliParams,
          uid: this.bgmUid,
          subjectType: this.activeSubject,
        })
      }
      if (response.code === 200) {
        this.responseData = response.data
      }
      else {
        this.error = response
        this.responseData = null
      }
    }
    catch (error) {
      this.error = error
      this.responseData = null
    }
    this.loading = false
  }

  private handlePlatformChange = (label: Platform) => {
    this.activePlatform = label
    this.pageNumber = 1
    this.activeSubject = '动画'
    this.activeCollection = '全部'
    this.fetchData()
  }

  private handleSubjectChange = (label: Subject) => {
    this.collectionLabels = label === '动画' ? ['全部', '想看', '在看', '看过'] : ['全部', '想玩', '在玩', '玩过']
    this.activeSubject = label
    this.pageNumber = 1
    this.activeCollection = '全部'
    this.fetchData()
  }

  private handleCollectionChange = (label: Collection) => {
    this.activeCollection = label
    this.pageNumber = 1
    this.fetchData()
  }

  private scrollToTop = () => {
    document.documentElement.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  private handlePageChange = (changeType: ChangeType) => {
    const { totalPages } = this.responseData!
    switch (changeType) {
      case 'head':
        this.pageNumber = 1
        break
      case 'prev':
        if (this.pageNumber === 1)
          return
        this.pageNumber--
        break
      case 'next':
        if (this.pageNumber === totalPages)
          return
        this.pageNumber++
        break
      case 'tail':
        this.pageNumber = totalPages
        break
    }
    this.scrollToTop()
    this.fetchData()
  }

  handleInputChange = (event: Event) => {
    const inputValue = Number.parseInt((event.target as HTMLInputElement).value)
    if (Object.is(inputValue, Number.NaN))
      return
    const { totalPages } = this.responseData!
    if (inputValue < 1)
      this.pageNumber = 1
    else if (inputValue > totalPages)
      this.pageNumber = totalPages
    else
      this.pageNumber = inputValue
    this.scrollToTop()
    this.fetchData()
  }

  render() {
    return (
      <div>
        <div class="bbc-header-platform">
          <Tabs activeLabel={this.activePlatform} labels={this.platformLabels} onChange={this.handlePlatformChange} />
          { this.activePlatform === 'Bangumi' && <div class="divider" />}
          {
            this.activePlatform === 'Bangumi'
              && <Tabs activeLabel={this.activeSubject} labels={this.subjectLabels} onChange={this.handleSubjectChange} />
          }
        </div>
        <div>
          <Tabs activeLabel={this.activeCollection} labels={this.collectionLabels} onChange={this.handleCollectionChange} />
        </div>
        {this.loading && !this.responseData && <Skeleton />}
        {this.error && <Error error={this.error} />}
        {this.responseData && <List loading={this.loading} list={this.responseData.list} />}
        {this.responseData && this.responseData.total === 0 && <Empty />}
        {this.responseData && (
          <Pagination
            pageNumber={this.pageNumber}
            totalPages={this.responseData.totalPages}
            onChange={this.handlePageChange}
            onInputChange={this.handleInputChange}
          />
        )}
      </div>
    )
  }
}
