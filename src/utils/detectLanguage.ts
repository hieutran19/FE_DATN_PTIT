export const detectLanguage = (value: string = "") => {
  if (value === "en") {
    return "Tiếng anh"
  }
  if (value === "vi") {
    return "Tiếng việt"
  }
  return ""
}
