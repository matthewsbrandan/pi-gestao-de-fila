// DEPENDE DO SOCKET.ejs

function initDrag(){
  const cards = document.querySelectorAll('.card')
  
  cards.forEach(card => {
    card.addEventListener('dragstart', dragstart)
    card.addEventListener('drag', drag)
    card.addEventListener('dragend', dragend)
  })
}

const dropzones = document.querySelectorAll('.dropzone')
initDrag()

function dragstart() {
  dropzones.forEach(dropzone => dropzone.classList.add('highlight'))

  this.classList.add('is-dragging')
}

function drag(){ }

function dragend(e) {
  dropzones.forEach(dropzone => dropzone.classList.remove('highlight'))

  this.classList.remove('is-dragging')

  if(socket && e && e.target && e.target.id){
    const order = {
      id: e.target.id.replace('card-order-',''),
      status: e.target.parentElement.id.replace('dropzone-','')
    }
    socket.emit('updateOrder', order, (res) => {
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
}

dropzones.forEach(dropzone => {
  dropzone.addEventListener('dragenter', dragenter)
  dropzone.addEventListener('dragover', dragover)
  dropzone.addEventListener('dragleave', dragleave)
  dropzone.addEventListener('drop', drop)
})

function dragenter() { }

function dragover() {
  this.classList.add('over')

  const cardBeingDragged = document.querySelector('.is-dragging')

  this.appendChild(cardBeingDragged)
}

function dragleave() {
  this.classList.remove('over')
}

function drop() {
  this.classList.remove('over')
}