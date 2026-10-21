
export interface HamperItem {
  id: number
  name: string
  description?: string
  image?: string
  price: number
  status: string
  item_count?: number
  items?: any[]
}

export interface HamperFormData {
  name: string
  storeId: string
  jumlahProduk: string
  price: string
  status: string
  image: string
  imageFile?: File | null
  description: string
}
