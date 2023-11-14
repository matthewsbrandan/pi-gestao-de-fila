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
    renderCard(order)
  )
}
function renderCard(order){
  return `
    <div class="card" draggable="true" id="card-order-${order.id}">
      <div class="content">
        <span>#${order.id}</span>
        <small class="text-muted">
          ${order.name}
          ${order.device_id ? `
            <br/>
            <b style="font-size: .65rem;">DISPOSITIVO #${order.device_id}</b>
          `:''}
        </small>
      </div>
    </div>
  `
}
//#endregion HELPERS