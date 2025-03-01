import menuArray from './data.js'

const menuList = document.querySelector('.menu__list')

function renderMenuList() {
    menuList.innerHTML = menuArray
        .map(
            (item) => `
        <div class="menu__item" data-id=${item.id}>
            <div class="menu__item-preview">
                <img class="menu__item-img" src="./images/${
                    item.name
                }.png" alt="pizza">
            </div>
            <div class="menu__item-info">
                <h4 class="menu__item-title">${item.name}</h4>
                <p class="menu__item-ingredients">${item.ingredients.join(
                    ', '
                )}</p>
                <p class="menu__item-price">$${item.price}</p>
            </div>
            <button class="menu__item-button"><span class="add">+</span><span class="remove">-</span></button>
        </div>
        `
        )
        .join('')
}

renderMenuList()

const formModal = document.getElementById('form-modal')
const rateModal = document.getElementById('rate-modal')

window.addEventListener('click', (e) => {
    const parent = e.target.parentElement

    // Check if user has clicked add or remove button
    if (parent?.classList.contains('menu__item-button')) {
        const menuItem = e.target.closest('.menu__item')

        if (e.target.classList.contains('add')) {
            // Change to remove button
            e.target.style.display = 'none'
            parent.querySelector('.remove').style.display = 'block'

            updateOrderList(menuItem.dataset.id, 'add')
        } else {
            // Change to add button
            e.target.style.display = 'none'
            parent.querySelector('.add').style.display = 'block'

            updateOrderList(menuItem.dataset.id, 'remove')
        }
    } else if (e.target.classList.contains('order__list-btn')) {
        // Check if user has clicked remove button inside order section
        updateOrderList(parent.dataset.id, 'remove')

        const menuItem = document.querySelector(
            `.menu__item[data-id='${parent.dataset.id}']`
        )

        const addButton = menuItem.querySelector('.add')
        const removeButton = menuItem.querySelector('.remove')

        addButton.style.display = 'block'
        removeButton.style.display = 'none'
    } else if (e.target.id === 'complete-btn') {
        formModal.classList.add('show')
    } else if (e.target.id === 'pay-btn') {
        e.preventDefault()
        formModal.classList.remove('show')

        const addButtons = document.querySelectorAll('.add')
        const removeButtons = document.querySelectorAll('.remove')

        addButtons.forEach((button) => (button.style.display = 'block'))
        removeButtons.forEach((button) => (button.style.display = 'none'))

        const nameInput = document.getElementById('input-name')

        const message = document.querySelector('.complete-message')
        message.textContent = `Thanks, ${nameInput.value}! Your order is on its way!`

        message.classList.add('show')

        updateOrderList(0, 'remove-all')

        // Show rating after 1s
        setTimeout(() => {
            rateModal.classList.add('show')
        }, 1000)
    } else if (e.target.closest('.rate__list-item')) {
        const starItem = e.target.closest('.rate__list-item')
        const rateList = starItem.parentElement

        const index = Array.from(rateList.children).indexOf(starItem)

        const paths = document.querySelectorAll('path')

        for (let i = 0; i < index + 1; i++) {
            paths[i].style.fill = '#ed8a19'
        }

        const rateText = document.querySelector('.rate__text')

        rateText.style.display = 'block'

        setTimeout(() => {
            rateModal.classList.remove('show')
        }, 1000)
    }
    handleOrderSection()
})

const orderSection = document.querySelector('.order')
const orderList = document.querySelector('.order__list')

function handleOrderSection() {
    if (orderList.children.length) {
        orderSection.classList.add('show')
    } else {
        orderSection.classList.remove('show')
    }
}

let orderListArr = []

function updateOrderList(id, action) {
    const menuItem = menuArray[id]

    if (action === 'add') {
        orderListArr.push(menuItem)
    } else if (action === 'remove') {
        const index = orderListArr.indexOf(menuItem)

        orderListArr.splice(index, 1)
    } else if (action === 'remove-all') {
        orderListArr = []
    }
    orderList.innerHTML = orderListArr
        .map(
            (item) => `
            <li class="order__list-item" data-id=${item.id}>
                <p class="order__list-name">${item.name}</p>
                <button class="order__list-btn">remove</button>
                <p class="order__list-price">$${item.price}</p>
            </li>
        `
        )
        .join('')

    updateTotalPrice(orderListArr)
}

function updateTotalPrice(arr) {
    const totalPrice = document.querySelector('.order__total-price')

    if (
        arr.find((e) => e.name === 'Beer') &&
        (arr.find((e) => e.name === 'Pizza') ||
            arr.find((e) => e.name === 'Hamburger'))
    ) {
        totalPrice.textContent = `You got $5 'meal deal' discount: $${
            arr.reduce(
                (totalPrice, currentElem) => totalPrice + currentElem.price,
                0
            ) - 5
        }`
    } else {
        totalPrice.textContent = `$${arr.reduce(
            (totalPrice, currentElem) => totalPrice + currentElem.price,
            0
        )}`
    }
}
