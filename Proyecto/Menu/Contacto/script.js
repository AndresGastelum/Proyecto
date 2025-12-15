// Función para obtener los datos del usuario logueado
        function getActiveUser() {
            const userJson = localStorage.getItem('activeUser');
            return userJson ? JSON.parse(userJson) : null;
        }
        document.addEventListener('DOMContentLoaded', () => {
            const form = document.getElementById('contactForm');
            const nombreInput = document.getElementById('nombre');
            const emailInput = document.getElementById('email');
            const activeUser = getActiveUser();

            //Rellena campos si el usuario está activo
            if (activeUser) {
                nombreInput.value = activeUser.nombre;
                emailInput.value = activeUser.email;
                nombreInput.readOnly = true; 
                emailInput.readOnly = true;
            }

            //Función para actualizar el contador del carrito 
            function updateCartCounterDisplay() {
                const count = parseInt(localStorage.getItem('cartCount') || '0', 10);
                const counterElement = document.querySelector('.cart-badge'); 
                if (counterElement) {
                    counterElement.textContent = count;
                    counterElement.style.display = count > 0 ? 'inline-block' : 'none';
                }
            }
            updateCartCounterDisplay();

            //Maneja el envío del formulario
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                if (document.getElementById('mensaje').value.trim() === '') {
                    alert('❌ Error: El campo de mensaje es obligatorio.');
                    return;
                }
                alert('✅ Mensaje enviado con éxito. Te responderemos pronto.');
                // Limpia el campo de mensaje
                document.getElementById('mensaje').value = '';
            });
        });
        function getActiveUser() {
    const userJson = localStorage.getItem('activeUser');
    return userJson ? JSON.parse(userJson) : null;
}
//Info del usuario
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
 * Configura la visibilidad del menú desplegable
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

    //Cierra el menú si se hace clic en cualquier otro lado de la página
    document.addEventListener('click', (e) => {
        if (!accountToggle.contains(e.target) && dropdownMenu.style.display === 'block') {
            dropdownMenu.style.display = 'none';
        }
    });
}
//  Inicializa pagina
document.addEventListener('DOMContentLoaded', () => {
    const activeUser = getActiveUser();
    if (activeUser) {
        renderAccountMenu(activeUser);
        setupAccountToggle(); 
    } else {
        window.location.href = '../../Inicio/index.html'; 
    }
});