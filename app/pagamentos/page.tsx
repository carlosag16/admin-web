import { supabase } from '@/lib/supabase';
import NavBar from '@/components/NavBar';
import Link from 'next/link';

function formatDateTime(dateStr?: string) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleString('pt-BR');
}

function formatCurrency(centavos?: number) {
  if (centavos == null) return '—';
  return (centavos / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  PAID: 'bg-green-100 text-green-800',
  EXPIRED: 'bg-zinc-100 text-zinc-600',
  CANCELLED: 'bg-red-100 text-red-800',
  REFUNDED: 'bg-purple-100 text-purple-800',
};

const validPaymentStatuses = ['PENDING', 'PAID', 'EXPIRED', 'CANCELLED', 'REFUNDED'];

async function getPagamentos(filter?: string) {
  let query = supabase
    .from('pagamentos')
    .select(`
      id,
      solicitacao_id,
      abacatepay_billing_id,
      url_pagamento,
      valor_centavos,
      status,
      pago_em,
      created_at,
      solicitacoes!pagamentos_solicitacao_id_fkey(
        usuario_id,
        tipo_solicitacao,
        profiles!solicitacoes_usuario_id_fkey(name)
      )
    `)
    .order('created_at', { ascending: false })
    .limit(50);

  if (filter && validPaymentStatuses.includes(filter)) {
    query = query.eq('status', filter);
  }

  const { data, error } = await query;
  if (error) {
    console.error('Erro ao buscar pagamentos:', error);
    return [];
  }
  return data ?? [];
}

export default async function PagamentosPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const { filter } = await searchParams;
  const pagamentos = await getPagamentos(filter);

  const filters = [
    { key: undefined, label: 'Todos' },
    { key: 'PENDING', label: 'Pendentes' },
    { key: 'PAID', label: 'Pagos' },
    { key: 'EXPIRED', label: 'Expirados' },
    { key: 'CANCELLED', label: 'Cancelados' },
    { key: 'REFUNDED', label: 'Reembolsados' },
  ];

  const totalPago = pagamentos
    .filter((p: any) => p.status === 'PAID')
    .reduce((acc: number, p: any) => acc + (p.valor_centavos ?? 0), 0);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <NavBar />
      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-200">Pagamentos</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {pagamentos.length} registros •{' '}
              <span className="text-emerald-700 dark:text-emerald-400 font-semibold">{formatCurrency(totalPago)} pagos</span>
            </p>
          </div>
        </div>

        <div className="flex gap-2 mb-4 flex-wrap">
          {filters.map((f) => {
            const isActive = filter === f.key || (!filter && !f.key);
            const href = f.key ? `/pagamentos?filter=${f.key}` : '/pagamentos';
            return (
              <Link
                key={f.label}
                href={href}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900'
                    : 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                }`}
              >
                {f.label}
              </Link>
            );
          })}
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-700 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-100 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800">
                <th className="text-left px-4 py-3 font-semibold text-zinc-600 dark:text-zinc-300">Cliente</th>
                <th className="text-left px-4 py-3 font-semibold text-zinc-600 dark:text-zinc-300">Solicitação</th>
                <th className="text-left px-4 py-3 font-semibold text-zinc-600 dark:text-zinc-300">ID AbacatePay</th>
                <th className="text-left px-4 py-3 font-semibold text-zinc-600 dark:text-zinc-300">Valor</th>
                <th className="text-left px-4 py-3 font-semibold text-zinc-600 dark:text-zinc-300">Status</th>
                <th className="text-left px-4 py-3 font-semibold text-zinc-600 dark:text-zinc-300">Criado em</th>
                <th className="text-left px-4 py-3 font-semibold text-zinc-600 dark:text-zinc-300">Pago em</th>
                <th className="text-left px-4 py-3 font-semibold text-zinc-600 dark:text-zinc-300">Link</th>
              </tr>
            </thead>
            <tbody>
              {pagamentos.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-zinc-400 dark:text-zinc-500">
                    Nenhum pagamento encontrado
                  </td>
                </tr>
              ) : (
                pagamentos.map((p: any) => (
                  <tr
                    key={p.id}
                    className="border-b border-zinc-50 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                  >
                    <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-100">
                      {p.solicitacoes?.profiles?.name ?? '—'}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/solicitacoes/${p.solicitacao_id}`}
                        className="text-blue-600 dark:text-blue-400 hover:underline font-mono text-xs"
                      >
                        {p.solicitacao_id?.slice(0, 8)}…
                      </Link>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-zinc-400 dark:text-zinc-500">
                      {p.abacatepay_billing_id?.slice(0, 16)}…
                    </td>
                    <td className="px-4 py-3 font-semibold text-zinc-900 dark:text-zinc-100">
                      {formatCurrency(p.valor_centavos)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                          statusColors[p.status] ?? 'bg-zinc-100 text-zinc-600'
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-zinc-500 dark:text-zinc-400">{formatDateTime(p.created_at)}</td>
                    <td className="px-4 py-3 text-zinc-500 dark:text-zinc-400">{formatDateTime(p.pago_em)}</td>
                    <td className="px-4 py-3">
                      {p.url_pagamento && (
                        <a
                          href={p.url_pagamento}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-400 hover:underline text-xs"
                        >
                          Abrir
                        </a>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
