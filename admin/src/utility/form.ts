export const getLabelFromName = (name: string) => {
  return name.replace("_", " ")
      .replace(/^([a-z])|\s+([a-z])/g, function ($1) {
          return $1.toUpperCase();
      })
}
