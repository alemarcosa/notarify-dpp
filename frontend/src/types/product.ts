export enum ProductStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED'
}

export interface Material {
  id?: string;
  name: string;
  percentage: number;
  origin: string;
  recyclable: boolean;
}

export interface Sustainability {
  carbonFootprint: number;
  waterConsumption: number;
  recycledMaterialPercentage: number;
  repairabilityScore: number;
  recyclable: boolean;
}

export interface Certification {
  id?: string;
  name: string;
  issuingAuthority: string;
  issueDate: string;
  expirationDate: string;
  documentUrl?: string;
}

export interface ProductDocument {
  id?: string;
  type: string;
  name: string;
  url: string;
}

export interface ProductImage {
  id?: string;
  url: string;
  isCover: boolean;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  serialNumber: string;
  category: string;
  description: string;
  productionDate: string;
  origin: string;
  status: ProductStatus;
  materials: Material[];
  sustainability: Sustainability;
  certifications: Certification[];
  documents: ProductDocument[];
  images: ProductImage[];
}

export interface FileUpload {
  file: File;
  preview: string;
}

export interface ProductPassport {
  uuid: string;
  productId: string;
  views: number;
}

export interface ScanEvent {
  id: string;
  passportId: string;
  scannedAt: string;
  browser?: string;
  os?: string;
  country?: string;
}

export interface CreateProductPayload extends Omit<Product, 'id' | 'status'> {}
export interface UpdateProductPayload extends Partial<CreateProductPayload> {
  status?: ProductStatus;
}

export interface ProductsResponse {
  data: Product[];
  total: number;
  page: number;
  limit: number;
}
