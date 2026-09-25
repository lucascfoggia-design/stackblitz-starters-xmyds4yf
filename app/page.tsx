import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
);

export default async function Home() {
  const { data: insumos, error } = await supabase
    .from('insumos')
    .select('id, codigo, nome, unidade_consumo, custo_atual');

  return (
    <main style={{ padding: '40px', fontFamily: 'Arial' }}>
      <h1>UAN Gestão</h1>
      <h2>Insumos</h2>

      {error && (
        <p>Erro ao carregar os insumos: {error.message}</p>
      )}

      {insumos?.map((insumo) => (
        <div
          key={insumo.id}
          style={{
            border: '1px solid #ddd',
            padding: '20px',
            marginTop: '10px',
          }}
        >
          <strong>{insumo.codigo}</strong>
          <p>{insumo.nome}</p>
          <p>Unidade: {insumo.unidade_consumo}</p>
          <p>Custo: R$ {Number(insumo.custo_atual).toFixed(2)}</p>
        </div>
      ))}
    </main>
  );
}