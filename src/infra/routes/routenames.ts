export const route = {
  home: () => '/',
  queue: {
    home:      () => '/fila/',
    start:     () => '/fila/iniciar',
    manage:    () => '/fila/gerenciar',
    follow:    () => '/fila/acompanhando-pedido',
    following: (order_id: string) => `/fila/acompanhando-pedido/${order_id}`
  },
  auth: {
    register: () => '/auth/register',
    login:    () => '/auth/login',
    logout:   () => '/auth/logout'
  },
  products: {
    home: () => '/produtos',
    import: () => '/produtos/import',
    update: (product_id: string) => `/produtos/${product_id}`,
    template: () => '/asset/modelo-de-tabela-de-produtos.xlsx'
  }
}