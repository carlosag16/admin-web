import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { Users, Car, ClipboardList, CreditCard, Clock, Activity } from 'lucide-react';

async function getDashboardStats() {
  const [
    { count: totalUsers },
    { count: totalDrivers },
    { count: pendingDrivers },
    { count: totalSolicitacoes },
    { count: pendingSolicitacoes },
    { count: activeSolicitacoes },
    { count: totalPagamentos },
    { count: paidPagamentos },
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('user_type', 'user'),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('user_type', 'driver'),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('user_type', 'driver').eq('status_motorista', 'pendente'),
    supabase.from('solicitacoes').select('*', { count: 'exact', head: true }),
    supabase.from('solicitacoes').select('*', { count: 'exact', head: true }).eq('status', 'pendente'),
    supabase.from('solicitacoes').select('*', { count: 'exact', head: true }).in('status', ['confirmada', 'em_andamento']),
    supabase.from('pagamentos').select('*', { count: 'exact', head: true }),
    supabase.from('pagamentos').select('*', { count: 'exact', head: true }).eq('status', 'PAID'),
  ]);

  return {
    totalUsers: totalUsers ?? 0,
    totalDrivers: totalDrivers ?? 0,
    pendingDrivers: pendingDrivers ?? 0,
    totalSolicitacoes: totalSolicitacoes ?? 0,
    pendingSolicitacoes: pendingSolicitacoes ?? 0,
    activeSolicitacoes: activeSolicitacoes ?? 0,
    totalPagamentos: totalPagamentos ?? 0,
    paidPagamentos: paidPagamentos ?? 0,
  };
}

export default async function Dashboard() {
  const stats = await getDashboardStats();

  const cards = [
    { title: 'Usuários', value: stats.totalUsers, sub: 'clientes cadastrados', href: '/usuarios', color: 'bg-blue-500', Icon: Users },
    { title: 'Motoristas', value: stats.totalDrivers, sub: `${stats.pendingDrivers} aguardando aprovação`, href: '/motoristas', color: stats.pendingDrivers > 0 ? 'bg-orange-500' : 'bg-green-500', Icon: Car },
    { title: 'Solicitações', value: stats.totalSolicitacoes, sub: `${stats.pendingSolicitacoes} pendentes • ${stats.activeSolicitacoes} ativas`, href: '/solicitacoes', color: 'bg-purple-500', Icon: ClipboardList },
    { title: 'Pagamentos', value: stats.totalPagamentos, sub: `${stats.paidPagamentos} pagos`, href: '/pagamentos', color: 'bg-emerald-500', Icon: CreditCard },
  ];

  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="bg-white border-b border-zinc-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900">Chofair Admin</h1>
            <p className="text-sm text-zinc-500">Painel de controle</p>
          </div>
          <nav className="flex gap-4 text-sm font-medium text-zinc-600">
            <Link href="/" className="text-zinc-900 font-semibold">Dashboard</Link>
            <Link href="/usuarios" className="hover:text-zinc-900">Usuários</Link>
            <Link href="/motoristas" className="hover:text-zinc-900">Motoristas</Link>
            <Link href="/solicitacoes" className="hover:text-zinc-900">Solicitações</Link>
            <Link href="/pagamentos" className="hover:text-zinc-900">Pagamentos</Link>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        <h2 className="text-xl font-semibold text-zinc-800 mb-6">Visão Geral</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {cards.map((card) => (
            <Link key={card.href} href={card.href} className="bg-white rounded-xl border border-zinc-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-10 h-10 ${card.color} rounded-lg flex items-center justify-center`}>
                  <card.Icon size={20} className="text-white" />
                </div>
              </div>
              <p className="text-3xl font-bold text-zinc-900 mb-1">{card.value}</p>
              <p className="text-sm font-semibold text-zinc-700 mb-1">{card.title}</p>
              <p className="text-xs text-zinc-500">{card.sub}</p>
            </Link>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-zinc-200 p-6">
          <h3 className="text-base font-semibold text-zinc-800 mb-4">Ações Rápidas</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Link href="/motoristas?filter=pendente" className="flex flex-col items-center gap-2 p-4 rounded-lg bg-orange-50 border border-orange-100 hover:bg-orange-100 transition-colors text-center">
              <Clock size={22} className="text-orange-500" />
              <span className="text-xs font-semibold text-orange-800">Aprovar Motoristas ({stats.pendingDrivers})</span>
            </Link>
            <Link href="/solicitacoes?filter=pendente" className="flex flex-col items-center gap-2 p-4 rounded-lg bg-purple-50 border border-purple-100 hover:bg-purple-100 transition-colors text-center">
              <ClipboardList size={22} className="text-purple-500" />
              <span className="text-xs font-semibold text-purple-800">Solicitações Pendentes ({stats.pendingSolicitacoes})</span>
            </Link>
            <Link href="/solicitacoes?filter=em_andamento" className="flex flex-col items-center gap-2 p-4 rounded-lg bg-blue-50 border border-blue-100 hover:bg-blue-100 transition-colors text-center">
              <Activity size={22} className="text-blue-500" />
              <span className="text-xs font-semibold text-blue-800">Corridas Ativas ({stats.activeSolicitacoes})</span>
            </Link>
            <Link href="/pagamentos?filter=PENDING" className="flex flex-col items-center gap-2 p-4 rounded-lg bg-emerald-50 border border-emerald-100 hover:bg-emerald-100 transition-colors text-center">
              <CreditCard size={22} className="text-emerald-500" />
              <span className="text-xs font-semibold text-emerald-800">Pagamentos Pendentes</span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
