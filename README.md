# Emily_14

Convite digital para a festa de 14 anos da Emily com tema de futebol do São Paulo FC, confirmação via WhatsApp e lista de convidados.

## Como Executar Localmente

### Pré-requisitos
- Node.js instalado

### Passos para Instalação
1. Instalar dependências:
   ```bash
   npm install
   ```

2. Configurar variáveis de ambiente:
   - Crie um arquivo `.env.local` na raiz do projeto.
   - Defina o valor de `NEXT_PUBLIC_GEMINI_API_KEY` para sua chave de API do Gemini.
   - Adicione também as chaves do Supabase se desejar salvar os dados no banco:
     ```env
     NEXT_PUBLIC_SUPABASE_URL=seu_url_aqui
     NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_aqui
     NEXT_PUBLIC_GEMINI_API_KEY=sua_chave_gemini_aqui
     ```

3. Execute o aplicativo:
   ```bash
   npm run dev
   ```
