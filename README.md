# Resolução do Teste Prático Back-end BeTalent

## Instruções de como rodar e testar o projeto

### `ATENÇÃO: Não esqueça de remover a extensão (.example) do arquivo (.env). É nele que estão  as variavéis de ambiente necessárias para a aplicação se conectar ao banco de dados.`

- #### Após baixar o projeto em sua máquina, abra o terminal e navegue até a pasta **BE-TESTE**. Em seguida, execute o comando abaixo:

```bash
 docker compose up --build
```
- #### A execução deste comando resultará na construção (ou reconstrução) das imagens, configuração e criação dos containers para cada serviço definido, comunicação entre esses serviços e a execução das tarefas de inicialização presentes no entrypoint (execução das migrations e seeders, e inicia o server com live reload)

### **A aplicação ficará disponível em http://localhost:3333.**

## OBSERVAÇÕES: 
### - No endpoint de cadastro de compra, até mesmo as compras que falharem nos dois gateways serão registradas, com status de falha, obviamente. Essa escolha foi feita visando facilitar a obtenção de históricos dos clientes e possíveis auditorias.

### - Nos endpoints detalhamento de cliente e listagem de compras existem filtros de acordo com o status (SUCCESS ou FAILED), no parâmetro de rota. Caso nenhum filtro seja passado, todos os recursos serão retornados

## Logo abaixo estão alguns exemplos de requisições que podem ser feitas nas rotas presentes no projeto.

### `ATENÇÃO: Caso opte por não criar as rotas manualmente, basta copiar o arquivo (insomnia.json) e importá-lo no insomnia. Nele contém todas as rotas e exemplos de requisição.`

## **Endpoints**

### **Login**

```http
POST /login
```

```json
{
  "email": "dev@betalent.tech",
  "password": "123456"
}
```

#### **Exemplo de resposta**

```http
HTTP Status 200
```

```json
{
  "type": "Bearer",
  "token": "oat_Mg.Ymw5c1VlckpXbktYcUdKQlBlUEl6dUliTGZzNkJkT3hPUHpHbkt0aDM2NzM2ODQ4NDQ"
}
```

### **Realizar uma compra informando o produto**

```http
POST /transactions
```

```json
{
	"clientName": "client",
	"clientEmail": "client@email.com",
	"products": [
		{
			"id": 1,
			"quantity": 2
		},
		{
			"id": 2,
			"quantity": 1
		}
	],
	"cardNumber": "5569000000006063",
	"cvv": "010"
}
```

#### **Exemplo de resposta**

```http
HTTP Status 200
```

```json
{
  "message": "Purchase processed successfully",
  "transaction": {
    "clientId": 1,
    "gatewayId": 1,
    "externalId": "cafb468b-3289-48b8-86c6-40280ee30bf0",
    "status": "SUCCESS",
    "amount": 7000,
    "cardLastNumbers": "6063",
    "createdAt": "2025-03-06T03:10:32.660+00:00",
    "updatedAt": "2025-03-06T03:10:32.660+00:00",
    "id": 1
  }
}
```

## **ATENÇÃO**: Todas as funcionalidades (endpoints) a seguir, a partir desse ponto, exigem o token de autenticação do usuário logado, recebido no header com o formato Bearer Token.

### **Ativar/desativar um gateway**

```http
PUT /gateway/status/:id
```

```json
{
  "is_active": true
}
```

#### **Exemplo de resposta**

```http
HTTP Status 200
```

```json
{
  "message": "Gateway status updated successfully",
  "gateway": {
    "id": 1,
    "name": "Gateway 1",
    "isActive": true,
    "priority": 1,
    "createdAt": "2025-03-05T18:22:20.000+00:00",
    "updatedAt": "2025-03-05T19:16:20.922+00:00"
  }
}
```

### **Alterar a prioridade de um gateway**

```http
PUT /gateway/priority/:id
```

```json
{
  "priority": 2
}
```

#### **Exemplo de resposta**

```http
HTTP Status 200
```

```json
{
  "message": "Gateway priority updated successfully",
  "gateway": {
    "id": 1,
    "name": "Gateway 1",
    "isActive": 1,
    "priority": 2,
    "createdAt": "2025-03-05T18:22:20.000+00:00",
    "updatedAt": "2025-03-05T19:16:38.032+00:00"
  }
}
```

### **Registrar novo usuário**

```http
POST /users
```

