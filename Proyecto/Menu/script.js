const JSON_URL = 'catalogo.json'; 
/**
 * Función que lee el número guardado en la memoria del navegador 
 * @returns {number} 
 */
function getCartCount() {
    return parseInt(localStorage.getItem('cartCount') || '0', 10);
}

function updateCartCounterDisplay() {
    const count = getCartCount();
    const counterElement = document.querySelector('.cart-badge'); 
    if (counterElement) {
        counterElement.textContent = count;
        counterElement.style.display = count > 0 ? 'inline-block' : 'none';
    }
}
document.addEventListener('DOMContentLoaded', () => {
    updateCartCounterDisplay(); 
});
        async function loadProducts() {
            const container = document.getElementById('products-container');
            
                // Petición al archivo JSON
                const response = await fetch(JSON_URL);
                if (!response.ok) {
                    throw new Error(`Error HTTP: ${response.status}`);
                }
                const productsData = await response.json(); 

                let htmlContent = '';

                productsData.forEach(product => {
                    htmlContent += `
                        <div class="product-card">
                            <img src="${product.imagen}" alt="${product.nombre}" class="product-image">
                            
                            <div class="product-name">${product.nombre}</div>
                            <div class="product-price">${product.precio}</div>
                            <a href="Detalles/detalles.html?id=${product.id}" class="details-button">Ver detalles</a>
                        </div>
                    `;
                });
                container.innerHTML = htmlContent;         
        }
        document.addEventListener('DOMContentLoaded', loadProducts);
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
function setupLogout() {
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', () => { 
            localStorage.removeItem('cartItems');
            localStorage.setItem('cartCount', '0');
            localStorage.removeItem('activeUser');
            window.location.href = '../Inicio/index.html'; 
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
        window.location.href = '../Inicio/index.html'; 
    }
});