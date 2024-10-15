export const formatCurrency = (amount: string | undefined): string => {
  if (typeof amount === "undefined") {
    return "$--"
  }
  const formattedNumber = new Intl.NumberFormat("vi-VN").format(Number(amount))
  const formattedPrice = `$${formattedNumber}`
  return formattedPrice
}
