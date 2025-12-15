const JSON_FILE_URL = '../catalogo.json'; 

function getCartCount() {
    return parseInt(localStorage.getItem('cartCount') || '0', 10);
}

/**
 * @returns {Array<object>}
 */
function getCartItems() {
    const itemsJson = localStorage.getItem('cartItems');
    return itemsJson ? JSON.parse(itemsJson) : [];
}

function updateCartCounterDisplay() {
    const count = getCartCount();
    
    const counterElement = document.querySelector('.cart-badge'); 
    
    if (counterElement) {
        counterElement.textContent = count;
        counterElement.style.display = count > 0 ? 'inline-block' : 'none';
    }
}
//Se obtiene la id
function getProductIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    return id ? parseInt(id) : null;
}
/**
 * @param {object} product 
 */
function renderProductDetails(product) {
    //Imagen
    document.getElementById('product-image').src = '../' + product.imagen;
    document.getElementById('product-image').alt = `Imagen de ${product.nombre}`;
    //Info
    document.getElementById('nombre').textContent = product.nombre;
    document.getElementById('precio').textContent = product.precio;
    document.getElementById('fecha_lanzamiento').textContent = product.fecha_lanzamiento;
    document.getElementById('fabricante').textContent = product.fabricante;
    document.getElementById('dimensiones_peso').textContent = product.dimensiones_peso;
    document.getElementById('tiempo_envio').textContent = product.tiempo_envio;
    document.getElementById('descripcion').textContent = product.descripcion;
    document.getElementById('etiquetas').textContent = product.etiquetas.join(', '); 
}

/**
 * @param {object} product - El objeto completo del producto desde el JSON.
 */
function setupAddToCartButton(product) {
    const button = document.querySelector('.add-to-cart-button');
    if (button) {
        button.addEventListener('click', () => {
            let cartItems = getCartItems();
            const existingItemIndex = cartItems.findIndex(item => item.id === product.id);
            if (existingItemIndex > -1) {
                if (typeof cartItems[existingItemIndex].cantidad !== 'number') {
                     cartItems[existingItemIndex].cantidad = 0;
                }
                cartItems[existingItemIndex].cantidad += 1;
            } else {
                const newItem = {
                    id: product.id,
                    nombre: product.nombre,
                    precio: product.precio,
                    imagen: product.imagen,
                    cantidad: 1 
                };
                cartItems.push(newItem); 
            }
            //Conteo
            const totalCount = cartItems.reduce((total, item) => total + item.cantidad, 0);    
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
            localStorage.setItem('cartCount', totalCount);
            updateCartCounterDisplay();
        });
    }
}

//Busqueda de los datos.
async function loadProductDetails() {
    updateCartCounterDisplay(); 
    const contentDiv = document.querySelector('.main-content');
    const productId = getProductIdFromUrl();
    
    if (!productId) {
        contentDiv.innerHTML = "<h1>Error Crítico: ID de producto no especificado.</h1>";
        return;
    }
    try {
        const response = await fetch(JSON_FILE_URL);
        if (!response.ok) {
            throw new Error(`Error al cargar ${JSON_FILE_URL}. Código: ${response.status}`);
        }
        const productsData = await response.json();
        const product = productsData.find(p => p.id === productId);

        if (!product) {
            contentDiv.innerHTML = `<h1>Error de Búsqueda: Producto con ID ${productId} no encontrado en la base de datos.</h1>`;
            return;
        }
        renderProductDetails(product);
        setupAddToCartButton(product); 
    } catch (error) {
        console.error("Fallo la carga de datos:", error);
        contentDiv.innerHTML = `
            <h1>Error de Carga:</h1>

        `;
    }
}


document.addEventListener('DOMContentLoaded', loadProductDetails);
//Funciones sobre la cuenta
function getActiveUser() {
    const userJson = localStorage.getItem('activeUser');
    return userJson ? JSON.parse(userJson) : null;
}
function renderAccountMenu(user) {
    const menuContent = `
        <div class="dropdown-menu-header">
            <i class="fas fa-user-circle"></i>
            <div>
                <p style="font-weight: 700; color: #2c3e50;">${user.nombre}</p>
                <p style="color: #7f8c8d; font-size: 0.8em;">${user.email}</p>
            </div>
        </div>
        <button id="logoutButton" class="logout-button">Cerrar Sesión</button>
    `;
    document.getElementById('dropdownMenu').innerHTML = menuContent;
}
//Cerrar sesion
function setupLogout() {
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', () => { 
            localStorage.removeItem('cartItems');
            localStorage.setItem('cartCount', '0');
            localStorage.removeItem('activeUser');
            window.location.href = '../../Inicio/index.html'; 
        }, { once: true });
    }
}
function setupAccountToggle() {
    const accountToggle = document.getElementById('accountToggle');
    const dropdownMenu = document.getElementById('dropdownMenu');
    if (!accountToggle || !dropdownMenu) return;
    accountToggle.addEventListener('click', (e) => {
        e.stopPropagation(); 
        const isVisible = dropdownMenu.style.display === 'block';
        dropdownMenu.style.display = isVisible ? 'none' : 'block';
        if (!isVisible) {
            setupLogout(); 
        }
    });

    
    document.addEventListener('click', (e) => {
        if (!accountToggle.contains(e.target) && dropdownMenu.style.display === 'block') {
            dropdownMenu.style.display = 'none';
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const activeUser = getActiveUser();
    if (activeUser) {
        renderAccountMenu(activeUser);
        setupAccountToggle(); 
    } else {
        window.location.href = '../../Inicio/index.html'; 
    }
});