import { Product, ProductPassport } from './product';

export interface PassportPublicData {
  passport: ProductPassport;
  product: Product;
}
