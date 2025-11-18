const socket = io()

socket.on('productList', (products) => {
  const list = document.getElementById('productList')
  list.innerHTML = ''

  products.forEach(p => {
    const li = document.createElement('li')
    li.innerHTML = `<strong>${p.title}</strong> - $${p.price}`
    list.appendChild(li)
  })
})
