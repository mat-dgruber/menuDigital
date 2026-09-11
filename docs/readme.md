# Cardápio Digital — Template (Astro + Decap CMS)

Template de cardápio digital estático, mobile-first e altamente performático, gerenciável pelo próprio estabelecimento via **Decap CMS**.

- **Zero servidor e zero banco de dados:** Arquitetura 100% Jamstack / SSG.
- **Hospedagem gratuita:** Deploy contínuo na Netlify com CI/CD nativo.
- **Personalização simplificada:** Adapte para novos clientes trocando apenas um arquivo JSON e o conteúdo do menu.

---

## 1. Execução Local

### Pré-requisitos
- Node.js (v18+)
- npm ou pnpm

### Instalação e Inicialização

```bash
# Instalar dependências
npm install

# Iniciar servidor local de desenvolvimento (disponível em http://localhost:4321)
npm run dev
```

### Testar o CMS Localmente (Sem Netlify)

1. Em `public/admin/config.yml`, configure temporariamente o backend para modo proxy local:

```yaml
backend:
  name: proxy
  proxy_url: http://localhost:8081/api/v1
  branch: main

local_backend: true
```

2. Em um segundo terminal, inicialize o servidor proxy do Decap:

```bash
npx decap-server
```

3. Acesse `http://localhost:4321/admin/` para testar as edições.

> [!WARNING]
> Certifique-se de reverter a alteração do `config.yml` para `backend: name: git-gateway` antes de enviar as alterações para a branch `main`.

---

## 2. Publicação na Netlify

1. Envie o projeto para um repositório no GitHub.
2. Acesse [app.netlify.com](https://app.netlify.com) → **Add new site** → **Import from Git** → selecione o repositório.
3. Valide as opções de compilação detectadas automaticamente:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
4. Clique em **Deploy**. O site será publicado em um subdomínio temporário `*.netlify.app`.

A cada novo `git push` na branch `main`, o pipeline de CI/CD da Netlify compilará e atualizará o site automaticamente.

---

## 3. Ativação do Editor (Netlify Identity + Git Gateway)

Essa etapa possibilita que o proprietário do estabelecimento faça login em `/admin/` e atualize o cardápio sem manipular código.

1. No painel do site na Netlify, acesse: **Site configuration** → **Identity** → **Enable Identity**.
2. Em **Identity** → **Registration preferences**, selecione **Invite only** (para restringir acesso apenas aos usuários convidados).
3. Em **Identity** → **Services** → **Git Gateway**, clique em **Enable Git Gateway**.
4. Certifique-se de que o arquivo `public/admin/config.yml` contém a configuração de produção:

```yaml
backend:
  name: git-gateway
  branch: main
```

### Convidar o Usuário Administrador

1. No painel da Netlify, navegue até **Identity** → **Invite users**.
2. Insira o e-mail do cliente/proprietário.
3. O usuário receberá um convite por e-mail para cadastrar sua senha e poderá acessar o painel em `https://SEU-DOMINIO/admin/`.

---

## 4. Configuração de Domínio Próprio

> [!IMPORTANT]
> Registre o domínio sempre utilizando o **CPF/CNPJ e dados de faturamento do cliente**.

1. Adquira o domínio (ex.: [registro.br](https://registro.br) para extensões `.com.br`).
2. No painel da Netlify: **Domain management** → **Add a domain** → digite o domínio cadastrado.
3. Configure as zonas de DNS conforme orientado pela Netlify (ou aponte diretamente para os *nameservers* da Netlify).
4. O certificado SSL/TLS (HTTPS via Let's Encrypt) é emitido e renovado de forma 100% automatizada.

---

## 5. Guia de Edição para o Cliente (Handoff)

Orientações para repassar ao proprietário ou incluir no vídeo de treinamento:

Acesse **`https://SEU-DOMINIO/admin/`** e realize o login.

- **Adicionar item:** Cardápio → *New Item* → preencha nome, descrição, preço, categoria e foto → clique em **Publish**.
- **Atualizar preços e detalhes:** Abra o item desejado → realize as modificações → clique em **Publish**.
- **Marcar item como esgotado:** Abra o item → desmarque a opção **Disponível** → clique em **Publish** (o produto será exibido esmaecido no site).
- **Destacar produtos:** Marque a opção **Destaque** para adicionar o selo visual de estrela (⭐).
- **Dados do estabelecimento:** Configurações → Dados do local (para alterar nome, cores, número de WhatsApp, horário de funcionamento e redes sociais).

> [!NOTE]
> Cada alteração salva aciona automaticamente um novo deploy estático que entra no ar em aproximadamente 1 minuto.

> [!TIP]
> **Otimização de Imagens:** Oriente o cliente a carregar fotografias já comprimidas (largura máxima em torno de 1200px) para assegurar o carregamento veloz do cardápio em redes móveis.

---

## 6. Reaproveitar o Template para Novos Clientes

Para criar uma nova instalação com base neste template:

1. Crie um novo repositório a partir desta base.
2. Atualize o arquivo `src/data/settings.json` com os dados, paleta de cores e categorias do novo cliente.
3. Substitua os arquivos markdown demonstrativos em `src/content/menu/` pelos itens reais.
4. Ajuste as opções do campo `categoria` em `public/admin/config.yml` para sincronizar com as categorias do `settings.json`.
5. Realize o deploy na Netlify e ative o Netlify Identity (passos 2 e 3).

---

## 7. Checklist de Entrega e Handoff

- [ ] Conteúdo real (fotos, descrições, preços e categorias) publicado
- [ ] `src/data/settings.json` parametrizado com identidade e contatos do cliente
- [ ] Netlify Identity e Git Gateway configurados e ativos
- [ ] Usuário administrador convidado e fluxo de login/edição validado
- [ ] Domínio próprio apontado com certificado SSL ativo (HTTPS)
- [ ] Metadados de SEO e preview Open Graph validados no compartilhamento via WhatsApp
- [ ] QR Code para as mesas gerado e testado
- [ ] Perfil da Empresa no Google (Google Meu Negócio) configurado com link do cardápio
- [ ] Vídeo tutorial de gerenciamento gravado e entregue ao cliente
- [ ] Liquidação financeira concluída (50% restante)
- [ ] Data de encerramento da garantia/suporte gratuito registrada para transição para suporte recorrente
