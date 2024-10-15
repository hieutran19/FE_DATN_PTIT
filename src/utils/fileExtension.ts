export const IMAGE_TYPE = {
  PNG: "png",
  JPG: "jpg",
  JPEG: "jpeg",
  AVIF: "avif",
  WEBP: "webp",
  SVG: "svg",
  GIF: "gif",
}

export const getFileExtension = (filename: string) => {
  const regex = /(?:\.([^.]+))?$/
  const filenameParts = regex.exec(filename)
  if (filenameParts && filenameParts.length > 1) {
    return filenameParts[1]
  }
  return ""
}
