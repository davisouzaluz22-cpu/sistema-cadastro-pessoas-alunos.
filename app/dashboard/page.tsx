"use client";

import { useEffect, useState } from "react"; import { useRouter } from "next/navigation"; import { supabase } from "@/lib/supabase";

type Cliente = { id: number; nome: string; telefone: string; };

export default function Dashboard() { const router = useRouter();

const [clientes, setClientes] = useState<Cliente[]>([]); const [nome, setNome] = useState(""); const [telefone, setTelefone] = useState(""); const [pesquisa, setPesquisa] = useState(""); const [carregando, setCarregando] = useState(true);

async function verificarUsuario() { const { data } = await supabase.auth.getUser();

if (!data.user) {
  router.replace("/login");
  return;
}

await carregarClientes();
setCarregando(false);


}

async function carregarClientes() { const { data, error } = await supabase .from("clientes") .select("*") .order("nome");

if (!error) {
  setClientes(data || []);
}


}

async function cadastrarCliente(e: React.FormEvent<HTMLFormElement>) { e.preventDefault();

const { error } = await supabase
  .from("clientes")
  .insert([{ nome, telefone }]);

if (error) {
  alert("Erro ao cadastrar cliente: " + error.message);
  return;
}

setNome("");
setTelefone("");
carregarClientes();


}

async function excluirCliente(id: number) { if (!confirm("Deseja realmente excluir este cliente?")) return;

const { error } = await supabase
  .from("clientes")
  .delete()
  .eq("id", id);

if (error) {
  alert("Erro ao excluir cliente.");
  return;
}

carregarClientes();


}

async function sair() { await supabase.auth.signOut(); router.replace("/login"); }

useEffect(() => { verificarUsuario(); }, []);

const clientesFiltrados = clientes.filter((cliente) =>
  `${cliente.nome} ${cliente.telefone}`
    .toLowerCase()
    .includes(pesquisa.toLowerCase())
);
if (carregando) return <p>Carregando...</p>;

return ( <main style={{ padding: "30px", maxWidth: "1000px", margin: "auto" }}> <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}> <h1>Painel de Clientes</h1> <button onClick={sair}>Sair</button> </header>

  <form onSubmit={cadastrarCliente} style={{
    background: "white",
    padding: "20px",
    borderRadius: "10px",
    marginBottom: "25px"
  }}>
    <h2>Novo Cliente</h2>

    <input
      placeholder="Nome do cliente"
      value={nome}
      onChange={(e) => setNome(e.target.value)}
      required
    />

    <input
      placeholder="Telefone"
      value={telefone}
      onChange={(e) => setTelefone(e.target.value)}
      required
    />

    <button type="submit">Cadastrar cliente</button>
  </form>

  <section>
    <h2>Lista de Clientes</h2>

    <input
      placeholder="Pesquisar por nome ou telefone"
      value={pesquisa}
      onChange={(e) => setPesquisa(e.target.value)}
      style={{ width: "100%", padding: "12px", margin: "15px 0" }}
    />

    {clientesFiltrados.map((cliente) => (
      <div key={cliente.id} style={{
        background: "white",
        padding: "15px",
        marginBottom: "10px",
        borderRadius: "8px",
        display: "flex",
        justifyContent: "space-between"
      }}>
        <div>
          <strong>{cliente.nome}</strong>
          <p>{cliente.telefone}</p>
        </div>

        <button onClick={() => excluirCliente(cliente.id)}>
          Excluir
        </button>
      </div>
    ))}
  </section>
</main>


); }
