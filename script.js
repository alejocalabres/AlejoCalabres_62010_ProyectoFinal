document.addEventListener('DOMContentLoaded', () => {
    const productosContainer = document.getElementById('productos');
    const carritoContainer = document.getElementById('lista-carrito');
    const totalContainer = document.getElementById('total');
    const botonComprar = document.getElementById('comprar');

    let carrito = [];

    // Cargar carrito desde localStorage
    function cargarCarrito() {
        const carritoGuardado = localStorage.getItem('carrito');
        if (carritoGuardado) {
            carrito = JSON.parse(carritoGuardado);
            actualizarCarrito();
        }
    }

    // Guardar carrito en localStorage
    function guardarCarrito() {
        localStorage.setItem('carrito', JSON.stringify(carrito));
    }

    // Fetch de productos
    fetch('productos.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log(data);  // Verifica que los datos se estén cargando
            mostrarProductos(data);
        })
        .catch(error => console.error('Error al cargar productos:', error));

    function mostrarProductos(productos) {
        productos.forEach(producto => {
            const productoElement = document.createElement('article');
            productoElement.innerHTML = `
                <img src="${producto.imagen}" alt="${producto.nombre}">
                <div>
                    <h3>${producto.nombre}</h3>
                    <p>$${producto.precio.toFixed(2)}</p>
                    <button data-id="${producto.id}">Agregar al carrito</button>
                </div>
            `;
            productosContainer.appendChild(productoElement);

            const botonAgregar = productoElement.querySelector('button');
            botonAgregar.addEventListener('click', () => agregarAlCarrito(producto));
        });
    }

    function agregarAlCarrito(producto) {
        const productoEnCarrito = carrito.find(item => item.id === producto.id);
        if (productoEnCarrito) {
            productoEnCarrito.cantidad++;
        } else {
            carrito.push({ ...producto, cantidad: 1 });
        }
        actualizarCarrito();
        guardarCarrito();
    }

    function eliminarDelCarrito(productoId) {
        carrito = carrito.filter(item => item.id !== productoId);
        actualizarCarrito();
        guardarCarrito();
    }

    function actualizarCarrito() {
        carritoContainer.innerHTML = '';
        let total = 0;

        carrito.forEach(item => {
            const itemElement = document.createElement('li');
            itemElement.innerHTML = `
                <img src="${item.imagen}" alt="${item.nombre}">
                <span>${item.nombre} - ${item.cantidad} x $${item.precio.toFixed(2)}</span>
                <button data-id="${item.id}">Eliminar</button>
            `;
            carritoContainer.appendChild(itemElement);

            const botonEliminar = itemElement.querySelector('button');
            botonEliminar.addEventListener('click', () => eliminarDelCarrito(item.id));

            total += item.cantidad * item.precio;
        });

        totalContainer.textContent = `$${total.toFixed(2)}`;
    }

    botonComprar.addEventListener('click', () => {
        if (carrito.length === 0) {
            Swal.fire('El carrito está vacío', 'Por favor agrega productos antes de comprar.', 'warning');
        } else {
            Swal.fire('Compra realizada', 'Gracias por tu compra!', 'success');
            carrito = [];
            actualizarCarrito();
            guardarCarrito();
        }
    });

    cargarCarrito();
});
