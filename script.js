const tg = window.Telegram.WebApp;
tg.expand();

const authScreen = document.getElementById('auth-screen');
const gameScreen = document.getElementById('game-screen');
const loginBtn = document.getElementById('login-btn');

// 🔍 Aquí pedimos el nombre del usuario a Telegram
const user = tg.initDataUnsafe?.user;

loginBtn.addEventListener('click', () => {
    authScreen.style.display = 'none';
    gameScreen.style.display = 'block';
    
    // Si Telegram nos dio el nombre, saludamos. Si no, usamos "Jugador".
    const name = user ? user.first_name : "Jugador";
    tg.showAlert(`¡Bienvenido, ${name}!`);
});
