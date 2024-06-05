export const normalizeKeyword = (keyword: string) => {
  return (keyword as string)
    .normalize('NFD')
    .toLowerCase()
    .replace(/[\u0300-\u036f\s]/g, '')
    .replace('đ', 'd')
}

export function objectToFormData(obj: any) {
  const formData = new FormData()

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key]
      const valueIsFile = value instanceof File

      const isArrayData = Array.isArray(value)
      const initialValue = typeof value === 'number' ? Number(value) : ''

      if (isArrayData) {
        const isFile = value.some((item) => item instanceof File)
        if (isFile) {
          Array.prototype.forEach.call(value, (item) => {
            formData.append(key, item)
          })
        } else {
          formData.append(key, value ? JSON.stringify(value) : '')
        }
      } else {
        if (typeof value === 'object' && !isArrayData && !valueIsFile) {
          formData.append(key, JSON.stringify(value))
        } else {
          formData.append(key, value || initialValue)
        }
      }
    }
  }

  return formData
}

export function capitalizeFirstLetter(str: string): string {
  if (str.length === 0) return str // Return empty string if input is empty
  return str.charAt(0).toUpperCase() + str.slice(1)
}
