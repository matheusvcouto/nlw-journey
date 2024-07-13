Para criar uma constante `tb` que seja igual ao `schema`, mas excluindo as partes relacionadas a `relations`, você pode usar a utilidade `Omit` do TypeScript e criar manualmente um tipo que exclua as chaves relacionadas. Como você mencionou que as `relations` são declaradas explicitamente, podemos fazer isso com relativa facilidade.

Aqui está uma maneira de conseguir isso:

1. **Definir um tipo que omite as `relations`:**

```typescript
import { pgTable, serial, text, integer, boolean, timestamp } from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';
import { ulid } from 'ulid';
import { trips } from './trips';

// Definição das tabelas e relações
export const activities = pgTable('activities', {
  id: text('id').primaryKey().notNull().$defaultFn(ulid),
  title: text('title').notNull(),
  occurs_at: timestamp('occurs_at').notNull(),

  trip_id: text('trip_id').notNull().references(() => trips.id),
});

export const activitiesRelations = relations(activities, ({ one, many }) => ({
  trip: one(trips, {
    fields: [activities.trip_id],
    references: [trips.id]
  })
}));

// Definição do tipo que omite as relações
type SchemaWithoutRelations<T> = {
  [K in keyof T as K extends `${string}Relations` ? never : K]: T[K];
};

// Importar o esquema e aplicar o tipo para excluir as relações
import * as originalSchema from "./schema/index";

const schema: SchemaWithoutRelations<typeof originalSchema> = originalSchema;

// Configuração do banco de dados
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "~/env";

/**
 * Cache the database connection in development. This avoids creating a new connection on every HMR
 * update.
 */
const globalForDb = globalThis as unknown as {
  conn: postgres.Sql | undefined;
};

const conn = globalForDb.conn ?? postgres(env.DATABASE_URL);
if (env.NODE_ENV !== "production") globalForDb.conn = conn;

const db = drizzle(conn, { schema });

export { db, schema as tb };
```

### Explicação

1. **Definir o Tipo `SchemaWithoutRelations`:**
   - O tipo `SchemaWithoutRelations` usa mapeamento de tipos para excluir chaves que terminam com `Relations`.

2. **Importar e Aplicar o Tipo:**
   - `originalSchema` é importado do arquivo de esquema.
   - `schema` é criado a partir de `originalSchema`, mas aplica o tipo `SchemaWithoutRelations` para excluir as relações.

3. **Configurar o Banco de Dados:**
   - O restante do código configura a conexão com o banco de dados e exporta `db` e `schema` como `tb`.

Dessa forma, você consegue criar um objeto de esquema (`tb`) que exclui todas as definições de relações, conforme desejado.


O que você está vendo são mensagens de commit que seguem a convenção conhecida como **Conventional Commits**. Essa convenção é amplamente utilizada para manter um histórico de commits claro e organizado, especialmente em projetos maiores e colaborativos. Vou explicar o que significa cada uma das etiquetas (`fix`, `feat`, `refactor`, etc.) e como usá-las.

### Estrutura de Conventional Commits

A estrutura básica de uma mensagem de commit seguindo a convenção é:

```
<tipo>[escopo opcional]: <descrição>
```

#### Tipos Comuns de Commits

1. **feat**: Indica a adição de uma nova funcionalidade ao código.
   - Exemplo: `feat: add login functionality`

2. **fix**: Indica a correção de um bug.
   - Exemplo: `fix: correct header layout on mobile`

3. **docs**: Indica mudanças na documentação, como no README ou nos arquivos de documentação.
   - Exemplo: `docs: update API documentation`

4. **style**: Mudanças que não afetam o significado do código (espaços em branco, formatação, etc.).
   - Exemplo: `style: fix indentation in index.html`

5. **refactor**: Mudanças no código que não corrigem um bug nem adicionam uma funcionalidade, como melhorias no código.
   - Exemplo: `refactor: simplify authentication logic`

6. **test**: Adição ou correção de testes.
   - Exemplo: `test: add unit tests for user service`

7. **chore**: Outras mudanças que não modificam src ou arquivos de teste. Por exemplo, mudanças de configuração.
   - Exemplo: `chore: update dependencies`

8. **perf**: Mudanças que melhoram a performance.
   - Exemplo: `perf: improve database query performance`

#### Escopo Opcional

O escopo é um texto opcional que pode ser adicionado após o tipo para especificar mais detalhes sobre a área do código que foi modificada. Ele é colocado entre parênteses logo após o tipo:

```
<tipo>(<escopo>): <descrição>
```

Exemplo:

```
feat(auth): add OAuth2 login
fix(ui): correct button alignment
```

### Exemplos de Conventional Commits

Aqui estão alguns exemplos baseados na sua lista de commits:

- `fix: add missing attribute to batch-upload-list component`
  - Indica que um atributo que estava faltando foi adicionado ao componente `batch-upload-list`.

- `feat: remove public pages and app prefix`
  - Indica que páginas públicas foram removidas e um prefixo de aplicativo foi removido, adicionando uma nova funcionalidade ou modificando a existente.

- `fix: capitalization of "View batch" in UploadItemActions component`
  - Indica que houve uma correção na capitalização de uma string específica no componente `UploadItemActions`.

- `feat: add upload batch view to UploadItemActions component`
  - Indica a adição de uma nova funcionalidade, que é a visualização do lote de upload no componente `UploadItemActions`.

### Vantagens de Usar Conventional Commits

1. **Clareza**: Facilita a compreensão do que cada commit faz sem precisar olhar o código.
2. **Automação**: Permite a automação de processos como geração de changelogs e controle de versão.
3. **Histórico Limpo**: Mantém um histórico de commits organizado e fácil de navegar.

### Ferramentas

Para garantir que seus commits sigam essa convenção, você pode usar ferramentas como o **Commitlint** que valida as mensagens de commit.

### Conclusão

Seguir a convenção de Conventional Commits ajuda a manter o histórico do projeto limpo e compreensível, beneficiando todos os membros da equipe e facilitando a manutenção do código a longo prazo.