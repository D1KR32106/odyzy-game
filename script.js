// 1. Conectamos con Telegram para que la app sepa que está dentro del chat
const tg = window.Telegram.WebApp;
tg.expand(); // Esto hace que la app se abra en pantalla completa

// 2. Seleccionamos los "interruptores" y las "habitaciones" (elementos del HTML)
const authScreen = document.getElementById('auth-screen');
const gameScreen = document.getElementById('game-screen');
const loginBtn = document.getElementById('login-btn');

// 3. El cableado: ¿Qué pasa al hacer clic?
loginBtn.addEventListener('click', () => {
    // Ocultamos la pantalla de inicio (apagamos la luz de esa habitación)
    authScreen.style.display = 'none';
    
    // Mostramos la pantalla de juego (encendemos la luz de la otra)
    gameScreen.style.display = 'block';
    
    // Le mandamos un aviso al usuario usando el sistema de Telegram
    tg.showAlert("¡Bienvenido al juego!");
});
