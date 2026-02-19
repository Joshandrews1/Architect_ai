# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `example`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

**If you're looking for the `React README`, you can find it at [`dataconnect-generated/react/README.md`](./react/README.md)**

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*ListRecommendationsForGrowthAudit*](#listrecommendationsforgrowthaudit)
  - [*GetUserByEmail*](#getuserbyemail)
- [**Mutations**](#mutations)
  - [*CreateBusinessProfile*](#createbusinessprofile)
  - [*UpdateStrategySessionClientNotes*](#updatestrategysessionclientnotes)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `example`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@dataconnect/generated` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## ListRecommendationsForGrowthAudit
You can execute the `ListRecommendationsForGrowthAudit` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listRecommendationsForGrowthAudit(vars: ListRecommendationsForGrowthAuditVariables): QueryPromise<ListRecommendationsForGrowthAuditData, ListRecommendationsForGrowthAuditVariables>;

interface ListRecommendationsForGrowthAuditRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListRecommendationsForGrowthAuditVariables): QueryRef<ListRecommendationsForGrowthAuditData, ListRecommendationsForGrowthAuditVariables>;
}
export const listRecommendationsForGrowthAuditRef: ListRecommendationsForGrowthAuditRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listRecommendationsForGrowthAudit(dc: DataConnect, vars: ListRecommendationsForGrowthAuditVariables): QueryPromise<ListRecommendationsForGrowthAuditData, ListRecommendationsForGrowthAuditVariables>;

interface ListRecommendationsForGrowthAuditRef {
  ...
  (dc: DataConnect, vars: ListRecommendationsForGrowthAuditVariables): QueryRef<ListRecommendationsForGrowthAuditData, ListRecommendationsForGrowthAuditVariables>;
}
export const listRecommendationsForGrowthAuditRef: ListRecommendationsForGrowthAuditRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listRecommendationsForGrowthAuditRef:
```typescript
const name = listRecommendationsForGrowthAuditRef.operationName;
console.log(name);
```

### Variables
The `ListRecommendationsForGrowthAudit` query requires an argument of type `ListRecommendationsForGrowthAuditVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListRecommendationsForGrowthAuditVariables {
  growthAuditId: UUIDString;
}
```
### Return Type
Recall that executing the `ListRecommendationsForGrowthAudit` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListRecommendationsForGrowthAuditData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListRecommendationsForGrowthAuditData {
  recommendations: ({
    id: UUIDString;
    category: string;
    description: string;
    effortScore?: number | null;
    impactScore?: number | null;
    priority: number;
  } & Recommendation_Key)[];
}
```
### Using `ListRecommendationsForGrowthAudit`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listRecommendationsForGrowthAudit, ListRecommendationsForGrowthAuditVariables } from '@dataconnect/generated';

// The `ListRecommendationsForGrowthAudit` query requires an argument of type `ListRecommendationsForGrowthAuditVariables`:
const listRecommendationsForGrowthAuditVars: ListRecommendationsForGrowthAuditVariables = {
  growthAuditId: ..., 
};

// Call the `listRecommendationsForGrowthAudit()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listRecommendationsForGrowthAudit(listRecommendationsForGrowthAuditVars);
// Variables can be defined inline as well.
const { data } = await listRecommendationsForGrowthAudit({ growthAuditId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listRecommendationsForGrowthAudit(dataConnect, listRecommendationsForGrowthAuditVars);

console.log(data.recommendations);

// Or, you can use the `Promise` API.
listRecommendationsForGrowthAudit(listRecommendationsForGrowthAuditVars).then((response) => {
  const data = response.data;
  console.log(data.recommendations);
});
```

### Using `ListRecommendationsForGrowthAudit`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listRecommendationsForGrowthAuditRef, ListRecommendationsForGrowthAuditVariables } from '@dataconnect/generated';

// The `ListRecommendationsForGrowthAudit` query requires an argument of type `ListRecommendationsForGrowthAuditVariables`:
const listRecommendationsForGrowthAuditVars: ListRecommendationsForGrowthAuditVariables = {
  growthAuditId: ..., 
};

// Call the `listRecommendationsForGrowthAuditRef()` function to get a reference to the query.
const ref = listRecommendationsForGrowthAuditRef(listRecommendationsForGrowthAuditVars);
// Variables can be defined inline as well.
const ref = listRecommendationsForGrowthAuditRef({ growthAuditId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listRecommendationsForGrowthAuditRef(dataConnect, listRecommendationsForGrowthAuditVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.recommendations);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.recommendations);
});
```

## GetUserByEmail
You can execute the `GetUserByEmail` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getUserByEmail(vars: GetUserByEmailVariables): QueryPromise<GetUserByEmailData, GetUserByEmailVariables>;

interface GetUserByEmailRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetUserByEmailVariables): QueryRef<GetUserByEmailData, GetUserByEmailVariables>;
}
export const getUserByEmailRef: GetUserByEmailRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getUserByEmail(dc: DataConnect, vars: GetUserByEmailVariables): QueryPromise<GetUserByEmailData, GetUserByEmailVariables>;

interface GetUserByEmailRef {
  ...
  (dc: DataConnect, vars: GetUserByEmailVariables): QueryRef<GetUserByEmailData, GetUserByEmailVariables>;
}
export const getUserByEmailRef: GetUserByEmailRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getUserByEmailRef:
```typescript
const name = getUserByEmailRef.operationName;
console.log(name);
```

### Variables
The `GetUserByEmail` query requires an argument of type `GetUserByEmailVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetUserByEmailVariables {
  email: string;
}
```
### Return Type
Recall that executing the `GetUserByEmail` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetUserByEmailData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetUserByEmailData {
  users: ({
    id: UUIDString;
    displayName: string;
    email: string;
    phoneNumber?: string | null;
    companyName?: string | null;
    industry?: string | null;
    createdAt: TimestampString;
  } & User_Key)[];
}
```
### Using `GetUserByEmail`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getUserByEmail, GetUserByEmailVariables } from '@dataconnect/generated';

// The `GetUserByEmail` query requires an argument of type `GetUserByEmailVariables`:
const getUserByEmailVars: GetUserByEmailVariables = {
  email: ..., 
};

// Call the `getUserByEmail()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getUserByEmail(getUserByEmailVars);
// Variables can be defined inline as well.
const { data } = await getUserByEmail({ email: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getUserByEmail(dataConnect, getUserByEmailVars);

console.log(data.users);

// Or, you can use the `Promise` API.
getUserByEmail(getUserByEmailVars).then((response) => {
  const data = response.data;
  console.log(data.users);
});
```

### Using `GetUserByEmail`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getUserByEmailRef, GetUserByEmailVariables } from '@dataconnect/generated';

// The `GetUserByEmail` query requires an argument of type `GetUserByEmailVariables`:
const getUserByEmailVars: GetUserByEmailVariables = {
  email: ..., 
};

// Call the `getUserByEmailRef()` function to get a reference to the query.
const ref = getUserByEmailRef(getUserByEmailVars);
// Variables can be defined inline as well.
const ref = getUserByEmailRef({ email: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getUserByEmailRef(dataConnect, getUserByEmailVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.users);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.users);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## CreateBusinessProfile
You can execute the `CreateBusinessProfile` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createBusinessProfile(vars: CreateBusinessProfileVariables): MutationPromise<CreateBusinessProfileData, CreateBusinessProfileVariables>;

interface CreateBusinessProfileRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateBusinessProfileVariables): MutationRef<CreateBusinessProfileData, CreateBusinessProfileVariables>;
}
export const createBusinessProfileRef: CreateBusinessProfileRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createBusinessProfile(dc: DataConnect, vars: CreateBusinessProfileVariables): MutationPromise<CreateBusinessProfileData, CreateBusinessProfileVariables>;

interface CreateBusinessProfileRef {
  ...
  (dc: DataConnect, vars: CreateBusinessProfileVariables): MutationRef<CreateBusinessProfileData, CreateBusinessProfileVariables>;
}
export const createBusinessProfileRef: CreateBusinessProfileRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createBusinessProfileRef:
```typescript
const name = createBusinessProfileRef.operationName;
console.log(name);
```

### Variables
The `CreateBusinessProfile` mutation requires an argument of type `CreateBusinessProfileVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateBusinessProfileVariables {
  userId: UUIDString;
  name: string;
  websiteUrl: string;
  createdAt: TimestampString;
  description?: string | null;
  targetAudience?: string | null;
}
```
### Return Type
Recall that executing the `CreateBusinessProfile` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateBusinessProfileData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateBusinessProfileData {
  businessProfile_insert: BusinessProfile_Key;
}
```
### Using `CreateBusinessProfile`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createBusinessProfile, CreateBusinessProfileVariables } from '@dataconnect/generated';

// The `CreateBusinessProfile` mutation requires an argument of type `CreateBusinessProfileVariables`:
const createBusinessProfileVars: CreateBusinessProfileVariables = {
  userId: ..., 
  name: ..., 
  websiteUrl: ..., 
  createdAt: ..., 
  description: ..., // optional
  targetAudience: ..., // optional
};

// Call the `createBusinessProfile()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createBusinessProfile(createBusinessProfileVars);
// Variables can be defined inline as well.
const { data } = await createBusinessProfile({ userId: ..., name: ..., websiteUrl: ..., createdAt: ..., description: ..., targetAudience: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createBusinessProfile(dataConnect, createBusinessProfileVars);

console.log(data.businessProfile_insert);

// Or, you can use the `Promise` API.
createBusinessProfile(createBusinessProfileVars).then((response) => {
  const data = response.data;
  console.log(data.businessProfile_insert);
});
```

### Using `CreateBusinessProfile`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createBusinessProfileRef, CreateBusinessProfileVariables } from '@dataconnect/generated';

// The `CreateBusinessProfile` mutation requires an argument of type `CreateBusinessProfileVariables`:
const createBusinessProfileVars: CreateBusinessProfileVariables = {
  userId: ..., 
  name: ..., 
  websiteUrl: ..., 
  createdAt: ..., 
  description: ..., // optional
  targetAudience: ..., // optional
};

// Call the `createBusinessProfileRef()` function to get a reference to the mutation.
const ref = createBusinessProfileRef(createBusinessProfileVars);
// Variables can be defined inline as well.
const ref = createBusinessProfileRef({ userId: ..., name: ..., websiteUrl: ..., createdAt: ..., description: ..., targetAudience: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createBusinessProfileRef(dataConnect, createBusinessProfileVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.businessProfile_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.businessProfile_insert);
});
```

## UpdateStrategySessionClientNotes
You can execute the `UpdateStrategySessionClientNotes` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateStrategySessionClientNotes(vars: UpdateStrategySessionClientNotesVariables): MutationPromise<UpdateStrategySessionClientNotesData, UpdateStrategySessionClientNotesVariables>;

interface UpdateStrategySessionClientNotesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateStrategySessionClientNotesVariables): MutationRef<UpdateStrategySessionClientNotesData, UpdateStrategySessionClientNotesVariables>;
}
export const updateStrategySessionClientNotesRef: UpdateStrategySessionClientNotesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateStrategySessionClientNotes(dc: DataConnect, vars: UpdateStrategySessionClientNotesVariables): MutationPromise<UpdateStrategySessionClientNotesData, UpdateStrategySessionClientNotesVariables>;

interface UpdateStrategySessionClientNotesRef {
  ...
  (dc: DataConnect, vars: UpdateStrategySessionClientNotesVariables): MutationRef<UpdateStrategySessionClientNotesData, UpdateStrategySessionClientNotesVariables>;
}
export const updateStrategySessionClientNotesRef: UpdateStrategySessionClientNotesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateStrategySessionClientNotesRef:
```typescript
const name = updateStrategySessionClientNotesRef.operationName;
console.log(name);
```

### Variables
The `UpdateStrategySessionClientNotes` mutation requires an argument of type `UpdateStrategySessionClientNotesVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateStrategySessionClientNotesVariables {
  id: UUIDString;
  clientNotes?: string | null;
}
```
### Return Type
Recall that executing the `UpdateStrategySessionClientNotes` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateStrategySessionClientNotesData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateStrategySessionClientNotesData {
  strategySession_update?: StrategySession_Key | null;
}
```
### Using `UpdateStrategySessionClientNotes`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateStrategySessionClientNotes, UpdateStrategySessionClientNotesVariables } from '@dataconnect/generated';

// The `UpdateStrategySessionClientNotes` mutation requires an argument of type `UpdateStrategySessionClientNotesVariables`:
const updateStrategySessionClientNotesVars: UpdateStrategySessionClientNotesVariables = {
  id: ..., 
  clientNotes: ..., // optional
};

// Call the `updateStrategySessionClientNotes()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateStrategySessionClientNotes(updateStrategySessionClientNotesVars);
// Variables can be defined inline as well.
const { data } = await updateStrategySessionClientNotes({ id: ..., clientNotes: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateStrategySessionClientNotes(dataConnect, updateStrategySessionClientNotesVars);

console.log(data.strategySession_update);

// Or, you can use the `Promise` API.
updateStrategySessionClientNotes(updateStrategySessionClientNotesVars).then((response) => {
  const data = response.data;
  console.log(data.strategySession_update);
});
```

### Using `UpdateStrategySessionClientNotes`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateStrategySessionClientNotesRef, UpdateStrategySessionClientNotesVariables } from '@dataconnect/generated';

// The `UpdateStrategySessionClientNotes` mutation requires an argument of type `UpdateStrategySessionClientNotesVariables`:
const updateStrategySessionClientNotesVars: UpdateStrategySessionClientNotesVariables = {
  id: ..., 
  clientNotes: ..., // optional
};

// Call the `updateStrategySessionClientNotesRef()` function to get a reference to the mutation.
const ref = updateStrategySessionClientNotesRef(updateStrategySessionClientNotesVars);
// Variables can be defined inline as well.
const ref = updateStrategySessionClientNotesRef({ id: ..., clientNotes: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateStrategySessionClientNotesRef(dataConnect, updateStrategySessionClientNotesVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.strategySession_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.strategySession_update);
});
```

