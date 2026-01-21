// 1. CONEXIÓN: Usa los datos de tu pantalla de Supabase (Project URL y API Key anon)
const SUPABASE_URL = "https://opzzggqgspjonzgkorot.supabase.co"; 
const SUPABASE_KEY = "sb_publishable_tF3Boa0ln8ZjFiH663jF_g_wu3NpjDv";

const { createClient } = supabase;
const _supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const tg = window.Telegram.WebApp;
tg.expand();

const authScreen = document.getElementById('auth-screen');
const gameScreen = document.getElementById('game-screen');
const loginBtn = document.getElementById('login-btn');

let partidaId = null;
let miRol = null; // Será 'jugador_1' o 'jugador_2'

loginBtn.addEventListener('click', async () => {
    authScreen.style.display = 'none';
    gameScreen.style.display = 'block';
    
    const user = tg.initDataUnsafe?.user;
    const userId = user ? user.id.toString() : "anonimo_" + Math.random();
    
    tg.showAlert("Buscando oponente...");
    buscarPartida(userId);
});

async function buscarPartida(userId) {
    // 1. Intentar unirse a una partida que ya esté esperando
    const { data: partidasEsperando } = await _supabase
        .from('partidas')
        .select('*')
        .eq('estado', 'esperando')
        .limit(1)
        .single();

    if (partidasEsperando) {
        // Encontramos una partida, nos unimos como jugador 2
        partidaId = partidasEsperando.id;
        miRol = 'jugador_2';
        
        await _supabase
            .from('partidas')
            .update({ 
                jugador_2_id: userId,
                estado: 'jugando' 
            })
            .eq('id', partidaId);
            
        tg.showAlert("¡Rival encontrado! Empieza el juego.");
    } else {
        // No hay partidas, creamos una nueva como jugador 1
        miRol = 'jugador_1';
        const { data: nuevaPartida } = await _supabase
            .from('partidas')
            .insert([{ 
                jugador_1_id: userId, 
                estado: 'esperando' 
            }])
            .select()
            .single();
            
        partidaId = nuevaPartida.id;
        tg.showAlert("Esperando a un oponente...");
    }
}
