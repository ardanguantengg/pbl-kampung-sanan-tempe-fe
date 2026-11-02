const MAX_IMAGE_SIZE = 5 * 1024 * 1024

const allowedTypes: Record<string, string[]> = {
  '.jpg': ['image/jpeg', 'image/jpg'],
  '.jpeg': ['image/jpeg', 'image/jpg'],
  '.png': ['image/png'],
}

export function validateImageFile(file: File): string | null {
  const extension = file.name.slice(file.name.lastIndexOf('.')).toLowerCase()

  if (!allowedTypes[extension]?.includes(file.type)) {
    return 'Format gambar harus JPG, JPEG, atau PNG.'
  }

  if (file.size > MAX_IMAGE_SIZE) {
    return 'Ukuran gambar maksimal 5 MB.'
  }

  return null
}