```json
{
  "name": "tester",
  "email": "tester@email.com",
  "password": "usertest123",
  "role": "USER"
}
```

#### **Exemplos de resposta**

```http
HTTP Status 200
```

```json
{
  "message": "User created successfully",
  "user": {
    "name": "tester",
    "email": "tester@email.com",
    "role": "USER",
    "createdAt": "2025-03-06T03:01:22.952+00:00",
    "updatedAt": "2025-03-06T03:01:22.952+00:00",
    "id": 2
  }
}
```

### **Atualizar dados de um usuário existente**

```http
PUT /users/:id
```

```json
{
  "name": "User update",
  "email": "userupdate@email.com",
  "password": "userupdate123",
  "role": "FINANCE"
}
```

#### **Exemplos de resposta**

```http
HTTP Status 200
```

```json
{
  "message": "User updated successfully",
  "user": {
    "id": 2,
    "name": "User update",
    "email": "userupdate@email.com",
    "role": "FINANCE",
    "createdAt": "2025-03-06T03:01:22.000+00:00",
    "updatedAt": "2025-03-06T03:02:35.080+00:00"
  }
}
```

### **Detalhar um usuário**

```http
GET /users/:id
```

```javascript
// Sem conteúdo no corpo (body) da requisição
```

#### **Exemplos de resposta**

```http
HTTP Status 200
```

```json
{
  "user": {
    "id": 1,
    "name": "Admin",
    "email": "dev@betalent.tech",
    "role": "ADMIN",
    "createdAt": "2025-03-06T02:54:43.000+00:00",
    "updatedAt": "2025-03-06T02:54:43.000+00:00"
  }
}
```

### **Listar todos os usuários**

```http
GET /users
```

```javascript
// Sem conteúdo no corpo (body) da requisição
```

#### **Exemplos de resposta**

```http
HTTP Status 200
```

```json
{
  "users": [
    {
      "id": 1,
      "name": "Admin",
      "email": "dev@betalent.tech",
      "role": "ADMIN",
      "createdAt": "2025-03-06T03:06:15.000+00:00",
      "updatedAt": "2025-03-06T03:06:15.000+00:00"
    },
    {
      "id": 2,
      "name": "User update",
      "email": "userupdate@email.com",
      "role": "FINANCE",
      "createdAt": "2025-03-06T03:01:22.000+00:00",
      "updatedAt": "2025-03-06T03:02:35.080+00:00"
    }
  ]
}
```

### **Deletar um usuário**

```http
DELETE /users/:id
```

```javascript
// Sem conteúdo no corpo (body) da requisição
```

#### **Exemplos de resposta**

```http
HTTP Status 200
```

```json
{
  "message": "User successfully removed"
}
```

### **Registrar novo produto**

```http
POST /products
```

```json
{
  "name": "TV Smart",
  "amount": 1000
}
```

#### **Exemplos de resposta**

```http
HTTP Status 200
```

```json
{
  "message": "Product created successfully",
  "product": {
    "name": "TV Smart",
    "amount": 1000,
    "createdAt": "2025-03-06T03:10:21.945+00:00",
    "updatedAt": "2025-03-06T03:10:21.945+00:00",
    "id": 1
  }
}
```

### **Atualizar dados de um produto existente**

```http
PUT /products/:id
```

```json
{
  "name": "Samsung S21",
  "amount": 5000
}
```

#### **Exemplos de resposta**

```http
HTTP Status 200
```

```json
{
  "message": "Product updated successfully",
  "product": {
    "id": 1,
    "name": "Samsung S21",
    "amount": 5000,
    "createdAt": "2025-03-05T18:34:52.000+00:00",
    "updatedAt": "2025-03-05T18:35:37.553+00:00"
  }
}
```

### **Detalhar um produto**

```http
GET /products/:id
```

```javascript
// Sem conteúdo no corpo (body) da requisição
```

#### **Exemplos de resposta**

```http
HTTP Status 200
```

```json
{
  "product": {
    "id": 1,
    "name": "Samsung S21",
    "amount": 5000,
    "createdAt": "2025-03-06T03:01:09.000+00:00",
    "updatedAt": "2025-03-06T03:01:09.000+00:00"
  }
}
```

### **Listar todos os produtos**

```http
GET /products
```

```javascript
// Sem conteúdo no corpo (body) da requisição
```

#### **Exemplos de resposta**

```http
HTTP Status 200
```

