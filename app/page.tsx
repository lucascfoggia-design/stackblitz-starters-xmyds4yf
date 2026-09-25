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
    <div
      style={{
        minHeight: '100vh',
        background: '#f5f7fa',
        fontFamily: 'Arial, sans-serif',
        color: '#1f2937',
      }}
    >
      {/* CABEÇALHO */}
      <header
        style={{
          height: '70px',
          background: '#ffffff',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 32px',
        }}
      >
        <div>
          <strong
            style={{
              fontSize: '22px',
              color: 'var(--cor-principal)',
            }}
          >
            UAN Gestão
          </strong>

          <div
            style={{
              fontSize: '12px',
              color: '#6b7280',
              marginTop: '3px',
            }}
          >
            Gestão de Unidade de Alimentação e Nutrição
          </div>
        </div>

        <div
          style={{
            fontSize: '14px',
            color: '#6b7280',
          }}
        >
          Unidade Piloto
        </div>
      </header>

      <div style={{ display: 'flex', minHeight: 'calc(100vh - 70px)' }}>
        {/* MENU LATERAL */}
        <aside
          style={{
            width: '230px',
            background: 'var(--cor-principal)',
            padding: '25px 18px',
            color: '#ffffff',
          }}
        >
          <MenuItem texto="Dashboard" />
          <MenuItem texto="Insumos" ativo />
          <MenuItem texto="Fichas Técnicas" />
          <MenuItem texto="Cardápio" />
          <MenuItem texto="Estoque" />
          <MenuItem texto="Compras" />
          <MenuItem texto="Fornecedores" />

          <div
            style={{
              borderTop: '1px solid rgba(255,255,255,0.2)',
              marginTop: '25px',
              paddingTop: '15px',
            }}
          >
            <MenuItem texto="Configurações" />
          </div>
        </aside>

        {/* CONTEÚDO */}
        <main
          style={{
            flex: 1,
            padding: '35px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '25px',
            }}
          >
            <div>
              <h1
                style={{
                  margin: 0,
                  fontSize: '28px',
                }}
              >
                Insumos
              </h1>

              <p
                style={{
                  color: '#6b7280',
                  marginTop: '7px',
                }}
              >
                Cadastro e gerenciamento dos insumos da unidade.
              </p>
            </div>

            <button
              style={{
                background: 'var(--cor-destaque)',
                border: 'none',
                color: '#ffffff',
                padding: '12px 18px',
                borderRadius: '7px',
                fontWeight: 'bold',
                cursor: 'pointer',
              }}
            >
              + Novo insumo
            </button>
          </div>

          {/* RESUMO */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '15px',
              marginBottom: '25px',
            }}
          >
            <Card
              titulo="Insumos cadastrados"
              valor={String(insumos?.length ?? 0)}
            />

            <Card titulo="Categorias" valor="-" />
            <Card titulo="Estoque baixo" valor="-" />
          </div>

          {/* TABELA */}
          <div
            style={{
              background: '#ffffff',
              borderRadius: '10px',
              border: '1px solid #e5e7eb',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                padding: '20px',
                borderBottom: '1px solid #e5e7eb',
              }}
            >
              <strong>Lista de insumos</strong>
            </div>

            {error && (
              <div style={{ padding: '20px', color: '#b91c1c' }}>
                Erro ao carregar os insumos: {error.message}
              </div>
            )}

            <div style={{ overflowX: 'auto' }}>
              <table
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                }}
              >
                <thead>
                  <tr
                    style={{
                      background: '#f9fafb',
                      textAlign: 'left',
                    }}
                  >
                    <Th>Código</Th>
                    <Th>Insumo</Th>
                    <Th>Unidade</Th>
                    <Th>Custo atual</Th>
                  </tr>
                </thead>

                <tbody>
                  {insumos?.map((insumo) => (
                    <tr
                      key={insumo.id}
                      style={{
                        borderTop: '1px solid #e5e7eb',
                      }}
                    >
                      <Td>
                        <strong>{insumo.codigo}</strong>
                      </Td>

                      <Td>{insumo.nome}</Td>

                      <Td>{insumo.unidade_consumo}</Td>

                      <Td>
                        R${' '}
                        {Number(insumo.custo_atual).toLocaleString('pt-BR', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {!error && insumos?.length === 0 && (
              <div
                style={{
                  padding: '30px',
                  textAlign: 'center',
                  color: '#6b7280',
                }}
              >
                Nenhum insumo cadastrado.
              </div>
            )}
          </div>
        </main>
      </div>

      <style>{`
        :root {
          --cor-principal: #164e63;
          --cor-destaque: #f28c28;
        }

        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
        }

        @media (max-width: 750px) {
          aside {
            width: 180px !important;
          }

          main {
            padding: 20px !important;
          }
        }
      `}</style>
    </div>
  );
}

function MenuItem({
  texto,
  ativo = false,
}: {
  texto: string;
  ativo?: boolean;
}) {
  return (
    <div
      style={{
        padding: '12px 14px',
        marginBottom: '5px',
        borderRadius: '7px',
        cursor: 'pointer',
        background: ativo ? 'rgba(255,255,255,0.15)' : 'transparent',
        fontWeight: ativo ? 'bold' : 'normal',
      }}
    >
      {texto}
    </div>
  );
}

function Card({
  titulo,
  valor,
}: {
  titulo: string;
  valor: string;
}) {
  return (
    <div
      style={{
        background: '#ffffff',
        padding: '20px',
        borderRadius: '10px',
        border: '1px solid #e5e7eb',
      }}
    >
      <div
        style={{
          color: '#6b7280',
          fontSize: '13px',
        }}
      >
        {titulo}
      </div>

      <div
        style={{
          fontSize: '27px',
          fontWeight: 'bold',
          marginTop: '8px',
          color: 'var(--cor-principal)',
        }}
      >
        {valor}
      </div>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th
      style={{
        padding: '14px 20px',
        fontSize: '13px',
        color: '#6b7280',
      }}
    >
      {children}
    </th>
  );
}

function Td({ children }: { children: React.ReactNode }) {
  return (
    <td
      style={{
        padding: '16px 20px',
      }}
    >
      {children}
    </td>
  );
}