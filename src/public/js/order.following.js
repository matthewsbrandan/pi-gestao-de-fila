if(order_id){
  socket.on(`order_id:${order_id}`, (order) => {
    const titleEl = document.querySelector('#container-follow-data h1')
    const subtitleEl = document.querySelector('#container-follow-data .lead')

    if(order.type === 'pending'){
      titleEl.innerHTML = `Aguardando Pedido <span class="text-primary">#${data.order_id}</span>`;
      subtitleEl.innerHTML =`Seu pedido está sendo preparado...`;
    }else
    if(data.order.status === 'finished'){
      titleEl.innerHTML = `<span class="title">Pronto para retirada</span><span class="text-primary">#${data.order.id}</span>`
      subtitleEl.innerHTML = `Retire seu pedido`
      
    }else
    if(order.type === 'withdrawn'){
      titleEl.innerHTML = `<span class="title">Retirado</span><span class="text-primary">#${data.order.id}</span>`
      subtitleEl.innerHTML = `Seu pedido já foi retirado`
    }      
  })
}