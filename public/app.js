const toCurrency = price => new Intl.NumberFormat('ru-RU', {
    currency: 'rub',
    style: 'currency'
}).format(price)

const toDate = date => new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
}).format(new Date(date))

document.querySelectorAll('.price').forEach(node => {
    node.textContent = toCurrency(node.textContent)
})

document.querySelectorAll('.date').forEach(node => {
    node.textContent = toDate(node.textContent)
})

const $card = document.querySelector('#card')
if($card) $card.addEventListener('click', event => {
    if(event.target.classList.contains('js-remove')) {
        const id = event.target.dataset.id
        fetch('/card/remove/' + id, {method: 'delete'})
            .then(result => result.json(card))
            .then(card => {
                if(card.courses.length) {
                    $card.querySelector('tbody').innerHTML = card.courses.map(course => `
                        <tr>
                            <td>${course.title}</td>
                            <td>${course.count}</td>
                            <td>
                                <button class="btn btn-small js-remove" data-id="${course.id}">REMOVE</button>
                            </td>
                        </tr>
                    `).join('')
                    $card.querySelector('.price').textContent = toCurrency(card.price)
                } else $card.innerHTML = '<p>CARD IS EMPTY</p>'
            })
    }
})
