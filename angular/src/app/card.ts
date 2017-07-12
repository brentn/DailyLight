export interface Card {
  date: string,
  morning: {
    heading: string,
    text: string,
    references: string
  },
  evening: {
    heading: string,
    text: string,
    references: string
  }
}
