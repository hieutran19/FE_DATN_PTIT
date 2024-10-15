import { useQuery, UseQueryOptions } from '@tanstack/react-query'

function useAPI<
  TQueryKey extends [string, Record<string, unknown>?], TQueryFnData, 
  TError, 
  TData = TQueryFnData
  >(
    queryKey: TQueryKey, 
    fetcher: (params: TQueryKey[1], token: string) => Promise<TQueryFnData>, 
    options?: Omit<UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>, "queryKey" | "queryFn">
  ) {
    //TODO: update get accessToken
    const accessToken = "123"

    return useQuery({
      queryKey,
      queryFn: async() => {
        return fetcher(queryKey[1], accessToken)
      },
      ...options,
    })
  }

export default useAPI