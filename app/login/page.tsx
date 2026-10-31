"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function entrar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErro("");
    setCarregando(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    });

    setCarregando(false);

    if (error) {
      setErro("E-mail ou senha incorretos.");
      return;
    }

    router.push("/dashboard");
  }

  return (
    <main style={{
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "#eaf0f6",
      padding: "20px"
    }}>
      <form onSubmit={entrar} style={{
        background: "#fff",
        padding: "40px",
        borderRadius: "12px",
        width: "100%",
        maxWidth: "400px",
        boxShadow: "0 4px 20px #0001"
      }}>
        <h1 style={{
          textAlign: "center",
          marginBottom: "10px",
          color: "#1e293b"
        }}>
          Painel Administrativo
        </h1>

        <p style={{
          textAlign: "center",
          marginBottom: "30px",
          color: "#64748b"
        }}>
          Entre com seu e-mail e senha
        </p>

        <label>E-mail</label>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="Digite seu e-mail"
          style={{
            width: "100%",
            padding: "12px",
            margin: "8px 0 20px",
            border: "1px solid #cbd5e1",
            borderRadius: "6px"
          }}
        />

        <label>Senha</label>

        <input
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
          placeholder="Digite sua senha"
          style={{
            width: "100%",
            padding: "12px",
            margin: "8px 0 20px",
            border: "1px solid #cbd5e1",
            borderRadius: "6px"
          }}
        />

        {erro && (
          <p style={{ color: "red", marginBottom: "15px" }}>
            {erro}
          </p>
        )}

        <button
          type="submit"
          disabled={carregando}
          style={{
            width: "100%",
            padding: "14px",
            background: "#2563eb",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer"
          }}
        >
          {carregando ? "Entrando..." : "ENTRAR"}
        </button>
      </form>
    </main>
  );
}
