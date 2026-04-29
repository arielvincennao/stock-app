import { Pagination } from './Pagination'
import { ProductList } from './ProductList'
import { SectionHeader } from './SectionHeader'
import type { ProductoDB } from '../types/product'

type ProductListViewProps = {
  loading: boolean
  error: string
  searchTerm: string
  sortBy: 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc' | 'stock-asc' | 'stock-desc'
  products: ProductoDB[]
  totalPages: number
  currentPage: number
  onSearchTermChange: (value: string) => void
  onSortByChange: (value: 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc' | 'stock-asc' | 'stock-desc') => void
  onCreateProduct: () => void
  onEdit: (product: ProductoDB) => void
  onDelete: (product: ProductoDB) => void
  onDetails: (product: ProductoDB) => void
  onChangePage: (page: number) => void
}

export function ProductListView({
  loading,
  error,
  searchTerm,
  sortBy,
  products,
  totalPages,
  currentPage,
  onSearchTermChange,
  onSortByChange,
  onCreateProduct,
  onEdit,
  onDelete,
  onDetails,
  onChangePage,
}: ProductListViewProps) {
  return (
    <>
      <SectionHeader
        title="Listado de productos"
        description="Productos guardados en SQLite (database.db) desde Electron."
        action={
          <button className="primary-btn" type="button" onClick={onCreateProduct}>
            Nuevo producto
          </button>
        }
      />

      {loading && <p className="status-text">Cargando productos...</p>}
      {error && <p className="error-text">{error}</p>}

      <section className="list-controls" aria-label="Buscar y ordenar productos">
        <input
          className="search-input"
          type="text"
          placeholder="Buscar por nombre, categoria o codigo"
          value={searchTerm}
          onChange={(event) => onSearchTermChange(event.target.value)}
        />
        <select
          className="sort-select"
          value={sortBy}
          onChange={(event) =>
            onSortByChange(
              event.target.value as 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc' | 'stock-asc' | 'stock-desc'
            )
          }
        >
          <option value="name-asc">Nombre (A-Z)</option>
          <option value="name-desc">Nombre (Z-A)</option>
          <option value="price-asc">Precio (menor a mayor)</option>
          <option value="price-desc">Precio (mayor a menor)</option>
          <option value="stock-asc">Stock (menor a mayor)</option>
          <option value="stock-desc">Stock (mayor a menor)</option>
        </select>
      </section>

      <ProductList products={products} loading={loading} onEdit={onEdit} onDelete={onDelete} onDetails={onDetails} />
      <Pagination totalPages={totalPages} currentPage={currentPage} onChangePage={onChangePage} />
    </>
  )
}
