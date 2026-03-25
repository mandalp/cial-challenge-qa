# Teste Prático CIAL - Cypress

## Tecnologias

- **Cypress 13**: Framework de testes E2E e API
- **Node.js**: Runtime JavaScript
- **Docker**: Containerização para execução isolada

## Arquitetura do Projeto

Estrutura organizada com separação clara de responsabilidades:

- **cypress/e2e/web.cy.js** → Testes frontend (E2E) das páginas web com fixtures parametrizadas
- **cypress/e2e/api.cy.js** → Testes backend/API validando requisições e transformações parametrizáveis
- **cypress/support/actions/** → Page Actions que encapsulam interações por página
  - `login.actions.js` → Ações de login
- **cypress/support/commands.js** → Comandos customizados avançados (API, validações, transformações)

## API Utilizada

**Endpoint**: `GET https://jsonplaceholder.typicode.com/users`

**Parametrização via Cypress.env**:
- Pode ser configurada via `Cypress.env('API_BASE_URL')`
- Default: `https://jsonplaceholder.typicode.com`
- Configurada em `cypress.config.js`

## Transformações RegEx 

Três transformações aplicadas nos dados da API usando expressões regulares:

1. **emailDomain**: `user.email.replace(/^[^@]+@/, '')`
   - Remove tudo até o @ (inclusive)
   - Extrai apenas o domínio do email

2. **phoneDigits**: `user.phone.replace(/\D/g, '')`
   - Remove caracteres não numéricos
   - Mantém apenas dígitos do telefone

3. **companyKey**: `user.company.name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-')`
   - Remove caracteres especiais do nome da empresa
   - Converte espaços para hífens
   - Cria slug único para identificação

## Comandos Customizados (commands.js) 

###  **cy.getUsers(options)**
Comando parametrizável para buscar e processar usuários:

**Opções disponíveis**:
- `baseUrl`: URL base da API (default: Cypress.env('API_BASE_URL'))
- `route`: Rota da API (default: '/users')
- `tldFilter`: Filtro por TLD de email (ex: 'biz')

**Exemplos de uso**:
```javascript
// Uso padrão
cy.getUsers()

// Com filtro por TLD
cy.getUsers({ tldFilter: 'biz' })

// Com URL customizada
cy.getUsers({ baseUrl: 'https://api-custom.com' })
```

###  **Comandos de Validação**

#### **cy.validateUserContract(user)**
Valida estrutura completa do contrato da API:
- Campos obrigatórios: id, name, email, phone, username, website
- Campos aninhados: address (street, suite, city, zipcode, geo.lat/lng)
- Campos aninhados: company (name, catchPhrase, bs)
- Tipos e formatos específicos

#### **cy.validateUserTransforms(user)**
Valida apenas os campos transformados:
- emailDomain: formato sem @ e com ponto
- phoneDigits: apenas números com mínimo de 7 dígitos
- companyKey: formato slug com letras, números e hífens

#### **cy.validateUser(user)**
Validação completa: contrato + transformações

## Componentes Frontend Testados

Testes E2E para as seguintes páginas do The Internet:

1. **Login** (`/login`) - Autenticação com credenciais válidas/inválidas usando fixtures
2. **CheckBoxes** (`/checkboxes`) - Marcar e desmarcar checkboxes
3. **Dropdown** (`/dropdown`) - Selecionar opções de menu suspenso
4. **Drag and Drop** (`/drag_and_drop`) - Arrastar elementos entre colunas com DataTransfer
5. **Upload File** (`/upload`) - Upload de arquivos com validação
6. **Redirect** (`/redirector`) - Redirecionamento entre páginas

## Estrutura dos Testes API

###  **Testes Implementados**

#### **Sem Filtro**
1. **Estrutura e Tipos**: Validação completa do contrato de todos os 10 usuários
2. **emailDomain**: Extração e validação de domínios de todos os emails
3. **phoneDigits**: Normalização telefônica para formato numérico
4. **companyKey**: Geração de slug único para cada empresa
5. **Transformações**: Validação específica dos campos transformados

#### **Com Filtro por TLD**
1. **Parametrização**: Filtragem por TLD (.biz retorna exatamente 3 usuários)


## Instalação

```bash
npm install
```

## Execução Local

```bash
# Executar todos os testes
npx cypress run

# Abrir interface visual
npx cypress open
```

## Execução no Docker

```bash
# Buildar imagem
docker build -t cypress-teste .

# Executar todos os testes
docker run --rm cypress-teste

# Executar apenas testes web
docker run --rm cypress-teste --spec "cypress/e2e/web.cy.js"

# Executar apenas testes API
docker run --rm cypress-teste --spec "cypress/e2e/api.cy.js"
```

## Configuração de Ambiente

A URL base da API pode ser configurada das seguintes formas:

1. **Via arquivo de configuração** (`cypress.config.js`):
```javascript
env: {
  API_BASE_URL: 'https://jsonplaceholder.typicode.com'
}
```

2. **Via linha de comando**:
```bash
npx cypress run --env API_BASE_URL=https://sua-api.com
```

3. **Via variáveis de ambiente**:
```bash
export CYPRESS_API_BASE_URL=https://sua-api.com
npx cypress run
```


