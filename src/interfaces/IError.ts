export interface IError {
  code: number,
  text: string,
  link: {
    url: string,
    label: string
  }
}
