import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { decamelizeKeys } from "humps";

import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
// import { getTodos, postTodo } from '../my-api'

// Create a client

export type TagFilterParams = {
  tag: string | undefined;
  product: string | undefined;
};


const obj: TagFilterParams  = {
  tag: 'electronics',
  product: '74',
}

function App() {
  const queryClient = new QueryClient()

  return (
    // Provide the client to your App
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <Todos />
    </QueryClientProvider>
  )
}

function Todos() {
  // Access the client
  const queryClient = useQueryClient()

  // Queries


  const query = useQuery({
    queryKey: ['todos'],
    queryFn: async () => {
      const response = await fetch('http://192.168.178.82:8000/api/v1/tags')
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      return response.json()
    },
  })


  const addTodo = async () => {
    console.log("adding todos...")
    const data = {
      "tag": "some tag" + Math.floor(Math.random() * 100),
      "product": 74
    }

    const response = await fetch("http://192.168.178.82:8000/api/v1/tags", { method: 'post', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });

    return response;

  }

  const deleteTodo = async (id: String) => {
    console.log("deleting todos...", id)


    const response = await fetch("http://192.168.178.82:8000/api/v1/tags", { method: 'delete', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(id) });

    return response;

  }


  // Mutations
  const mutation = useMutation({
    mutationFn: addTodo,
    onSuccess: () => {
      // Invalidate and refetch
      console.log('invalidating..')
      queryClient.invalidateQueries({ queryKey: ['todos'] })
    },
  })

  const mutationDelete = useMutation({
    mutationFn: (id: String) => deleteTodo(id),
    onSuccess: () => {
      // Invalidate and refetch
      console.log('invalidating..')
      queryClient.invalidateQueries({ queryKey: ['todos'] })
    },
  })

  const filter = async (params: TagFilterParams) => {
    console.log('genering filter...');

    const serializeParams = (params: Record<string, any>): string => {
      const query = new URLSearchParams(params);
      return query.toString();
    };

    const decamelizedParams = (params);
    // console.log(decamelizedParams);
    // const decamelizedParams = decamelizeKeys(TagFilterParams);
    console.log(serializeParams(decamelizedParams));
  }

  if (!query) {
    return <div>data is loading</div>
  }

  return (
    <div className='grid-cols-2 grid'>
      <div>
        <ul>{query.data?.map((todo) =>
          <>
            <li key={todo.id}>{todo.tag}

              <span
                onClick={() => mutationDelete.mutate({ id: todo.id })}
                className='p-2  text-cyan-600 text-xs' >Delete</span>
            </li>
          </>

        )}</ul>

        <button

          onClick={() => mutation.mutate()}
        >
          Add Todo
        </button>
      </div>

      <div className='bg-pink-300'>
        <button type='button' className='p-2 bg-red-500 border-2 border-black' onClick={() => filter(obj)}>Generate filder params</button>
      </div>
    </div>
  )
}


export default App;