// 1. CONEXIÓN: Usa los datos de tu pantalla de Supabase (Project URL y API Key anon)
const SUPABASE_URL = "https://opzzggqgspjonzgkorot.supabase.co"; 
const SUPABASE_KEY = "sb_publishable_tF3Boa0ln8ZjFiH663jF_g_wu3NpjDv";

const { createClient } = supabase;
const _supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// 2. ELEMENTOS: Lo que ya tenías configurado
const tg = window.Telegram.WebApp;
tg.expand();

const authScreen = document.getElementById('auth-screen');
const gameScreen = document.getElementById('game-screen');
const loginBtn = document.getElementById('login-btn');

const user = tg.initDataUnsafe?.user;

// 3. LÓGICA: Al presionar el botón
loginBtn.addEventListener('click', async () => {
    // Cambiamos la habitación (pantalla)
    authScreen.style.display = 'none';
    gameScreen.style.display = 'block';
    
    const name = user ? user.first_name : "Jugador";
    
    // Probamos la conexión enviando un aviso
    console.log("Conectado a la base de datos de Odyzy");
    tg.showAlert(`¡Bienvenido, ${name}! Ya estás en línea.`);
});
