import { useState } from 'react'
import './App.css'
import { AlertsView, mockAlerts } from './components/AlertsView'
import { ConfirmModal } from './components/ConfirmModal'
import { CreateProductModal } from './components/CreateProductModal'
import { DashboardMenu, type DashboardView } from './components/DashboardMenu'
import { EditProductModal } from './components/EditProductModal'
import { LoginView } from './components/LoginView'
import { MovementsView } from './components/MovementsView'
import { ProductDetailView } from './components/ProductDetailView'
import { ProductListView } from './components/ProductListView'
import { SellView } from './components/SellView'
import { HelpView } from './components/HelpView'
import { SettingsView } from './components/SettingsView'
import { useProducts } from './hooks/useProducts'
import { useSales } from './hooks/useSales'
import { fetchMovementDetail } from './services/productApi'

function App() {
  const PRODUCTS_PER_PAGE = 10

  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [dashboardView, setDashboardView] = useState<DashboardView>('listado')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [error, setError] = useState('')

  const products = useProducts({ productsPerPage: PRODUCTS_PER_PAGE, onError: setError })
  const sales = useSales({ productos: products.productos, loadProducts: products.loadProducts, onError: setError })

  if (isLoggedIn) {
    return (
      <main className="dashboard-page">
        <section className="dashboard-layout">
          <DashboardMenu
            currentView={dashboardView}
            onNavigate={setDashboardView}
            alertsCount={mockAlerts.length}
            onLogout={() => setIsLoggedIn(false)}
          />
          <section className="dashboard-shell">
            {dashboardView === 'listado' ? (
              <ProductListView
                loading={products.loading}
                error={error}
                searchTerm={products.searchTerm}
                sortBy={products.sortBy}
                products={products.productosPaginados}
                totalPages={products.totalPages}
                currentPage={products.currentPage}
                onSearchTermChange={products.setSearchTerm}
                onSortByChange={products.setSortBy}
                onCreateProduct={() => {
                  setIsCreateModalOpen(true)
                  setError('')
                }}
                onEdit={products.editarProducto}
                onDelete={products.eliminarProducto}
                onDetails={(producto) => {
                  products.verDetallesProducto(producto)
                  setDashboardView('detalle')
                }}
                onChangePage={products.setCurrentPage}
              />
            ) : dashboardView === 'detalle' ? (
              <ProductDetailView
                product={products.selectedProduct}
                onBack={() => setDashboardView('listado')}
              />
            ) : dashboardView === 'vender' ? (
              <SellView
                paymentMethod={sales.salePaymentMethod}
                discountPercent={sales.saleDiscountPercent}
                productQuery={sales.saleProductQuery}
                productQuantity={sales.saleProductQuantity}
                suggestions={sales.saleSuggestions}
                cart={sales.saleCart}
                defaultProductImage={sales.defaultProductImage}
                subtotal={sales.saleSubtotal}
                discountAmount={sales.saleDiscountAmount}
                total={sales.saleTotal}
                saleMessage={sales.saleMessage}
                onPaymentMethodChange={sales.setSalePaymentMethod}
                onDiscountPercentChange={sales.setSaleDiscountPercent}
                onProductQueryChange={sales.setSaleProductQuery}
                onProductQuantityChange={sales.setSaleProductQuantity}
                onAddProduct={sales.agregarProductoAlCarrito}
                onSuggestionSelect={(suggestion) => {
                  sales.setSaleProductQuery(suggestion.name)
                  setError('')
                }}
                onAdjustCartItemQuantity={sales.ajustarCantidadItem}
                onRemoveCartItem={sales.eliminarItemDelCarrito}
                onCharge={() => void sales.cobrarVenta()}
                onCancelSale={sales.cancelarVenta}
                formatCurrency={sales.formatCurrency}
              />
            ) : dashboardView === 'movimientos' ? (
              <MovementsView
                movements={sales.movements}
                formatCurrency={sales.formatCurrency}
                fetchMovementDetail={fetchMovementDetail}
                onDeleteMovement={sales.eliminarMovimiento}
              />
            ) : dashboardView === 'alertas' ? (
              <AlertsView />
            ) : dashboardView === 'ayuda' ? (
              <HelpView />
            ) : (
              <SettingsView />
            )}
          </section>
        </section>

        {products.editingProductId !== null && (
          <EditProductModal
            form={products.editForm}
            onChange={products.setEditForm}
            onPickImage={() => void products.seleccionarImagenEdicion()}
            onSave={products.guardarEdicionProducto}
            onCancel={products.cancelarEdicion}
          />
        )}

        {isCreateModalOpen && (
          <CreateProductModal
            error={error}
            form={products.form}
            onChange={products.setForm}
            onPickImage={() => void products.seleccionarImagenNuevoProducto()}
            onSave={() =>
              void products.agregarProducto(() => {
                setIsCreateModalOpen(false)
                setError('')
              })
            }
            onCancel={() => {
              setIsCreateModalOpen(false)
              setError('')
            }}
          />
        )}

        {products.confirmState && (
          <ConfirmModal
            title={products.confirmarTitulo}
            description={products.confirmarDescripcion}
            confirmLabel={products.confirmarBoton}
            cancelLabel={products.cancelarTexto}
            confirmClassName={products.confirmarClaseBoton}
            cancelClassName={products.cancelarBotonClase}
            modalClassName={products.confirmarClaseModal}
            onConfirm={() => void products.confirmarAccion()}
            onCancel={products.cancelarConfirmacion}
          />
        )}
      </main>
    )
  }

  return <LoginView onLogin={() => setIsLoggedIn(true)} />
}

export default App
