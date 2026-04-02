// types.ts
export interface Item {
  name: string;
  slug: string;
  href?: string;
  count?: number;
  children?: Item[];
}