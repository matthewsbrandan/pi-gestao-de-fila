export const route = {
  home: () => '/',
  queue: {
    home:      () => '/fila/',
    start:     () => '/fila/iniciar',
    manage:    () => '/fila/gerenciar',
    follow:    () => '/fila/acompanhando-pedido',
    following: (order_id: string) => `/fila/acompanhando-pedido/${order_id}`
  }
}