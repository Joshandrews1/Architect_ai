# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.




### React
For each operation, there is a wrapper hook that can be used to call the operation.

Here are all of the hooks that get generated:
```ts
import { useCreateBusinessProfile, useListRecommendationsForGrowthAudit, useUpdateStrategySessionClientNotes, useGetUserByEmail } from '@dataconnect/generated/react';
// The types of these hooks are available in react/index.d.ts

const { data, isPending, isSuccess, isError, error } = useCreateBusinessProfile(createBusinessProfileVars);

const { data, isPending, isSuccess, isError, error } = useListRecommendationsForGrowthAudit(listRecommendationsForGrowthAuditVars);

const { data, isPending, isSuccess, isError, error } = useUpdateStrategySessionClientNotes(updateStrategySessionClientNotesVars);

const { data, isPending, isSuccess, isError, error } = useGetUserByEmail(getUserByEmailVars);

```

Here's an example from a different generated SDK:

```ts
import { useListAllMovies } from '@dataconnect/generated/react';

function MyComponent() {
  const { isLoading, data, error } = useListAllMovies();
  if(isLoading) {
    return <div>Loading...</div>
  }
  if(error) {
    return <div> An Error Occurred: {error} </div>
  }
}

// App.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MyComponent from './my-component';

function App() {
  const queryClient = new QueryClient();
  return <QueryClientProvider client={queryClient}>
    <MyComponent />
  </QueryClientProvider>
}
```



## Advanced Usage
If a user is not using a supported framework, they can use the generated SDK directly.

Here's an example of how to use it with the first 5 operations:

```js
import { createBusinessProfile, listRecommendationsForGrowthAudit, updateStrategySessionClientNotes, getUserByEmail } from '@dataconnect/generated';


// Operation CreateBusinessProfile:  For variables, look at type CreateBusinessProfileVars in ../index.d.ts
const { data } = await CreateBusinessProfile(dataConnect, createBusinessProfileVars);

// Operation ListRecommendationsForGrowthAudit:  For variables, look at type ListRecommendationsForGrowthAuditVars in ../index.d.ts
const { data } = await ListRecommendationsForGrowthAudit(dataConnect, listRecommendationsForGrowthAuditVars);

// Operation UpdateStrategySessionClientNotes:  For variables, look at type UpdateStrategySessionClientNotesVars in ../index.d.ts
const { data } = await UpdateStrategySessionClientNotes(dataConnect, updateStrategySessionClientNotesVars);

// Operation GetUserByEmail:  For variables, look at type GetUserByEmailVars in ../index.d.ts
const { data } = await GetUserByEmail(dataConnect, getUserByEmailVars);


```