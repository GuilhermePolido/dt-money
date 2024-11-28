import { ReactNode, useCallback, useEffect, useState } from "react";
import { api } from "../lib/axios";
import { createContext } from "use-context-selector";

export interface Transaction {
  id: number;
  description: string;
  type: "income" | "outcome";
  price: number;
  category: string;
  createAt: string;
}

interface NewTransactionFormInput {
  description: string;
  type: "income" | "outcome";
  price: number;
  category: string;
}

interface TransactionsContextType {
  transactions: Transaction[];
  fetchTransactions: (query?: string) => Promise<void>;
  createTransactions: (data: NewTransactionFormInput) => Promise<void>;
}

export const TransactionsContext = createContext({} as TransactionsContextType);

interface TransactionsProviderProps {
  children: ReactNode;
}

export function TransactionsProvider({ children }: TransactionsProviderProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = useCallback(async (query?: string) => {
    const response = await api.get("/transactions", {
      params: {
        _sort: "createAt",
        _order: "desc",
        q: query,
      },
    });
    const { data } = response;

    setTransactions(data);
  }, []);

  const createTransactions = useCallback(
    async (data: NewTransactionFormInput) => {
      const response = await api.post("/transactions", {
        ...data,
        createAt: new Date(),
      });

      setTransactions((state) => [response.data, ...state]);
    },
    []
  );

  return (
    <TransactionsContext.Provider
      value={{ transactions, fetchTransactions, createTransactions }}
    >
      {children}
    </TransactionsContext.Provider>
  );
}
