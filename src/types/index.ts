export interface Brand {
  id: string;
  name: string;
  country: string;
  logo_url: string;
}

export interface Motorcycle {
  id: string;
  model_name: string;
  specs: string;
  price: string | number;
  brand_id: string;
  logo_url: string;
  brands?: { name: string };
}

export interface Review {
  id: string;
  reviewer_name: string;
  comment: string;
  rating: number;
  motorcycle_id: string;
}