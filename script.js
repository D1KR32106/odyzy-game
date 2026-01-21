// 1. CONEXIÓN
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
let miRol = null; 

// 2. INICIO Y BUSQUEDA DE RIVAL
loginBtn.addEventListener('click', async () => {
    authScreen.style.display = 'none';
    gameScreen.style.display = 'block';
    
    const user = tg.initDataUnsafe?.user;
    const userId = user ? user.id.toString() : "user_" + Math.floor(Math.random() * 1000);
    
    tg.showAlert("Buscando oponente...");
    buscarPartida(userId);
});

async function buscarPartida(userId) {
    const { data: partida } = await _supabase
        .from('partidas')
        .select('*')
        .eq('estado', 'esperando')
        .limit(1).single();

    if (partida) {
        partidaId = partida.id;
        miRol = 'jugador_2';
        await _supabase.from('partidas').update({ jugador_2_id: userId, estado: 'jugando' }).eq('id', partidaId);
        tg.showAlert("¡Rival encontrado! Haz tu jugada.");
    } else {
        miRol = 'jugador_1';
        const { data: nueva } = await _supabase.from('partidas').insert([{ jugador_1_id: userId, estado: 'esperando' }]).select().single();
        partidaId = nueva.id;
        tg.showAlert("Esperando a un rival...");
    }
    escucharPartida(); 
}

// 3. ENVIAR JUGADA
document.querySelectorAll('.choice-btn').forEach(boton => {
    boton.addEventListener('click', async () => {
        const eleccion = boton.innerText; // Guarda el emoji
        const campo = (miRol === 'jugador_1') ? 'jugada_1' : 'jugada_2';

        await _supabase.from('partidas').update({ [campo]: eleccion }).eq('id', partidaId);
        tg.showAlert("Jugada enviada. Esperando al rival...");
    });
});

// 4. TIEMPO REAL Y RESULTADO
function escucharPartida() {
    _supabase
        .channel('partida-' + partidaId)
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'partidas', filter: `id=eq.${partidaId}` }, payload => {
            const p = payload.new;
            if (p.jugada_1 && p.jugada_2) {
                determinarGanador(p.jugada_1, p.jugada_2);
            }
        })
        .subscribe();
}

function determinarGanador(j1, j2) {
    let res = "";
    if (j1 === j2) res = "¡Empate! 🤝";
    else if ((j1==='✊'&&j2==='✌️') || (j1==='✋'&&j2==='✊') || (j1==='✌️'&&j2==='✋')) {
        res = (miRol === 'jugador_1') ? "¡GANASTE! 🎉" : "Perdiste... 💀";
    } else {
        res = (miRol === 'jugador_2') ? "¡GANASTE! 🎉" : "Perdiste... 💀";
    }

    tg.showConfirm(`${res}\nTú: ${miRol==='jugador_1'?j1:j2}\nRival: ${miRol==='jugador_1'?j2:j1}`, () => {
        location.reload(); 
    });
}
