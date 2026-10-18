import "./globals.css";
import AuthGate, { LogoutButton } from "../components/AuthGate";

export const metadata = {
  title: "Royal Technology — вікна, двері, ворота",
  description: "Royal Technology (Вікна-Роял), Чернівці — металопластикові та алюмінієві вікна, двері, ворота, Panoram Glass.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="uk">
      <body>
        <AuthGate>
          <header className="site">
            <a className="logo" href="/">ROYAL</a>
            <nav className="site">
              <a href="/">Головна</a>
              <a href="/products">Продукція</a>
              <a href="/certificates">Сертифікати</a>
              <LogoutButton />
            </nav>
          </header>
          {children}
          <footer className="site">
            Дані зібрано з публічної частини vikna-royal.com.ua · вітрина на Next.js + Supabase
          </footer>
        </AuthGate>
      </body>
    </html>
  );
}
