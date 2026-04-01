import { supabase } from '@/lib/supabase';
import NavBar from '@/components/NavBar';
import Link from 'next/link';
import type { Profile } from '@/lib/types';

async function getUsuarios() {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, name, cpf, user_type, verificado, status_motorista, created_at, telefone')
    .eq('user_type', 'user')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Erro ao buscar usuários:', error);
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

export default async function UsuariosPage() {
  const usuarios = await getUsuarios();

  return (
    <div className="min-h-screen bg-zinc-50">
      <NavBar />
      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-zinc-800">Usuários</h2>
            <p className="text-sm text-zinc-500">{usuarios.length} clientes cadastrados</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50">
                <th className="text-left px-4 py-3 font-semibold text-zinc-600">Nome</th>
                <th className="text-left px-4 py-3 font-semibold text-zinc-600">CPF</th>
                <th className="text-left px-4 py-3 font-semibold text-zinc-600">Telefone</th>
                <th className="text-left px-4 py-3 font-semibold text-zinc-600">Cadastro</th>
                <th className="text-left px-4 py-3 font-semibold text-zinc-600">Ações</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-zinc-400">
                    Nenhum usuário encontrado
                  </td>
                </tr>
              ) : (
                usuarios.map((u) => (
                  <tr
                    key={u.id}
                    className="border-b border-zinc-50 hover:bg-zinc-50 transition-colors"
                  >
                    <td className="px-4 py-3 font-medium text-zinc-900">{u.name ?? '—'}</td>
                    <td className="px-4 py-3 text-zinc-600 font-mono text-xs">{formatCPF(u.cpf)}</td>
                    <td className="px-4 py-3 text-zinc-600">{u.telefone ?? '—'}</td>
                    <td className="px-4 py-3 text-zinc-500">{formatDate(u.created_at)}</td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/usuarios/${u.id}`}
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
