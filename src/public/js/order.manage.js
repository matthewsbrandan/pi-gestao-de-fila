function updateOrder({ id, status }){    
  socket.emit('updateOrder', { id, status }, (res) => {
    if(!res.result){
      notify('error', res.response)
      return;
    }

    renderOrder(res.data)
    if(res.data.status === 'withdrawn') setTimeout(() => {
      const card = document.querySelector(
        `#dropzone-withdrawn #card-order-${res.data.id}`
      )
      if(card) card.remove()
    }, 15 * 1000)

    if(initDrag) initDrag()
  })
}
function addOrder(name){
  socket.emit('addOrder', { status: 'pending', name, queue_id }, (res) => {
    if(!res.result){
      notify('error', res.response)
      return;
    }

    notify('success', res.response)

    renderOrder(res.data)

    if(initDrag) initDrag()

    if(closeModalAddOrder) closeModalAddOrder()
  })
}