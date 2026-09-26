'use client';

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
);

export default function NovoInsumo() {
  const router = useRouter();

  const [nome, setNome] = useState('');
  const [unidadeConsumo, setUnidadeConsumo] = useState('kg');
  const [unidadeCompra, setUnidadeCompra] = useState('kg');
  const [quantidadeEmbalagem, setQuantidadeEmbalagem] = useState('');
  const [estoqueMinimo, setEstoqueMinimo] = useState('');
  const [custoAtual, setCustoAtual] = useState('');
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState('');

  async function salvarInsumo(e: React.FormEvent) {
    e.preventDefault();

    if (!nome.trim()) {
      setMensagem('Informe o nome do insumo.');
      return;
    }

    setSalvando(true);
    setMensagem('');

    // Código provisório automático.
    // Depois criaremos uma sequência definitiva no banco.
    const codigo = `INS-${Date.now().toString().slice(-6)}`;

    const { error } = await supabase.from('insumos').insert({
      codigo,
      nome: nome.trim(),
      unidade_consumo: unidadeConsumo,
      unidade_compra: unidadeCompra,
      quantidade_embalagem: quantidadeEmbalagem
        ? Number(quantidadeEmbalagem.replace(',', '.'))
        : null,
      estoque_minimo: estoqueMinimo
        ? Number(estoqueMinimo.replace(',', '.'))
        : 0,
      custo_atual: custoAtual
        ? Number(custoAtual.replace(',', '.'))
        : 0,
      ativo: true,
    });

    if (error) {
      setMensagem(`Erro ao cadastrar: ${error.message}`);
      setSalvando(false);
      return;
    }

    router.push('/');
    router.refresh();
  }

  return (
    <div className="pagina">
      <header>
        <div>
          <h2>UAN Gestão</h2>
          <span>Gestão de Unidade de Alimentação e Nutrição</span>
        </div>

        <div className="unidade">Unidade Piloto</div>
      </header>

      <main>
        <button className="voltar" onClick={() => router.push('/')}>
          ← Voltar para insumos
        </button>

        <div className="titulo">
          <h1>Novo insumo</h1>
          <p>Cadastre um novo item para utilização nas fichas técnicas, estoque e compras.</p>
        </div>

        <form onSubmit={salvarInsumo}>
          <section>
            <h3>Identificação</h3>

            <div className="grid">
              <Campo titulo="Nome do insumo *" largura="duplo">
                <input
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Ex.: Feijão carioca"
                />
              </Campo>

              <Campo titulo="Status">
                <input value="Ativo" disabled />
              </Campo>
            </div>
          </section>

          <section>
            <h3>Unidades e embalagem</h3>

            <div className="grid">
              <Campo titulo="Unidade de consumo *">
                <select
                  value={unidadeConsumo}
                  onChange={(e) => setUnidadeConsumo(e.target.value)}
                >
                  <option value="kg">kg</option>
                  <option value="g">g</option>
                  <option value="L">L</option>
                  <option value="ml">ml</option>
                  <option value="un">unidade</option>
                </select>
              </Campo>

              <Campo titulo="Unidade de compra *">
                <select
                  value={unidadeCompra}
                  onChange={(e) => setUnidadeCompra(e.target.value)}
                >
                  <option value="kg">kg</option>
                  <option value="pacote">Pacote</option>
                  <option value="caixa">Caixa</option>
                  <option value="fardo">Fardo</option>
                  <option value="garrafa">Garrafa</option>
                  <option value="lata">Lata</option>
                  <option value="un">Unidade</option>
                </select>
              </Campo>

              <Campo titulo="Quantidade por embalagem">
                <input
                  value={quantidadeEmbalagem}
                  onChange={(e) => setQuantidadeEmbalagem(e.target.value)}
                  placeholder="Ex.: 5"
                  inputMode="decimal"
                />
              </Campo>
            </div>

            <p className="ajuda">
              Exemplo: arroz comprado em pacote de 5 kg → unidade de consumo: kg,
              unidade de compra: pacote e quantidade por embalagem: 5.
            </p>
          </section>

          <section>
            <h3>Estoque e custo</h3>

            <div className="grid">
              <Campo titulo="Estoque mínimo">
                <input
                  value={estoqueMinimo}
                  onChange={(e) => setEstoqueMinimo(e.target.value)}
                  placeholder="Ex.: 10"
                  inputMode="decimal"
                />
              </Campo>

              <Campo titulo="Custo atual (R$)">
                <input
                  value={custoAtual}
                  onChange={(e) => setCustoAtual(e.target.value)}
                  placeholder="Ex.: 27,90"
                  inputMode="decimal"
                />
              </Campo>
            </div>
          </section>

          {mensagem && <div className="mensagem">{mensagem}</div>}

          <div className="acoes">
            <button
              type="button"
              className="cancelar"
              onClick={() => router.push('/')}
            >
              Cancelar
            </button>

            <button type="submit" className="salvar" disabled={salvando}>
              {salvando ? 'Salvando...' : 'Salvar insumo'}
            </button>
          </div>
        </form>
      </main>

      <style jsx>{`
        :global(:root) {
          --cor-principal: #164e63;
          --cor-destaque: #f28c28;
        }

        :global(*) {
          box-sizing: border-box;
        }

        :global(body) {
          margin: 0;
          background: #f5f7fa;
          font-family: Arial, sans-serif;
          color: #1f2937;
        }

        header {
          min-height: 70px;
          background: white;
          border-bottom: 1px solid #e5e7eb;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 32px;
        }

        header h2 {
          margin: 0;
          color: var(--cor-principal);
        }

        header span,
        .unidade {
          color: #6b7280;
          font-size: 13px;
        }

        main {
          max-width: 1000px;
          margin: 0 auto;
          padding: 35px;
        }

        .voltar {
          border: 0;
          background: transparent;
          color: var(--cor-principal);
          cursor: pointer;
          padding: 0;
          margin-bottom: 25px;
          font-weight: bold;
        }

        .titulo h1 {
          margin-bottom: 5px;
        }

        .titulo p {
          color: #6b7280;
          margin-top: 0;
          margin-bottom: 25px;
        }

        section {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          padding: 22px;
          margin-bottom: 18px;
        }

        section h3 {
          margin-top: 0;
          color: var(--cor-principal);
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
        }

        :global(.campo-duplo) {
          grid-column: span 2;
        }

        :global(label) {
          display: block;
          font-size: 13px;
          font-weight: bold;
          margin-bottom: 7px;
        }

        :global(input),
        :global(select) {
          width: 100%;
          height: 42px;
          border: 1px solid #d1d5db;
          border-radius: 7px;
          padding: 0 12px;
          background: white;
          font-size: 14px;
        }

        :global(input:focus),
        :global(select:focus) {
          outline: 2px solid var(--cor-principal);
          outline-offset: 1px;
        }

        .ajuda {
          color: #6b7280;
          font-size: 12px;
          margin-bottom: 0;
          margin-top: 15px;
        }

        .acoes {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 20px;
        }

        .acoes button {
          border-radius: 7px;
          padding: 12px 20px;
          font-weight: bold;
          cursor: pointer;
        }

        .cancelar {
          background: white;
          border: 1px solid #d1d5db;
          color: #374151;
        }

        .salvar {
          background: var(--cor-destaque);
          border: 1px solid var(--cor-destaque);
          color: white;
        }

        .salvar:disabled {
          opacity: 0.6;
          cursor: default;
        }

        .mensagem {
          padding: 14px;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 7px;
        }

        @media (max-width: 700px) {
          main {
            padding: 20px;
          }

          header {
            padding: 12px 20px;
          }

          .grid {
            grid-template-columns: 1fr;
          }

          :global(.campo-duplo) {
            grid-column: span 1;
          }
        }
      `}</style>
    </div>
  );
}

function Campo({
  titulo,
  largura,
  children,
}: {
  titulo: string;
  largura?: 'duplo';
  children: React.ReactNode;
}) {
  return (
    <div className={largura === 'duplo' ? 'campo-duplo' : ''}>
      <label>{titulo}</label>
      {children}
    </div>
  );
}