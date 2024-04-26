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

form.addEventListener("submit", async function(event) {
    event.preventDefault();
    await enviarFormulario();
});

async function enviarFormulario() {
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

    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: formDataJSON
    };

    try {
        const response = await fetch("http://127.0.0.1:5500/pages/contacto.html", requestOptions);

        if (!response.ok) {
            throw new Error('Error al enviar los datos del formulario');
        }

        const data = await response.json();

        localStorage.setItem("formData", formDataJSON);

        Swal.fire({
            title: '¡Enviado!',
            text: 'Los datos del formulario se han enviado con éxito',
            icon: 'success',
            confirmButtonText: 'Aceptar'
        }).then(() => {
            form.reset();
        });
    } catch (error) {
        console.error('Error:', error);

        Swal.fire({
            title: 'Error',
            text: 'Hubo un error al enviar los datos del formulario',
            icon: 'error',
            confirmButtonText: 'Aceptar'
        });
    }
};

form.addEventListener("reset", async function(event) {
    event.preventDefault();
    await restablecerFormulario();
});

async function restablecerFormulario() {
    const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: '¿Quieres restablecer el formulario?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí',
        cancelButtonText: 'Cancelar'
    });

    result.isConfirmed && form.reset();
}
