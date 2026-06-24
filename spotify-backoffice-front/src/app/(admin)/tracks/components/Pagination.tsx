import { Dispatch, SetStateAction } from "react";

interface Props {
  totalPages: number;
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
}

export default function Pagination({
  totalPages,
  currentPage,
  setCurrentPage,
}: Props) {
  const surroundingPages = 2;

  const startPage = Math.max(currentPage - surroundingPages, 1);
  const endPage = Math.min(currentPage + surroundingPages, totalPages);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (totalPages) {
      if (currentPage < totalPages) {
        setCurrentPage((prev) => prev + 1);
      }
    }
  };

  return (
    <div className="flex justify-center mt-8 gap-2">
      <button
        onClick={handlePrev}
        disabled={currentPage === 1}
        className="disabled:opacity-50 cursor-pointer"
      >
        Voltar
      </button>
      {Array.from(
        { length: endPage - startPage + 1 },
        (_, i) => i + startPage,
      ).map((pageNumber) => {
        const isActive = pageNumber === currentPage;
        return (
          <button
            key={pageNumber}
            onClick={() => setCurrentPage(pageNumber)}
            className={`border rounded py-1 px-3 hover:cursor-pointer hover:bg-gray-800 hover:text-gray-50 ${isActive ? `bg-gray-800 text-gray-50` : ``}`}
          >
            {pageNumber}
          </button>
        );
      })}
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="disabled:opacity-50 cursor-pointer"
      >
        Avançar
      </button>
    </div>
  );
}
