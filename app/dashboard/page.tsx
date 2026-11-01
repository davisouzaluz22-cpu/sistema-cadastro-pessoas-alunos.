"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import type { CSSProperties } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Cliente = {
  id: number;
  nome: string;
  telefone: string;
};

export default function Dashboard() {
  const router = useRouter();

  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [pesquisa, setPesquisa] = useState("");
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);

  async function carregarClientes() {
    const { data, error } = await supabase
      .from("clientes")
      .select("*")
      .order("nome");

    if (error) {
      alert("Erro ao carregar clientes: " + error.message);
      return;
    }

    setClientes(data || []);
  }

  async function verificarUsuario() {
    const { data } = await supabase.auth.getUser();

    if (!data.user) {
      router.replace("/login");
      setCarregando(false);
      return;
    }

    await carregarClientes();
    setCarregando(false);
  }

  useEffect(() => {
    verificarUsuario();
  }, []);

  function limparFormulario() {
    setNome("");
    setTelefone("");
    setEditandoId(null);
  }

  async function salvarCliente(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setSalvando(true);

    let error;

    if (editandoId !== null) {
      const resultado = await supabase
        .from("clientes")
        .update({ nome, telefone })
        .eq("id", editandoId);

      error = resultado.error;
    } else {
      const resultado = await supabase
        .from("clientes")
        .insert([{ nome, telefone }]);

      error = resultado.error;
    }

    setSalvando(false);

    if (error) {
      alert("Erro ao salvar: " + error.message);
      return;
    }

    alert(
      editandoId !== null
        ? "Cliente atualizado com sucesso!"
        : "Cliente cadastrado com sucesso!"
    );

    limparFormulario();
    await carregarClientes();
  }

  function editarCliente(cliente: Cliente) {
    setNome(cliente.nome);
    setTelefone(cliente.telefone);
    setEditandoId(cliente.id);

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function excluirCliente(id: number) {
    const confirmar = confirm(
      "Deseja realmente excluir este cliente?"
    );

    if (!confirmar) return;

    const { error } = await supabase
      .from("clientes")
      .delete()
      .eq("id", id);

    if (error) {
      alert("Erro ao excluir: " + error.message);
      return;
    }

    alert("Cliente excluído com sucesso!");
    await carregarClientes();
  }

  async function sair() {
    await supabase.auth.signOut();
    router.replace("/login");
  }

  const clientesFiltrados = clientes.filter((cliente) =>
    `${cliente.nome} ${cliente.telefone}`
      .toLowerCase()
      .includes(pesquisa.toLowerCase())
  );

  if (carregando) {
    return <p style={{ padding: 30 }}>Carregando sistema...</p>;
  }

  return (
    <main style={estilos.pagina}>
      <header style={estilos.cabecalho}>
        <div>
          <h1 style={estilos.titulo}>Painel de Clientes</h1>
          <p style={estilos.subtitulo}>
            Gerenciamento de pessoas e clientes
          </p>
        </div>

        <button onClick={sair} style={estilos.botaoSair}>
          Sair
        </button>
      </header>

      <section style={estilos.resumo}>
        <div style={estilos.cartao}>
          <span>Total de clientes</span>
          <strong>{clientes.length}</strong>
        </div>

        <div style={estilos.cartao}>
          <span>Resultados da pesquisa</span>
          <strong>{clientesFiltrados.length}</strong>
        </div>
      </section>

      <form onSubmit={salvarCliente} style={estilos.formulario}>
        <h2>
          {editandoId !== null
            ? "Editar Cliente"
            : "Cadastrar Novo Cliente"}
        </h2>

        <label style={estilos.label}>
          Nome completo
        </label>

        <input
          style={estilos.input}
          placeholder="Digite o nome do cliente"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />

        <label style={estilos.label}>
          Telefone
        </label>

        <input
          style={estilos.input}
          placeholder="Digite o telefone"
          type="tel"
          value={telefone}
          onChange={(e) => setTelefone(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={salvando}
          style={estilos.botaoPrincipal}
        >
          {salvando
            ? "Salvando..."
            : editandoId !== null
            ? "Atualizar Cliente"
            : "Cadastrar Cliente"}
        </button>

        {editandoId !== null && (
          <button
            type="button"
            onClick={limparFormulario}
            style={estilos.botaoCancelar}
          >
            Cancelar edição
          </button>
        )}
      </form>

      <section style={estilos.lista}>
        <h2>Clientes Cadastrados</h2>

        <input
          style={estilos.input}
          placeholder="Pesquisar por nome ou telefone..."
          value={pesquisa}
          onChange={(e) => setPesquisa(e.target.value)}
        />

        {clientesFiltrados.length === 0 ? (
          <p>Nenhum cliente encontrado.</p>
        ) : (
          clientesFiltrados.map((cliente) => (
            <div key={cliente.id} style={estilos.cliente}>
              <div style={{ minWidth: 0 }}>
                <strong>{cliente.nome}</strong>
                <p>{cliente.telefone}</p>
              </div>

              <div style={estilos.acoes}>
                <button
                  onClick={() => editarCliente(cliente)}
                  style={estilos.botaoEditar}
                >
                  Editar
                </button>

                <button
                  onClick={() => excluirCliente(cliente.id)}
                  style={estilos.botaoExcluir}
                >
                  Excluir
                </button>
              </div>
            </div>
          ))
        )}
      </section>
    </main>
  );
}

const estilos: Record<string, CSSProperties> = {
  pagina: {
    maxWidth: "1000px",
    margin: "auto",
    padding: "24px",
    fontFamily: "Arial, sans-serif",
    color: "#1e293b",
    background: "#f1f5f9",
    minHeight: "100vh",
  },

  cabecalho: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "15px",
    marginBottom: "25px",
  },

  titulo: {
    fontSize: "28px",
    margin: 0,
  },

  subtitulo: {
    color: "#64748b",
  },

  resumo: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "15px",
    marginBottom: "25px",
  },

  cartao: {
    background: "white",
    padding: "20px",
    borderRadius: "12px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    boxShadow: "0 2px 8px #0000000a",
  },

  formulario: {
    background: "white",
    padding: "22px",
    borderRadius: "12px",
    marginBottom: "25px",
  },

  label: {
    display: "block",
    marginTop: "15px",
    marginBottom: "7px",
    fontWeight: "bold",
  },

  input: {
    boxSizing: "border-box",
    width: "100%",
    padding: "13px",
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
    fontSize: "16px",
    marginBottom: "12px",
  },

  botaoPrincipal: {
    width: "100%",
    padding: "14px",
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    marginTop: "10px",
  },

  botaoSair: {
    padding: "10px 18px",
    background: "#334155",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },

  botaoCancelar: {
    padding: "12px",
    marginTop: "10px",
    width: "100%",
    background: "#e2e8f0",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },

  lista: {
    background: "white",
    padding: "22px",
    borderRadius: "12px",
  },

  cliente: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "12px",
    padding: "15px",
    marginTop: "12px",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
  },

  acoes: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
  },

  botaoEditar: {
    padding: "9px 14px",
    background: "#dbeafe",
    color: "#1d4ed8",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },

  botaoExcluir: {
    padding: "9px 14px",
    background: "#fee2e2",
    color: "#b91c1c",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
};
