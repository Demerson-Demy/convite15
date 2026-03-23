import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-900 text-white p-4 text-center">
      <div>
        <h2 className="text-4xl font-bold mb-4 text-red-600">404</h2>
        <p className="text-xl mb-8 text-gray-400">Página não encontrada</p>
        <Link 
          href="/"
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full font-bold transition-all"
        >
          Voltar para o Convite
        </Link>
      </div>
    </div>
  );
}
