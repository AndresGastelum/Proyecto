document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    // Función que simula la desencriptación
    function decryptPassword(encryptedPassword) {
        return atob(encryptedPassword); 
    }
    // Función para obtener las cuentas almacenadas
    function getStoredAccounts() {
        const accountsJson = localStorage.getItem('userAccounts');
        return accountsJson ? JSON.parse(accountsJson) : [];
    }
    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();
        // El valor del input con ID 'username'
        const username = document.getElementById('username').value.trim(); 
        const password = document.getElementById('password').value;

        if (username === '' || password === '') {
            alert('Por favor, completa ambos campos (Usuario y Contraseña).');
            return;
        }

        const storedAccounts = getStoredAccounts();   
        // Buscar el nombre de usuario
        const userAccount = storedAccounts.find(
            account => account.nombre.toLowerCase() === username.toLowerCase()
        );
        
        if (userAccount) {
            
            //Desencriptar la contraseña almacenada
            const decryptedPassword = decryptPassword(userAccount.password);
            
            //Comparar la contraseña ingresada
            if (password === decryptedPassword) {
                
                alert(`✅ ¡Bienvenido, ${userAccount.nombre}! Has iniciado sesión correctamente.`);
                
                //Storeage
                const activeSession = {
                    nombre: userAccount.nombre,
                    email: userAccount.email 
                };
                localStorage.setItem('activeUser', JSON.stringify(activeSession));           
                window.location.href = '../Menu/menu.html';             
                loginForm.reset();
                
            } else {
                alert('❌ Error: Contraseña incorrecta.');
            }
        } else {
            alert('❌ Error: Usuario no encontrado. Verifica tu nombre de usuario.');
        }
    });
});