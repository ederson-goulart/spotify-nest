import { Band } from "../../../../../generated/prisma";

export interface BandList {
  bands: Band[];
  pagination: {
    currentPage: number;
    totalItems: number;
    totalPages: number;
  };
}
