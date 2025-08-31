// Type definitions for data analysis

export interface AnalysisResult {
  type: string;
  title: string;
  description: string;
  data: any;
  metadata?: {
    executionTime: number;
    timestamp: string;
    parameters?: any;
  };
}

export interface StatisticalSummary {
  count: number;
  mean?: number;
  median?: number;
  mode?: any;
  stdDev?: number;
  min?: number;
  max?: number;
  range?: number;
  quartiles?: {
    q1: number;
    q2: number;
    q3: number;
  };
}

export interface ColumnInfo {
  name: string;
  type: 'numeric' | 'string' | 'date' | 'boolean' | 'mixed';
  nullCount: number;
  uniqueCount: number;
  sampleValues: any[];
  statistics?: StatisticalSummary;
}

export interface DatasetInfo {
  totalRows: number;
  totalColumns: number;
  columns: ColumnInfo[];
  memoryUsage?: number;
  fileSize?: number;
}

export interface AnalysisOptions {
  columns?: string[];
  includeNulls?: boolean;
  groupBy?: string;
  filters?: {
    column: string;
    operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains';
    value: any;
  }[];
}

export interface ChartData {
  type: 'bar' | 'line' | 'scatter' | 'pie' | 'histogram';
  title: string;
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[] | { x: number; y: number }[];
      backgroundColor?: string | string[];
      borderColor?: string;
    }[];
  };
  options?: any;
}
