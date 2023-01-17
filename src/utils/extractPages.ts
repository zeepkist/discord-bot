export const extractPages = (string?: string) => {
  if (!string) return { currentPage: 0, totalPages: 0 }
  const pages = string.split('Page ')[1].split('.')[0]
  const [currentPage, totalPages] = pages.split(' of ')

  console.log(string, currentPage, totalPages)
  return {
    currentPage: Number.parseInt(currentPage),
    totalPages: Number.parseInt(totalPages)
  }
}
