    function getCartItems() {
        const itemsJson = localStorage.getItem('cartItems');
        return itemsJson ? JSON.parse(itemsJson) : [];
    }
    //Conteo
    function getCartCount() {
        const items = getCartItems();
        return items.reduce((total, item) => total + item.cantidad, 0);
    }
    
    //Actualizacion de productos
    function updateLocalStorage(updatedItems) {
        //Guarda la lista completa de artículos
        localStorage.setItem('cartItems', JSON.stringify(updatedItems));       
        //Calcula y guarda el conteo total
        const totalCount = updatedItems.reduce((total, item) => total + item.cantidad, 0);
        localStorage.setItem('cartCount', totalCount);  
        //Renderiza la vista, el total, y actualizar el contador del header
        renderCartItems();
        calculateAndRenderTotal(); 
        updateCartCounterDisplay(); 
        //Actualiza estado del botón de pago
        toggleCheckoutButton(updatedItems.length > 0);
    }

    function updateCartCounterDisplay() {
        const count = getCartCount();
        const counterElement = document.querySelector('.cart-badge'); 
        
        if (counterElement) {
            counterElement.textContent = count;
            counterElement.style.display = count > 0 ? 'inline-block' : 'none';
        }
    }

    //Funcuon de pago
    function completePurchase() {
        const totalElement = document.getElementById('cart-total');
        const finalAmount = totalElement ? totalElement.textContent.replace('Subtotal: ', '') : '$0.00';  
        //Vacia el carrito en localStorage
        localStorage.removeItem('cartItems');
        localStorage.setItem('cartCount', '0'); // Reiniciar el contador    
        //Actualiza el contador de la cabecera
        updateCartCounterDisplay(); 
        //Reemplaza el contenido de la página con el mensaje de éxito
        const mainContent = document.querySelector('.main-content');
        //Mensaje de exito
        mainContent.innerHTML = `
            <div style="text-align: center; padding: 100px 20px;">
                <i class="fas fa-check-circle" style="font-size: 4em; color: #27ae60; margin-bottom: 20px;"></i>
                <h2 style="color: #27ae60;">¡Compra Realizada con Éxito!</h2>
                <p style="font-size: 1.2em;">Tu pedido por un total de <b>${finalAmount}</b> ha sido procesado.</p>
                <a href="../menu.html" style="display: inline-block; margin-top: 30px; padding: 10px 20px; background-color: #3498db; color: white; text-decoration: none; border-radius: 5px;">
                    Volver al Inventario
                </a>
            </div>
        `;
    }
    
    //Mostrar boton de pago
    function toggleCheckoutButton(hasItems) {
        const button = document.getElementById('checkout-button');
        if (button) {
            button.disabled = !hasItems;
            button.style.opacity = hasItems ? '1.0' : '0.6';
            button.style.cursor = hasItems ? 'pointer' : 'not-allowed';
            if (hasItems) {
                button.addEventListener('click', completePurchase, { once: true });
            }
        }
    }

    //Calculo de precio
    function calculateAndRenderTotal() {
        const items = getCartItems();
        let subtotal = 0;

        items.forEach(item => {
            const priceString = item.precio ? item.precio.replace('$', '').replace(',', '') : '0';
            const price = parseFloat(priceString);

            if (!isNaN(price) && item.cantidad > 0) {
                subtotal += price * item.cantidad;
            }
        });
        const formattedTotal = subtotal.toLocaleString('es-MX', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
        //Muestra el total
        const totalElement = document.getElementById('cart-total');
        if (totalElement) {
            totalElement.textContent = `Subtotal: $${formattedTotal}`;
        }
        
        // Llama a la función para habilitar/deshabilitar el botón de pago
        toggleCheckoutButton(items.length > 0);
    }

    //Suma o resta de productos
    function handleCartAction(action, index) {
        let cartItems = getCartItems();
        
        if (index < 0 || index >= cartItems.length) {
            return;
        }
        switch (action) {
            case 'increase':
                cartItems[index].cantidad += 1;
                break;

            case 'decrease':
                cartItems[index].cantidad -= 1;
                
                if (cartItems[index].cantidad <= 0) {
                    cartItems.splice(index, 1);
                }
                break;        
            case 'delete':
                cartItems.splice(index, 1);
                break;
        }
        updateLocalStorage(cartItems);
    }

    // Creación del contenedor de articulos
    function generateCartItemHtml(item, index) {
        const rawPrice = item.precio ? item.precio.replace('$', '').replace(',', '') : '0';
        const formattedPrice = parseFloat(rawPrice).toFixed(2);
        const isDecreaseDisabled = item.cantidad <= 1;
        return `
            <div class="cart-item-card" data-id="${item.id}" data-index="${index}">
                <div class="quantity-controls">
                    <button class="qty-button" 
                            data-action="decrease" 
                            data-index="${index}" 
                            ${isDecreaseDisabled ? 'disabled' : ''}>-</button>
                    
                    <div class="qty-display">${item.cantidad}</div> 
                    
                    <button class="qty-button" data-action="increase" data-index="${index}">+</button>
                </div>
                
                <div class="item-image-container">
                    <img src="../${item.imagen}" alt="${item.nombre}">
                </div>        
                <div class="item-details">
                    <div class="item-name">${item.nombre}</div>
                    <div class="item-price">$${formattedPrice}</div> 
                    
                    <button class="delete-button" data-action="delete" data-index="${index}">Eliminar</button>
                </div>
            </div>
        `;
    }
    //Mostrar si esta vacio o no
    function renderCartItems() {
        const container = document.getElementById('cart-items-container');
        const items = getCartItems();

        if (items.length === 0) {
            // Si está vacío, también reemplazamos el summary
            const summary = document.getElementById('cart-summary');
            if(summary) summary.innerHTML = '';
            
            container.innerHTML = '<h2>Tu carrito de compras está vacío.</h2>';
            return;
        }
        const cartHtml = items.map((item, index) => generateCartItemHtml(item, index)).join('');    
        container.innerHTML = cartHtml;
    
        addCartButtonListeners();
    }
    //Boton de eliminar
    function addCartButtonListeners() {
        document.querySelectorAll('.qty-button, .delete-button').forEach(button => {
            button.removeEventListener('click', buttonClickHandler); 
            button.addEventListener('click', buttonClickHandler);
        });
    }
    
    function buttonClickHandler(event) {
        const button = event.currentTarget;
        const action = button.getAttribute('data-action');
        const index = parseInt(button.getAttribute('data-index'));

        if (action && !isNaN(index)) {
            handleCartAction(action, index);
        }
    }
    document.addEventListener('DOMContentLoaded', () => {
        updateCartCounterDisplay(); 
        renderCartItems();
        calculateAndRenderTotal(); 
    });

function getActiveUser() {
    const userJson = localStorage.getItem('activeUser');
    return userJson ? JSON.parse(userJson) : null;
}

//Info de cuenta
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

/**
 * Lógica para cerrar la sesión
 */
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

/**
 * Configura la visibilidad del menú desplegable y los eventos de clic.
 */
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
//Inicializa la pagina
document.addEventListener('DOMContentLoaded', () => {
    const activeUser = getActiveUser();
    if (activeUser) {

        renderAccountMenu(activeUser);
        setupAccountToggle(); 
    } else {
        window.location.href = '../../Inicio/index.html'; 
    }
});