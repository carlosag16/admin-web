'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Car, ClipboardList, CreditCard } from 'lucide-react';

const links = [
  { href: '/admin', label: 'Dashboard', Icon: LayoutDashboard },
  { href: '/usuarios', label: 'Usuários', Icon: Users },
  { href: '/motoristas', label: 'Motoristas', Icon: Car },
  { href: '/solicitacoes', label: 'Solicitações', Icon: ClipboardList },
  { href: '/pagamentos', label: 'Pagamentos', Icon: CreditCard },
];

export default function NavBar() {
  const pathname = usePathname();

  return (
    <header className="bg-white border-b border-zinc-200 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div>
          <Link href="/admin" className="text-2xl font-bold text-zinc-900">Chofair Admin</Link>
          <p className="text-sm text-zinc-500">Painel de controle</p>
        </div>
        <nav className="flex gap-1 text-sm font-medium">
          {links.map(({ href, label, Icon }) => {
            const isActive = href === '/admin' ? pathname === '/admin' : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-zinc-100 text-zinc-900 font-semibold'
                    : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50'
                }`}
              >
                <Icon size={15} />
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
