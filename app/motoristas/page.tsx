import { supabase } from '@/lib/supabase';
import NavBar from '@/components/NavBar';
import Link from 'next/link';
import type { Profile } from '@/lib/types';

async function getMotoristas(filter?: string) {
  let query = supabase
    .from('profiles')
    .select('id, name, cpf, user_type, verificado, status_motorista, created_at, telefone, cnh_numero, cnh_validade')
    .eq('user_type', 'driver')
    .order('created_at', { ascending: false });

  if (filter && ['pendente', 'aprovado', 'rejeitado', 'suspenso'].includes(filter)) {
    query = query.eq('status_motorista', filter);
  }

  const { data, error } = await query;
  if (error) {
    console.error('Erro ao buscar motoristas:', error);
    return [];
  }
  return (data ?? []) as Profile[];
}

function formatDate(dateStr?: string) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('pt-BR');
}

function formatCPF(cpf?: string | null) {
  if (!cpf) return '—';
  const c = cpf.replace(/\D/g, '');
  if (c.length !== 11) return cpf;
  return `${c.slice(0, 3)}.${c.slice(3, 6)}.${c.slice(6, 9)}-${c.slice(9)}`;
}

const statusColors: Record<string, string> = {
  pendente: 'bg-yellow-100 text-yellow-800',
  aprovado: 'bg-green-100 text-green-800',
  rejeitado: 'bg-red-100 text-red-800',
  suspenso: 'bg-zinc-100 text-zinc-700',
};

const statusLabels: Record<string, string> = {
  pendente: 'Pendente',
  aprovado: 'Aprovado',
  rejeitado: 'Rejeitado',
  suspenso: 'Suspenso',
};

export default async function MotoristasPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const { filter } = await searchParams;
  const motoristas = await getMotoristas(filter);

  const filters = [
    { key: undefined, label: 'Todos' },
    { key: 'pendente', label: 'Pendentes' },
    { key: 'aprovado', label: 'Aprovados' },
    { key: 'rejeitado', label: 'Rejeitados' },
    { key: 'suspenso', label: 'Suspensos' },
  ];

  return (
    <div className="min-h-screen bg-zinc-50">
      <NavBar />
      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-zinc-800">Motoristas</h2>
            <p className="text-sm text-zinc-500">{motoristas.length} motoristas</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-4 flex-wrap">
          {filters.map((f) => {
            const isActive = filter === f.key || (!filter && !f.key);
            const href = f.key ? `/motoristas?filter=${f.key}` : '/motoristas';
            return (
              <Link
                key={f.label}
                href={href}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-zinc-900 text-white'
                    : 'bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-100'
                }`}
              >
                {f.label}
              </Link>
            );
          })}
        </div>

        <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50">
                <th className="text-left px-4 py-3 font-semibold text-zinc-600">Nome</th>
                <th className="text-left px-4 py-3 font-semibold text-zinc-600">CPF</th>
                <th className="text-left px-4 py-3 font-semibold text-zinc-600">CNH</th>
                <th className="text-left px-4 py-3 font-semibold text-zinc-600">Status</th>
                <th className="text-left px-4 py-3 font-semibold text-zinc-600">Cadastro</th>
                <th className="text-left px-4 py-3 font-semibold text-zinc-600">Ações</th>
              </tr>
            </thead>
            <tbody>
              {motoristas.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-zinc-400">
                    Nenhum motorista encontrado
                  </td>
                </tr>
              ) : (
                motoristas.map((m) => (
                  <tr
                    key={m.id}
                    className="border-b border-zinc-50 hover:bg-zinc-50 transition-colors"
                  >
                    <td className="px-4 py-3 font-medium text-zinc-900">{m.name ?? '—'}</td>
                    <td className="px-4 py-3 text-zinc-600 font-mono text-xs">
                      {formatCPF(m.cpf)}
                    </td>
                    <td className="px-4 py-3 text-zinc-600">
                      {m.cnh_numero ?? '—'}
                      {m.cnh_validade && (
                        <span className="ml-1 text-xs text-zinc-400">
                          (val: {formatDate(m.cnh_validade)})
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                          statusColors[m.status_motorista ?? 'pendente']
                        }`}
                      >
                        {statusLabels[m.status_motorista ?? 'pendente']}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-zinc-500">{formatDate(m.created_at)}</td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/motoristas/${m.id}`}
                        className="text-blue-600 hover:underline font-medium"
                      >
                        Ver
                      </Link>
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
