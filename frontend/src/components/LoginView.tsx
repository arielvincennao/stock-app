import logoTenva from '../assets/icons/tenva.png'

type LoginViewProps = {
  onLogin: () => void
}

export function LoginView({ onLogin }: LoginViewProps) {
  return (
    <main className="login-page">
      <section className="login-card" aria-labelledby="login-title">
        <div className="login-brand">
          <img className="login-logo" src={logoTenva} alt="Tenva" />
        </div>
        <div className="login-header">
          <h1 id="login-title">Acceso al sistema</h1>
        </div>
        <form
          className="login-form"
          onSubmit={(event) => {
            event.preventDefault()
            onLogin()
          }}
        >
          <label htmlFor="email">Correo</label>
          <input id="email" name="email" type="email" placeholder="tu@email.com" />

          <label htmlFor="password">Contrasena</label>
          <input id="password" name="password" type="password" placeholder="********" />

          <button type="submit">Entrar</button>
        </form>
      </section>
    </main>
  )
}
