export const formatId = (id: string) => {
  const formattedId = id.slice(0, 3) + '...' + id.slice(-3)
  return formattedId
}