```json
{
  "products": [
    {
      "id": 1,
      "name": "Samsung S21",
      "amount": 5000,
      "createdAt": "2025-03-06T03:10:21.000+00:00",
      "updatedAt": "2025-03-06T03:10:21.000+00:00"
    }
  ]
}
```

### **Deletar um produto**

```http
DELETE /products/:id
```

```javascript
// Sem conteúdo no corpo (body) da requisição
```

#### **Exemplos de resposta**

```http
HTTP Status 200
```

```json
{
  "message": "Product removed successfully"
}
```

### **Listar todos os clientes**

```http
GET /clients
```

```javascript
// Sem conteúdo no corpo (body) da requisição
```

#### **Exemplos de resposta**

```http
HTTP Status 200
```

```json
{
  "clients": [
    {
      "id": 1,
      "name": "client",
      "email": "client@email.com",
      "createdAt": "2025-03-06T03:10:32.000+00:00",
      "updatedAt": "2025-03-06T03:10:32.000+00:00"
    }
  ]
}
```

### **Detalhar um cliente e todas as suas compras**

```http
GET /clients/:id
```

#### **ou, caso queira utilizar filtros de compras que deram certo ou errado, utilize o caminho a seguir**

```http
GET /clients/:id?status=success
```

```http
GET /clients/:id?status=failed
```

```javascript
// Sem conteúdo no corpo (body) da requisição
```

#### **Exemplos de resposta**

```http
HTTP Status 200
```

```json
{
  "client": {
    "id": 1,
    "name": "client",
    "email": "client@email.com",
    "transactions": [
      {
        "id": 1,
        "externalId": "78c8adea-d817-4575-aa5d-cd7d3b724a26",
        "status": "SUCCESS",
        "amount": 2000,
        "cardLastNumbers": "6063",
        "transactionProducts": [
          {
            "product": {
              "id": 1,
              "name": "Samsung S21",
              "amount": 5000,
              "quantity": 2
            }
          }
        ]
      }
    ]
  }
}
```

### **Listar todas as compras**

```http
GET /transactions
```

#### **ou, caso queira utilizar filtros de compras que deram certo ou errado, utilize os caminhos a seguir**

```http
GET /transactions/:id?status=success
```

```http
GET /transactions/:id?status=failed
```

```javascript
// Sem conteúdo no corpo (body) da requisição
```

#### **Exemplos de resposta**

```http
HTTP Status 200
```

```json
{
  "transactions": [
    {
      "id": 2,
      "externalId": "78c8adea-d817-4575-aa5d-cd7d3b724a26",
      "status": "SUCCESS",
      "amount": 2000,
      "cardLastNumbers": "6063",
      "client": {
        "id": 1,
        "name": "client",
        "email": "client@email.com"
      },
      "transactionProducts": [
        {
          "id": 2,
          "transactionId": 2,
          "quantity": 2,
          "product": {
            "id": 1,
            "name": "TV Smart",
            "amount": 1000
          }
        }
      ]
    }
  ]
}
```

### **Detalhar uma compra**

```http
GET /transactions/:id
```

```javascript
// Sem conteúdo no corpo (body) da requisição
```

#### **Exemplos de resposta**

```http
HTTP Status 200
```

```json
{
  "transaction": {
    "id": 1,
    "externalId": "cafb468b-3289-48b8-86c6-40280ee30bf0",
    "status": "SUCCESS",
    "amount": 10000,
    "cardLastNumbers": "6063",
    "client": {
      "id": 1,
      "name": "client",
      "email": "client@email.com"
    },
    "transactionProducts": [
      {
        "id": 1,
        "productId": 1,
        "quantity": 2,
        "product": {
          "id": 1,
          "name": "Samsung S21",
          "amount": 5000
        }
      }
    ]
  }
}
```

### **Reembolso de uma compra**

```http
POST /transactions/:id/charge_back
```

```javascript
// Sem conteúdo no corpo (body) da requisição
```

#### **Exemplos de resposta**

```http
HTTP Status 200
```

```json
{
  "message": "Chargeback successful",
  "transaction": {
    "id": 1,
    "clientId": 1,
    "gatewayId": 1,
    "externalId": "cafb468b-3289-48b8-86c6-40280ee30bf0",
    "status": "CHARGED_BACK",
    "amount": 10000,
    "cardLastNumbers": "6063",
    "createdAt": "2025-03-06T03:10:32.000+00:00",
    "updatedAt": "2025-03-06T03:10:39.549+00:00"
  }
}
```
