// src/types/react-table.d.ts
declare module 'react-table' {
    import { ReactNode } from 'react';
  
    export interface Column<D = any> {
      Header: ReactNode;
      accessor: keyof D;
      Cell?: (props: any) => ReactNode;
    }
  
    export interface UseTableOptions<D = any> {
      columns: Column<D>[];
      data: D[];
    }
  
    export interface TableInstance<D = any> {
      getTableProps: () => any;
      getTableBodyProps: () => any;
      headerGroups: HeaderGroup<D>[];
      rows: Row<D>[];
      prepareRow: (row: Row<D>) => void;
    }
  
    export function useTable<D = any>(
      options: UseTableOptions<D>,
      ...plugins: any[]
    ): TableInstance<D>;
  }
  