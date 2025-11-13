// Mock temporário para tRPC
export const trpc = {
  cupcakes: {
    list: {
      useQuery: () => ({ 
        data: [], 
        isLoading: false 
      })
    }
  },
  orders: {
    list: {
      useQuery: () => ({ 
        data: [], 
        isLoading: false 
      })
    }
  }
} as any;