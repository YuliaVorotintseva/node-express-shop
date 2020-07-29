const toCurrency = price => new Intl.NumberFormat('ru-RU', {
    currency: 'rub',
    style: 'currency'
}).format(price)

document.querySelectorAll('.price').forEach(node => {
    node.textContent = toCurrency(node.textContent)
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
