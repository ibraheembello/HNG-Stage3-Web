export interface User {
  id: string;
  github_id: string;
  github_username: string;
  email: string | null;
  name: string | null;
  avatar_url: string | null;
  role: 'admin' | 'analyst';
  created_at: string;
}

export interface Profile {
  id: string;
  name: string;
  gender: string;
  gender_probability: number;
  age: number;
  age_group: string;
  country_id: string;
  country_name: string;
  country_probability: number;
  created_at: string;
}

export interface PaginationLinks {
  self: string;
  first: string;
  last: string;
  next: string | null;
  prev: string | null;
}

export interface PaginatedEnvelope<T> {
  status: 'success';
  data: T[];
  page: number;
  limit: number;
  total: number;
  total_pages: number;
  links: PaginationLinks;
}

export interface ProfileFilters {
  gender?: string;
  age_group?: string;
  country_id?: string;
  min_age?: string;
  max_age?: string;
  sort_by?: string;
  order?: string;
  page?: string;
  limit?: string;
}
