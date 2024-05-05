let modalQt = 1;
const doc = (e) => document.querySelector(e);
const docAll = (e) => document.querySelectorAll(e);
let modalKey = 0;
let cart = [];
selectedSizePrice = pizzaJson[modalKey].price[2].toFixed(2);
console.log(selectedSizePrice)

pizzaJson.map((item, index) => {
    let pizzaItem = doc('.models .pizza-item').cloneNode(true);
    
    //Informações da página inicial
    pizzaItem.setAttribute('data-key', index);
    pizzaItem.querySelector('.pizza-item--img img').src = item.img;
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;

    //Informações do modal
    pizzaItem.querySelector('a').addEventListener('click', (e) => {
        e.preventDefault();
        let key = e.target.closest('.pizza-item').getAttribute('data-key');

        modalQt = 1;
        modalKey = key;

        //Selecionando elementos para mostrar no modal
        doc('.pizzaBig img').src = pizzaJson[key].img;
        doc('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        doc('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        let defaultPrice = pizzaJson[key].price[2];
        doc('.pizzaInfo--actualPrice').innerHTML = `R$ ${defaultPrice.toFixed(2)}`;
        doc('.pizzaInfo--size.selected').classList.remove('selected');
        docAll('.pizzaInfo--size').forEach((size, sizeIndex) => {
            if (sizeIndex == 2) {
                size.classList.add('selected');
            }
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
        });
        selectedSizePrice = defaultPrice;
        doc('.pizzaInfo--qt').innerHTML = modalQt;

        //Animação
        doc('.pizzaWindowArea').style.opacity = 0;
        doc('.pizzaWindowArea').style.display = 'flex';
        setTimeout(() => {
            doc('.pizzaWindowArea').style.opacity = 1;
        }, 200);
        //Fim animação
    });

    doc('.pizza-area').append(pizzaItem);
});

//Eventos do modal

//Fechar o modal 
function closeModal() {
    doc('.pizzaWindowArea').style.opacity = 0;
    setTimeout(() => {
        doc('.pizzaWindowArea').style.display = 'none';
    }, 500)
};
docAll('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item) => {
    item.addEventListener('click', closeModal);
});

//Aumentando e diminuindo a quantidade de pizzas
doc('.pizzaInfo--qtmenos').addEventListener('click', () => {
    if(modalQt > 1) {
        modalQt --
        doc('.pizzaInfo--qt').innerHTML = modalQt;
        let newTotalPrice = modalQt * selectedSizePrice;

        newTotalPrice = newTotalPrice < selectedSizePrice ? selectedSizePrice : newTotalPrice;

        doc('.pizzaInfo--actualPrice').innerHTML = `R$ ${newTotalPrice.toFixed(2)}`;
    }
});
doc('.pizzaInfo--qtmais').addEventListener('click', () => {
    
    modalQt ++
    doc('.pizzaInfo--qt').innerHTML = modalQt;
    newPrice = modalQt * selectedSizePrice;
    doc('.pizzaInfo--actualPrice').innerHTML = `R$ ${newPrice.toFixed(2)}`;

});

//Selecionando o tamanho da pizza
docAll('.pizzaInfo--size').forEach((size, sizeIndex) => {
    size.addEventListener('click', () => {
        doc('.pizzaInfo--qt').innerHTML = 1;
        selectedSizePrice = 0;
        modalQt = 1;

        doc('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');
        
        // Obtendo o preço do tamanho selecionado
        selectedSizePrice = pizzaJson[modalKey].price[sizeIndex];
        
        // Atualizando o preço no modal
        doc('.pizzaInfo--actualPrice').innerHTML = `R$ ${selectedSizePrice.toFixed(2)}`;
    })
});

//Adicionar ao carrinho
doc('.pizzaInfo--addButton').addEventListener('click', () => {
    
    let size = parseInt(doc('.pizzaInfo--size.selected').getAttribute('data-key'));
    //Criando um código para os produtos
    let identifier = pizzaJson[modalKey].id+'@'+size;
    //Verificando se os códigos são iguais
    let key = cart.findIndex((item) => item.identifier == identifier);
    //Se achar o código igual, ele modifica apenas a quantidade 
    if(key > -1) {
        cart[key].qt += modalQt;
    } 
    //Se não achar, é porque ainda não tem no carrinho e ele adiciona o produto completo   
    else {
        cart.push({
            identifier,
            id:pizzaJson[modalKey].id,
            size,
            qt:modalQt
        });
    };
    updateCart();
    closeModal();
});

doc('.menu-openner').addEventListener('click', () => {
    if(cart.length > 0) {
        doc('aside').style.left = '0';
    }
});
doc('.menu-closer').addEventListener('click', () => {
    doc('aside').style.left = '';
})

function updateCart() {
    doc('.menu-openner span').innerHTML = cart.length;

    if(cart.length > 0) {
        doc('aside').classList.add('show');
        doc('.cart').innerHTML = '';

        let subtotal = 0;
        let descount = 0;
        let total = 0;

        for(let i in cart) {
            let pizzaItem = pizzaJson.find((item) => item.id == cart[i].id);
            let selectedSizePrice = pizzaItem.price[cart[i].size];

            // Calcule o subtotal levando em consideração a quantidade
            subtotal += selectedSizePrice * cart[i].qt;

            let cartItem = doc('.models .cart--item').cloneNode(true);

            let pizzaSizeName;
            switch(cart[i].size) {
                case 0:
                    pizzaSizeName = 'Pequena';
                    break;
                case 1:
                    pizzaSizeName = 'Média';
                    break;
                case 2: 
                    pizzaSizeName = 'Grande';
                    break;
            }
            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;

            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
                if(cart[i].qt > 1) {
                    cart[i].qt--;
                    doc('.pizzaInfo--qt').innerHTML = modalQt;
                } else {
                    cart.splice(i, 1);
                }
                updateCart();
            });
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
                cart[i].qt++;
                updateCart();
            })

            doc('.cart').append(cartItem);
        }

        
        total = subtotal - descount;

        doc('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
        doc('.desconto span:last-child').innerHTML = `R$ ${descount.toFixed(2)}`;
        doc('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;
    } else {
        doc('aside').classList.remove('show');
        doc('aside').style.left = '100vw';
    }
}

//Quando clicar no carrinho e ele tiver vazio
doc('.menu-openner').addEventListener('click', () => {
    if (cart.length == 0) {
        alert('Carrinho vazio. Adicione itens no carrinho para visualizar!')
    } else {};
});

