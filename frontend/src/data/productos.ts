export type ProductoMercado = {
  id: string
  nombre: string
  categoria: string
  precio: string
  variacion: string
  imagen: string
  stock: number
}

export const productosMercado: ProductoMercado[] = [
  {
    id: '1',
    nombre: 'Chocolate Block',
    categoria: 'Golosinas',
    precio: '$ 1.600',
    variacion: '+1.2%',
    imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR2d2wr9uXrF0u2uhZhW_LlsP6f4PRcmVRrMQ&s',
    stock: 38,
  },
  {
    id: '2',
    nombre: 'Coca Cola 1.25L',
    categoria: 'Bebidas',
    precio: '$ 1.200',
    variacion: '-0.4%',
    imagen: 'https://acdn-us.mitiendanube.com/stores/001/144/141/products/whatsapp-image-2021-06-11-at-19-36-03-11-88c69a6ccaa75978a716234511927730-1024-1024.webp',
    stock: 24,
  },
  {
    id: '3',
    nombre: 'Galletas María',
    categoria: 'Golosinas',
    precio: '$ 1.000',
    variacion: '+0.9%',
    imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcToe5_A0kFz8DcZrmD2KGVyGCROgecpLCb_KA&s',
    stock: 56,
  },
  {
    id: '4',
    nombre: 'Leche Descremada 1L',
    categoria: 'Lacteos',
    precio: '$ 1.500',
    variacion: '+2.1%',
    imagen: 'https://acdn-us.mitiendanube.com/stores/093/780/products/serenisima-clasica-751-95fea92d1a27f8e9ab15710914346750-640-0.webp',
    stock: 18,
  },
  {
    id: '5',
    nombre: 'Alfajor Chocolatoso',
    categoria: 'Golosinas',
    precio: '$ 1.000',
    variacion: '-1.1%',
    imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUz6_EWxQE3_ZN21sTl_bp-3K6Mm5MrdX-9w&s',
    stock: 42,
  },
  {
    id: '6',
    nombre: 'Papas Fritas Clasicas',
    categoria: 'Snacks',
    precio: '$ 1.350',
    variacion: '+0.5%',
    imagen: 'https://delimart.com.ar/user-content/5ce39747-1417-47dc-b2b8-ebb16ab62cba.jpg',
    stock: 29,
  },
  {
    id: '7',
    nombre: 'Yogur Frutilla',
    categoria: 'Lacteos',
    precio: '$ 980',
    variacion: '+0.3%',
    imagen: 'https://elnenearg.vtexassets.com/arquivos/ids/169000/YOGUR-LA-SERENISIMA-CLASICO-VAIN-X120GR-1-11787.jpg?v=638488245719230000',
    stock: 35,
  },
  {
    id: '8',
    nombre: 'Cafe Molido 500g',
    categoria: 'Despensa',
    precio: '$ 3.100',
    variacion: '-0.8%',
    imagen: 'https://images.pricely.ar/images/1/7790070933638.jpg',
    stock: 14,
  },
  {
    id: '9',
    nombre: 'Arroz Largo Fino 1kg',
    categoria: 'Despensa',
    precio: '$ 1.420',
    variacion: '+1.0%',
    imagen: 'https://argentinear.com.ar/wp-content/uploads/2025/04/4-9.png',
    stock: 63,
  },
  {
    id: '10',
    nombre: 'Jugo Naranja 1L',
    categoria: 'Bebidas',
    precio: '$ 1.100',
    variacion: '-0.2%',
    imagen: 'https://www.zanettigolosinas.com.ar/datos/uploads/mod_catalogo/32431/nartanja-6599494fc6dac_thumbnail.png?t=1704544591',
    stock: 21,
  },
]
