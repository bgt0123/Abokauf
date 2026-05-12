# TypeScript API für den React-Workshop

## Dateien

Lege beide Dateien in den gleichen Ordner, z. B.:

```txt
src/api/api.ts
src/api/_Database.ts
```

## Import in einer React-/TypeScript-Datei

```ts
import { getAllCustomers, saveCustomer, type NewCustomer } from './api/api';
```

Beispiel:

```ts
const loadCustomers = async () => {
  const result = await getAllCustomers();
  console.log(result.allCustomers);
};
```

## Wichtig

In TypeScript nicht mehr so importieren:

```ts
import { getAllCustomers } from './api.js';
```

Sondern ohne `.js`-Endung:

```ts
import { getAllCustomers } from './api';
```

Die Datei `_Database.ts` enthält jetzt Interfaces wie `Customer`, `Abo`, `NewCustomer`, `NewAbo` usw.
