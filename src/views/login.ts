import { login, register } from '../auth';
import { toast } from '../utils/toast';

type Mode = 'login' | 'register';

export function renderLogin(onSuccess: () => void): void {
  document.body.classList.add('login-mode');
  let mode: Mode = 'login';

  function paint(): void {
    document.body.innerHTML = `
      <div class="login-page">
        <div class="login-card">
          <div class="login-logo">🦖</div>
          <h1>Dino Explorer</h1>
          <p class="login-subtitle">
            ${mode === 'login' ? 'Inicia sesión para explorar la era Mesozoica' : 'Crea una cuenta nueva'}
          </p>
          <form id="authForm" class="login-form" autocomplete="off">
            ${mode === 'register' ? `
              <label>Nombre
                <input name="nombre" type="text" required placeholder="Tu nombre" />
              </label>` : ''}
            <label>Email
              <input name="email" type="email" required autofocus placeholder="admin@dino.com" />
            </label>
            <label>Contraseña
              <input name="password" type="password" required placeholder="••••••••" minlength="${mode === 'register' ? 6 : 0}" />
            </label>
            <button type="submit" id="authBtn">
              ${mode === 'login' ? 'Entrar' : 'Crear cuenta'}
            </button>
          </form>
          <div class="login-switch">
            ${mode === 'login'
              ? '¿No tienes cuenta? <a href="#" id="switchMode">Regístrate</a>'
              : '¿Ya tienes cuenta? <a href="#" id="switchMode">Inicia sesión</a>'}
          </div>
          <div class="login-hint">
            <strong>Demo:</strong> <code>admin@dino.com</code> / <code>admin123</code>
          </div>
        </div>
      </div>
      <div class="toast" id="toast"></div>
    `;
    bindHandlers();
  }

  function bindHandlers(): void {
    const form = document.getElementById('authForm') as HTMLFormElement;
    const btn = document.getElementById('authBtn') as HTMLButtonElement;
    const switchLink = document.getElementById('switchMode');

    switchLink?.addEventListener('click', (e) => {
      e.preventDefault();
      mode = mode === 'login' ? 'register' : 'login';
      paint();
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const email = String(data.get('email') ?? '');
      const password = String(data.get('password') ?? '');
      const nombre = String(data.get('nombre') ?? '');

      btn.disabled = true;
      const originalText = btn.textContent;
      btn.textContent = 'Procesando…';

      try {
        if (mode === 'register') {
          await register(email, password, nombre);
          toast('Cuenta creada. Inicia sesión.');
          mode = 'login';
          paint();
        } else {
          await login(email, password);
          toast('¡Bienvenido!');
          setTimeout(onSuccess, 250);
        }
      } catch (err) {
        toast((err as Error).message, true);
        btn.disabled = false;
        btn.textContent = originalText;
      }
    });
  }

  paint();
}
