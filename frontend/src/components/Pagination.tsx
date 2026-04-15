type PaginationProps = {
  totalPages: number
  currentPage: number
  onChangePage: (page: number) => void
}

export function Pagination({ totalPages, currentPage, onChangePage }: PaginationProps) {
  return (
    <nav className="pagination" aria-label="Paginado de productos">
      {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
        <button
          key={pageNumber}
          type="button"
          className={pageNumber === currentPage ? 'page-btn active' : 'page-btn'}
          onClick={() => onChangePage(pageNumber)}
        >
          {pageNumber}
        </button>
      ))}
    </nav>
  )
}
