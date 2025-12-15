document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registerForm');
    
    // Función que simula la encriptación
    function encryptPassword(password) {
        return btoa(password);
    }

    // Función para obtener las cuentas existentes
    function getStoredAccounts() {
        const accountsJson = localStorage.getItem('userAccounts');
        return accountsJson ? JSON.parse(accountsJson) : [];
    }
    
    // Manejo del formulario de registro
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const nombre = document.getElementById('nombre').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        if (!nombre || !email || !password) {
            alert('❌ Error: Complete todos los campos.');
            return;
        }
        let accounts = getStoredAccounts();
        //Se verifica el usuario
        if (accounts.some(account => account.nombre.toLowerCase() === nombre.toLowerCase())) {
            alert('⚠️ Advertencia: Ya existe un usuario registrado con este nombre. Intente con otro.');
            return;
        }
        //Se crea la cuenta
        const newAccount = {
            nombre: nombre,
            email: email,
            password: encryptPassword(password)
        };
        accounts.push(newAccount);
        localStorage.setItem('userAccounts', JSON.stringify(accounts));    
        alert('✅ ¡Usuario registrado correctamente!');
        form.reset();
    });
});