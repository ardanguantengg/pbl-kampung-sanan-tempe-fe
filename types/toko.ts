export interface StoreItem {
  id: number
  name: string
  owner: string
  address: string
  gmaps_link?: string
  area: string
  whatsapp: string
  description?: string
  image?: string
  product_count?: number
  status: string
  products?: any[]
}

export interface StoreFormData {
  name: string
  owner: string
  address: string
  gmaps_link: string
  area: string
  whatsapp: string
  description: string
  status: string
  image: string
  imageFile?: File | null
}