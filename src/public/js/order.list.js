socket.on('previousOrders', (orders) => {
  orders.forEach((order) => renderOrder(order))

  if(initDrag) initDrag()
})

socket.on('receivedOrder', (order) => {
  renderOrder(order)

  if(initDrag) initDrag()
})

socket.on('removedOrder', (order_id) => {    
  const card = document.querySelector(`#card-order-${order_id}`)
  if(card) card.remove()
})

//#region HELPERS
function renderOrder(order){
  document.getElementById(`card-order-${order.id}`)?.remove()
  document.getElementById(`dropzone-${order.status}`).insertAdjacentHTML(
    'beforeend',
    renderCard(order.id)
  )
}
function renderCard(id){
  return `
    <div class="card" draggable="true" id="card-order-${id}">
      <div class="content">#<span>${id}</span></div>
    </div>
  `
}
//#endregion HELPERS