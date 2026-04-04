document.addEventListener("DOMContentLoaded", () => {
    // ELEMENTOS
    const musica = document.getElementById("musica");
    const playBtn = document.getElementById("playBtn");
    const nome = document.getElementById("nome");
    const dataInicio = new Date(2025, 6, 1, 0, 0, 0); // 01/07/2025

    // 1. CONTROLE DE MÚSICA
    if (playBtn && musica) {
        playBtn.addEventListener("click", () => {
            if (musica.paused) {
                musica.play().then(() => {
                    playBtn.classList.add('playing');
                }).catch(e => console.error("Erro ao tocar música:", e));
            } else {
                musica.pause();
                playBtn.classList.remove('playing');
            }
        });
    }

    // 2. CONTADOR
    function atualizarContador() {
        const agora = new Date();
        const diff = agora - dataInicio;
        const dias = Math.floor(diff / (1000 * 60 * 60 * 24));
        const horas = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutos = Math.floor((diff / (1000 * 60)) % 60);
        const segundos = Math.floor((diff / 1000) % 60);
        const display = document.getElementById("contador");
        if(display) display.innerHTML = `${dias} dias, ${horas}h ${minutos}m ${segundos}s`;
    }
    setInterval(atualizarContador, 1000);
    atualizarContador();

    // 3. DIGITAÇÃO
    function efeitoDigitar(elemento) {
        const textoCompleto = elemento.innerHTML;
        elemento.innerHTML = '';
        elemento.style.opacity = '1';
        elemento.style.visibility = 'visible';
        let i = 0;
        const timer = setInterval(() => {
            if (i < textoCompleto.length) {
                if (textoCompleto.charAt(i) === '<') { 
                    i = textoCompleto.indexOf('>', i) + 1; 
                } else { i++; }
                elemento.innerHTML = textoCompleto.substring(0, i);
            } else { clearInterval(timer); }
        }, 80); 
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const textos = entry.target.querySelectorAll('.digitar');
                textos.forEach(texto => {
                    if (!texto.classList.contains('feito')) { 
                        texto.classList.add('feito'); 
                        efeitoDigitar(texto); 
                    }
                });
                const cor = entry.target.getAttribute('data-cor');
                if(cor && playBtn) {
                    playBtn.style.color = cor;
                    playBtn.style.borderColor = cor;
                }
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('section').forEach(sec => observer.observe(sec));

    // 4. EFEITO NO NOME
    if (nome) {
        nome.addEventListener("mouseover", () => nome.textContent = "VOID 2P");
        nome.addEventListener("mouseout", () => nome.textContent = "CHAVE DE SANGUE");
    }

    // 5. RASTRO DO MOUSE - AGORA COM MORCEGOS
    document.addEventListener("mousemove", (e) => {
        let bat = document.createElement("div");
        bat.className = "mouse-bat";
        bat.innerHTML = "🦇";
        bat.style.left = e.clientX + "px";
        bat.style.top = e.clientY + "px";
        document.body.appendChild(bat);
        setTimeout(() => bat.remove(), 700);
    });

    // 6. EASTER EGG (3 Cliques ou 5 Segundos)
    const secretTrigger = document.getElementById("secret-trigger");
    let clickCount = 0;
    let clickTimer;
    let pressTimer;

    if (secretTrigger) {
        secretTrigger.addEventListener("click", () => {
            clickCount++;
            clearTimeout(clickTimer);
            if (clickCount === 3) {
                clickCount = 0;
                ativarSegredo();
            } else {
                clickTimer = setTimeout(() => { clickCount = 0; }, 1000);
            }
        });

        secretTrigger.addEventListener("mousedown", () => pressTimer = setTimeout(ativarSegredo, 5000));
        secretTrigger.addEventListener("mouseup", () => clearTimeout(pressTimer));
        secretTrigger.addEventListener("mouseleave", () => clearTimeout(pressTimer));
        
        // Touch mobile
        secretTrigger.addEventListener("touchstart", (e) => {
            e.preventDefault();
            pressTimer = setTimeout(ativarSegredo, 5000);
        });
        secretTrigger.addEventListener("touchend", () => clearTimeout(pressTimer));
    }

    function ativarSegredo() {
        document.body.classList.add('fade-out-secret');
        setTimeout(() => {
            window.location.href = "segredo.html";
        }, 1200);
    }
});

// FUNÇÕES GLOBAIS
function transicao(event, destino) {
    event.preventDefault();
    const overlay = document.getElementById("transitionOverlay");
    overlay.style.opacity = "0.6";
    setTimeout(() => {
        document.getElementById(destino).scrollIntoView({ behavior: "smooth" });
        overlay.style.opacity = "0";
    }, 600);
}

function ampliarMidia(elemento) {
    const overlay = document.getElementById('overlay');
    const content = document.getElementById('overlayContent');
    const textoDestino = document.getElementById('textoOverlay'); // Alvo do texto
    const section = elemento.closest('section');
    const corGlow = section.getAttribute('data-cor');

    // Limpa o conteúdo anterior, mas mantém o parágrafo de texto
    content.innerHTML = '<p id="textoOverlay"></p>';
    const novoTextoDestino = content.querySelector('#textoOverlay');

    let midiaOriginal = elemento.querySelector('img, video');
    if (!midiaOriginal) return;

    // Clona a mídia
    let midiaClonada = midiaOriginal.cloneNode(true);
    if (midiaClonada.tagName === 'VIDEO') {
        midiaClonada.muted = false;
        midiaClonada.controls = true;
        midiaClonada.play();
    }

    midiaClonada.style.boxShadow = `0 0 50px ${corGlow}`;
    midiaClonada.classList.add('midia-ampliada');
    content.insertBefore(midiaClonada, content.firstChild);
    
    overlay.style.display = 'flex';

    // VERIFICAÇÃO DO TEXTO DIGITALIZADO
    const textoFonte = elemento.querySelector('.texto-secreto');
    if (textoFonte) {
        const conteudoParaDigitar = textoFonte.textContent.trim();
        novoTextoDestino.classList.add('digitar-overlay');
        novoTextoDestino.style.color = corGlow; // Usa a cor da seção (Rosa)
        
        // Dispara o efeito de digitação que você já tem no JS
        let i = 0;
        novoTextoDestino.innerHTML = '';
        const timer = setInterval(() => {
            if (i < conteudoParaDigitar.length) {
                novoTextoDestino.innerHTML += conteudoParaDigitar.charAt(i);
                i++;
            } else {
                clearInterval(timer);
            }
        }, 60); // Velocidade da digitação no zoom
    }
}

function fecharMidia() {
    const overlay = document.getElementById('overlay');
    const vid = overlay.querySelector('video');
    if (vid) vid.pause();
    overlay.style.display = 'none';
}