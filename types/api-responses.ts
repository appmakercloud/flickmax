// API Response Types for GoDaddy Catalog API

export interface APIProduct {
  id?: string;
  productId?: string;
  name?: string;
  title?: string;
  content?: string;
  alias?: string;
  shortDescription?: string;
  productCategory?: string;
  category?: string;
  subcategory?: string;
  renewalPeriod?: number;
  renewalPeriodUnit?: string;
  description?: string;
  disclaimer?: string;
  label?: string;
  exampleDomain?: string;
  supportedTLDs?: string[];
  additionalProducts?: string[];
  pricing?: APIPricing;
  listPrice?: string | number;
  salePrice?: string | number;
  plans?: any;
  pricePlans?: any;
  priceInfo?: any;
  prices?: any;
  term?: string;
  discounts?: APIDiscount[];
  options?: APIOption[];
  includes?: string[];
  features?: APIFeature[];
  specs?: APISpec[];
  tags?: APITag[];
  popular?: boolean;
  recommended?: boolean;
  badge?: string;
  disclaimers?: string[];
}

export interface APIPricing {
  list?: number;
  listPrice?: number;
  sale?: number;
  salePrice?: number;
  savings?: number;
  percentageSavings?: number;
  discount?: number;
  unit?: string;
  currency?: string;
  currencyCode?: string;
  term?: number;
  termUnit?: string;
  monthly?: any;
  month?: any;
  monthlyPrice?: any;
  yearly?: any;
  year?: any;
  annualPrice?: any;
}

export interface APIDiscount {
  type?: string;
  amount?: number;
  percentage?: number;
  startDate?: string;
  endDate?: string;
}

export interface APIOption {
  id?: string;
  name?: string;
  description?: string;
  required?: boolean;
  pricing?: APIPricing;
}

export interface APIFeature {
  id?: string;
  name?: string;
  text?: string;
  description?: string;
  icon?: string;
  value?: string | number | boolean;
  category?: string;
  highlighted?: boolean;
}

export interface APISpec {
  name?: string;
  value?: string | number;
  unit?: string;
}

export interface APITag {
  id?: string;
  name?: string;
  value?: string;
  category?: string;
  description?: string;
  products?: string[];
  count?: number;
}