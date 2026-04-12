export interface Sorting<T = string> {
  sortBy: T;
  order: "asc" | "desc";
}
