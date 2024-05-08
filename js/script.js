const nav = document.querySelector("#nav");
const abrir = document.querySelector("#abrir");
const cerrar = document.querySelector("#cerrar");

abrir.addEventListener("click", () => {
    nav.classList.add("visible");
});

cerrar.addEventListener("click", () => {
    nav.classList.remove("visible");
});

const btnCart = document.querySelector('.container-cart-icon');
const containerCartProducts = document.querySelector('.container-cart-products');
const cartInfo = document.querySelector('.container-cart-products .row-product');
const rowProduct = document.querySelector('.row-product');
const valorTotal = document.querySelector('.total-pagar');
const countProducts = document.querySelector('#contador-productos');
const cartEmpty = document.querySelector('.cart-empty');
const cartTotal = document.querySelector('.cart-total');

let allProducts = [];

function showHTML() {
    rowProduct.innerHTML = '';
    let total = 0;
    let totalOfProducts = 0;

    allProducts.forEach(product => {
        const containerProduct = document.createElement('div');
        containerProduct.classList.add('cart-product');

        containerProduct.innerHTML = `
            <div class="info-cart-product">
                <span class="cantidad-producto-carrito">${product.quantity}</span>
                <p class="titulo-producto-carrito">${product.title}</p>
                <span class="precio-producto-carrito">${product.price}</span>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon-close">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
        `;

        rowProduct.appendChild(containerProduct);

        total += parseInt(product.quantity) * parseFloat(product.price.slice(1));
        totalOfProducts += product.quantity;
    });

    valorTotal.innerText = `$${total.toFixed(2)}`;
    countProducts.innerText = totalOfProducts;

    if (!allProducts.length) {
        cartEmpty.classList.remove('hidden');
        rowProduct.classList.add('hidden');
        cartTotal.classList.add('hidden');
    } else {
        cartEmpty.classList.add('hidden');
        rowProduct.classList.remove('hidden');
        cartTotal.classList.remove('hidden');
    }
}

btnCart.addEventListener('click', () => {
    containerCartProducts.classList.toggle('hidden-cart');
});

const productsList = document.querySelector('.products');
productsList.addEventListener('click', e => {
    if (e.target.classList.contains('botones-de-enlace')) {
        const product = e.target.parentElement;

        const infoProduct = {
            quantity: 1,
            title: product.querySelector('h3').textContent,
            price: product.querySelector('p').textContent,
        };

        const exists = allProducts.some(product => product.title === infoProduct.title);

        exists ? (() => {
            const products = allProducts.map(product => product.title === infoProduct.title ? { ...product, quantity: product.quantity + 1 } : product);
            allProducts = [...products];
        })() : (() => {
            allProducts = [...allProducts, infoProduct];
        })();

        showHTML();
    }
});

const rowProducts = document.querySelector('.row-product');

rowProducts && rowProducts.addEventListener('click', e => {
    e.target.classList.contains('icon-close') && (() => {
        const title = e.target.parentElement.querySelector('p').textContent;
        allProducts = allProducts.filter(product => product.title !== title);
        showHTML();
    })();
});

const form = document.getElementById("formulario-contacto");

form.addEventListener("submit", function(event) {
    event.preventDefault();
    enviarFormulario();
});

function enviarFormulario() {
    const nombre = form.querySelector("#nombre").value;
    const email = form.querySelector("#email").value;
    const telefono = form.querySelector("#tel").value;
    const consulta = form.querySelector("#consulta").value;

    const formData = {
        Nombre: nombre,
        Email: email,
        Telefono: telefono,
        Consulta: consulta
    };

    const formDataJSON = JSON.stringify(formData);

    const url = 'http://127.0.0.1:5500/pages/contacto.html'; 

    
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                console.log('Respuesta del servidor:', response);
                mostrarNotificacion('¡Formulario enviado correctamente!');
            } else {
                console.error('Error al enviar el formulario:', xhr.statusText);
                mostrarNotificacion('Error al enviar el formulario', 'error');
                
            }
        }
    };

    xhr.send(formDataJSON);
}

function mostrarNotificacion(mensaje, tipo) {
    Toastify({
        text: mensaje,
        duration: 3000,
        close: true,
        gravity: "top",
        backgroundColor: tipo === 'success' ? "green" : "red",
    }).showToast();
}
