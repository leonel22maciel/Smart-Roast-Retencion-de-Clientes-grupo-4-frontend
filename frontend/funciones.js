// ===== SCROLL BUTTON =====
const btnArriba = document.getElementById("btn-arriba");
if (btnArriba) {
    window.addEventListener("scroll", () => {
        if (window.scrollY > 250) {
            btnArriba.classList.add("mostrar");
        } else {
            btnArriba.classList.remove("mostrar");
        }
    });

    btnArriba.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}

// ===== SIMPLE AUTH (localStorage) =====
const DB_KEY = 'smartroast_users';

function getUsers() {
    const users = localStorage.getItem(DB_KEY);
    return users ? JSON.parse(users) : [];
}

function saveUsers(users) {
    localStorage.setItem(DB_KEY, JSON.stringify(users));
}

function getCurrentUser() {
    const user = localStorage.getItem('smartroast_currentUser');
    return user ? JSON.parse(user) : null;
}

function setCurrentUser(user) {
    if (user) localStorage.setItem('smartroast_currentUser', JSON.stringify(user));
    else localStorage.removeItem('smartroast_currentUser');
}

function showMessage(element, message, isError = false) {
    if (!element) return;
    const messageDiv = document.createElement('div');
    messageDiv.className = isError ? 'error-message' : 'success-message';
    messageDiv.textContent = message;
    const existing = element.querySelector('.error-message, .success-message');
    if (existing) existing.remove();
    element.appendChild(messageDiv);
    setTimeout(() => messageDiv.remove(), 3000);
}

// UI elements (may not exist on all pages)
const btnLogin = document.getElementById('btnLogin');
const btnLogout = document.getElementById('btnLogout');
const userPanel = document.getElementById('userPanel');
const userName = document.getElementById('userName');

function updateUI() {
    const currentUser = getCurrentUser();
    if (currentUser) {
        if (btnLogin) btnLogin.style.display = 'none';
        if (userPanel) userPanel.classList.add('active');
        if (userName) userName.textContent = `Bienvenido, ${currentUser.name}`;
    } else {
        if (btnLogin) btnLogin.style.display = 'block';
        if (userPanel) userPanel.classList.remove('active');
    }
}

if (btnLogin) {
    btnLogin.addEventListener('click', () => {
        window.location.href = 'inicio-de-sesion.html';
    });
}

if (btnLogout) {
    btnLogout.addEventListener('click', () => {
        setCurrentUser(null);
        updateUI();
        alert('Sesión cerrada');
    });
}

// SECTION TOGGLES
function initSectionToggles() {
    document.querySelectorAll('.toggle-btn').forEach(btn => {
        const targetId = btn.dataset.target;
        const target = document.getElementById(targetId);
        if (!target) return;
        btn.textContent = target.classList.contains('hidden') ? 'Mostrar' : 'Ocultar';
        btn.addEventListener('click', () => {
            target.classList.toggle('hidden');
            btn.textContent = target.classList.contains('hidden') ? 'Mostrar' : 'Ocultar';
        });
    });
}

// ITEM TOGGLES (FAQ, beneficios, comentarios)
function initItemToggles(){
    function setupDisclosure(item, header, body) {
        if (!header || !body) return;

        body.classList.add('collapsible-body');
        body.hidden = true;
        item.classList.add('closed-toggle');
        item.tabIndex = 0;
        item.style.cursor = 'pointer';
        header.style.cursor = 'pointer';
        header.setAttribute('role', 'button');
        header.setAttribute('aria-expanded', 'false');

        const toggleBody = () => {
            const isClosed = body.hidden;
            body.hidden = !isClosed;
            item.classList.toggle('open-toggle', isClosed);
            item.classList.toggle('closed-toggle', !isClosed);
            header.setAttribute('aria-expanded', String(isClosed));
        };

        item.addEventListener('click', toggleBody);
        item.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                toggleBody();
            }
        });
    }

    document.querySelectorAll('.faq-item').forEach(item => {
        setupDisclosure(item, item.querySelector('h3'), item.querySelector('p'));
    });

    document.querySelectorAll('#beneficios article').forEach(item => {
        const header = item.querySelector('h3');
        const body = item.querySelector('p');
        if (!header || !body) return;
        body.classList.add('collapsible-body');
        header.addEventListener('click', () => {
            body.classList.toggle('collapsed');
            item.classList.toggle('open-toggle');
        });
    });

    document.querySelectorAll('.testimonial').forEach(item => {
        setupDisclosure(item, item.querySelector('h4'), item.querySelector('p'));
    });

    // Client strip -> testimonial panel
    (function initClientStrip(){
        const dataNode = document.getElementById('testimonialsData');
        const testimonials = dataNode ? Array.from(dataNode.querySelectorAll('.testimonial')) : [];
        const clientBtns = Array.from(document.querySelectorAll('.client-btn'));
        const panel = document.getElementById('testimonialPanel');
        if (!panel || !testimonials.length || !clientBtns.length) return;

        testimonials.forEach((it,i)=> it.dataset.index = i);

        function showTestimonial(idx){
            const it = testimonials[idx];
            if (!it) return;
            const authorEl = it.querySelector('.author');
            const author = authorEl ? authorEl.textContent : '';
            const body = it.querySelector('p') ? it.querySelector('p').innerHTML : '';
            panel.innerHTML = `<h4 class="author">${author}</h4><p>${body}</p>`;
            clientBtns.forEach((b,i)=> b.classList.toggle('active', i===idx));
        }

        clientBtns.forEach((btn,idx)=> btn.addEventListener('click', (e)=>{ e.preventDefault(); showTestimonial(idx); }));

        showTestimonial(0);
    })();
}

// Inicialización
updateUI();
initSectionToggles();
initItemToggles();

