export interface ProductItem {
  id: number
  store_id: number
  store_name?: string
  name: string
  image?: string
  price: number
  variant?: string
  size?: string
  description?: string
  status: string
}

export interface ProductFormData {
  store_id: string
  name: string
  price: string
  variant: string
  size: string
  description: string
  status: string
  image: string
  imageFile?: File | null
}

export interface StoreOption {
  id: number
  name: string
  owner?: string
}