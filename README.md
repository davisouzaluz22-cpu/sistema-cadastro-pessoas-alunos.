# Sistema de Cadastro de Pessoas e Alunos

Projeto web com Next.js + Supabase. O e-mail administrador está configurado no código e na política de segurança do banco: `Davisouzaluz22@gmail.com`.

## O que já está incluído
- Login por e-mail e senha
- Restrição de interface ao e-mail administrador
- Segurança de banco com Row Level Security (RLS)
- Cadastro, consulta, pesquisa, filtro, edição e exclusão
- Exportação dos registros filtrados em CSV
- Layout adaptável para celular e computador

## Publicação — passo a passo

### 1. Criar o banco e autenticação no Supabase
1. Acesse https://supabase.com e crie sua conta/projeto.
2. Guarde a senha do banco em local seguro; não a envie por mensagem.
3. No painel do projeto, abra **SQL Editor**.
4. Copie e execute todo o conteúdo de `supabase/schema.sql`.
5. Vá a **Authentication → Users → Add user**.
6. Crie o usuário com o e-mail `Davisouzaluz22@gmail.com` e uma senha forte. Se houver opção de confirmação de e-mail, confirme o usuário conforme o fluxo exibido pelo Supabase.
7. Em **Authentication → Providers → Email**, mantenha habilitado o provedor Email. Desative cadastro público/signups se a opção estiver disponível, pois este sistema é de administrador único.

### 2. Configurar o projeto
1. Instale Node.js LTS: https://nodejs.org
2. Crie um repositório privado no GitHub: https://github.com
3. Envie os arquivos deste projeto para o repositório.
4. No Supabase, abra **Project Settings → API** (ou **Data API**) e copie a Project URL e a chave publicável/anon (nunca use a `service_role` no navegador).
5. Na raiz do projeto, crie `.env.local` usando `.env.example` como modelo:
   - `NEXT_PUBLIC_SUPABASE_URL` = URL do projeto
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = chave publicável/anon

### 3. Publicar na Vercel
1. Acesse https://vercel.com e entre com GitHub.
2. Clique em **Add New → Project** e importe o repositório.
3. Em **Environment Variables**, adicione as duas variáveis acima.
4. Clique em **Deploy**.
5. A Vercel fornecerá um endereço HTTPS terminado em `vercel.app`. Esse será o link do seu sistema.

## Testes antes de usar
- Entre com o e-mail administrador.
- Cadastre uma pessoa e um aluno.
- Teste pesquisa, edição, exclusão e exportação.
- Teste em janela anônima e em outro dispositivo.
- Confira em Supabase → Table Editor → people se os registros foram salvos.

## Segurança e privacidade
- A senha deve ser criada diretamente no Supabase e nunca compartilhada no chat.
- A chave `service_role` é secreta e nunca deve ser colocada no frontend, no GitHub ou em variáveis `NEXT_PUBLIC_`.
- A política RLS limita operações na tabela ao e-mail administrador definido no SQL.
- Não use dados reais de crianças/alunos até revisar as obrigações de privacidade, consentimento, acesso e retenção aplicáveis (incluindo LGPD). Evite armazenar dados sensíveis.
- Configure backups no Supabase e proteja também o acesso à conta de e-mail.
- O código atual autoriza um único e-mail. Para trocar o administrador, altere o e-mail tanto em `app/page.tsx` quanto em `supabase/schema.sql` e aplique a nova política no banco.

## Observação importante
Este pacote é o projeto pronto para configuração e publicação, não um site já hospedado. A publicação exige que você crie e autorize suas próprias contas Supabase, GitHub e Vercel e execute as etapas acima. Não compartilhe senhas ou códigos de acesso.
