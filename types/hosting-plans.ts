export interface HostingPlan {
  id: string;
  name: string;
  description: string;
  price: {
    monthly: number;
    yearly: number;
    currency: string;
  };
  features: string[];
  recommended?: boolean;
  badge?: string;
  limits?: {
    websites?: number | 'unlimited';
    storage?: string;
    bandwidth?: string;
    databases?: number | 'unlimited';
    email?: number | 'unlimited';
    domains?: number | 'unlimited';
    ram?: string;
    cpu?: string;
    ssl?: string;
  };
}