import type { AnimeCollection, BookCollection, CollectionLabel, CollectionType, GameCollection, Subject, SubjectType } from './types'

export const animeCollectionMap: Record<AnimeCollection, CollectionType> = {
  全部: '0',
  想看: '1',
  在看: '2',
  看过: '3',
}

export const gameCollectionMap: Record<GameCollection, CollectionType> = {
  全部: '0',
  想玩: '1',
  在玩: '2',
  玩过: '3',
}

export const bookCollectionMap: Record<BookCollection, CollectionType> = {
  全部: '0',
  想读: '1',
  在读: '2',
  读过: '3',
}

export const collectionMap = {
  动画: animeCollectionMap,
  游戏: gameCollectionMap,
  书籍: bookCollectionMap,
}

export const subjectMap: Record<Subject, SubjectType> = {
  动画: '1',
  游戏: '2',
  书籍: '3',
}

export const collectionLabelMap: Record<Subject, CollectionLabel> = {
  动画: ['全部', '想看', '在看', '看过'],
  游戏: ['全部', '想玩', '在玩', '玩过'],
  书籍: ['全部', '想读', '在读', '读过'],
}
