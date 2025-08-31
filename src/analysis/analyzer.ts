import { AnalysisResult, DatasetInfo, AnalysisOptions, ChartData } from './types';
import { StatisticsAnalyzer } from './statistics';

export class DataAnalyzer {
  
  /**
   * Get comprehensive dataset information
   */
  static getDatasetInfo(data: any[]): DatasetInfo {
    if (!data || data.length === 0) {
      return {
        totalRows: 0,
        totalColumns: 0,
        columns: []
      };
    }

    const columnNames = Object.keys(data[0]);
    const columns = columnNames.map(col => StatisticsAnalyzer.getColumnInfo(data, col));

    return {
      totalRows: data.length,
      totalColumns: columnNames.length,
      columns
    };
  }

  /**
   * Generate basic statistics summary
   */
  static generateBasicStats(data: any[], options?: AnalysisOptions): AnalysisResult {
    const startTime = Date.now();
    
    const datasetInfo = this.getDatasetInfo(data);
    const numericColumns = datasetInfo.columns.filter(col => col.type === 'numeric');
    
    const summary = {
      dataset: datasetInfo,
      numericColumns: numericColumns.map(col => ({
        name: col.name,
        statistics: col.statistics
      })),
      categoricalColumns: datasetInfo.columns.filter(col => col.type === 'string').map(col => ({
        name: col.name,
        uniqueCount: col.uniqueCount,
        nullCount: col.nullCount,
        sampleValues: col.sampleValues
      }))
    };

    return {
      type: 'basic_stats',
      title: 'Basic Statistics Summary',
      description: 'Overview of dataset structure and basic statistics for all columns',
      data: summary,
      metadata: {
        executionTime: Date.now() - startTime,
        timestamp: new Date().toISOString()
      }
    };
  }

  /**
   * Generate correlation analysis
   */
  static generateCorrelationAnalysis(data: any[], options?: AnalysisOptions): AnalysisResult {
    const startTime = Date.now();
    
    const datasetInfo = this.getDatasetInfo(data);
    const numericColumns = datasetInfo.columns.filter(col => col.type === 'numeric');
    
    if (numericColumns.length < 2) {
      return {
        type: 'correlation',
        title: 'Correlation Analysis',
        description: 'Not enough numeric columns for correlation analysis',
        data: { message: 'At least 2 numeric columns required for correlation analysis' },
        metadata: {
          executionTime: Date.now() - startTime,
          timestamp: new Date().toISOString()
        }
      };
    }

    const correlationMatrix: { [key: string]: { [key: string]: number } } = {};
    
    numericColumns.forEach(col1 => {
      correlationMatrix[col1.name] = {};
      numericColumns.forEach(col2 => {
        if (col1.name === col2.name) {
          correlationMatrix[col1.name][col2.name] = 1;
        } else {
          const correlation = StatisticsAnalyzer.calculateCorrelation(data, col1.name, col2.name);
          correlationMatrix[col1.name][col2.name] = correlation || 0;
        }
      });
    });

    return {
      type: 'correlation',
      title: 'Correlation Analysis',
      description: 'Correlation matrix for all numeric columns',
      data: {
        matrix: correlationMatrix,
        columns: numericColumns.map(col => col.name)
      },
      metadata: {
        executionTime: Date.now() - startTime,
        timestamp: new Date().toISOString()
      }
    };
  }

  /**
   * Generate distribution analysis
   */
  static generateDistributionAnalysis(data: any[], columnName: string): AnalysisResult {
    const startTime = Date.now();
    
    const columnInfo = StatisticsAnalyzer.getColumnInfo(data, columnName);
    
    if (columnInfo.type !== 'numeric') {
      return {
        type: 'distribution',
        title: `Distribution Analysis - ${columnName}`,
        description: 'Distribution analysis is only available for numeric columns',
        data: { message: 'Column must be numeric for distribution analysis' },
        metadata: {
          executionTime: Date.now() - startTime,
          timestamp: new Date().toISOString()
        }
      };
    }

    const values = data.map(row => parseFloat(row[columnName])).filter(val => !isNaN(val));
    const sorted = [...values].sort((a, b) => a - b);
    
    // Create histogram bins
    const min = Math.min(...values);
    const max = Math.max(...values);
    const binCount = Math.min(20, Math.ceil(Math.sqrt(values.length)));
    const binSize = (max - min) / binCount;
    
    const bins: { [key: string]: number } = {};
    for (let i = 0; i < binCount; i++) {
      const binStart = min + i * binSize;
      const binEnd = min + (i + 1) * binSize;
      const binLabel = `${binStart.toFixed(2)}-${binEnd.toFixed(2)}`;
      bins[binLabel] = 0;
    }
    
    values.forEach(val => {
      const binIndex = Math.min(Math.floor((val - min) / binSize), binCount - 1);
      const binStart = min + binIndex * binSize;
      const binEnd = min + (binIndex + 1) * binSize;
      const binLabel = `${binStart.toFixed(2)}-${binEnd.toFixed(2)}`;
      bins[binLabel]++;
    });

    return {
      type: 'distribution',
      title: `Distribution Analysis - ${columnName}`,
      description: `Histogram and distribution statistics for ${columnName}`,
      data: {
        column: columnName,
        statistics: columnInfo.statistics,
        histogram: bins,
        values: values.slice(0, 100) // Sample of values for visualization
      },
      metadata: {
        executionTime: Date.now() - startTime,
        timestamp: new Date().toISOString()
      }
    };
  }

  /**
   * Generate chart data for visualization
   */
  static generateChartData(data: any[], chartType: string, xColumn?: string, yColumn?: string): ChartData | null {
    const datasetInfo = this.getDatasetInfo(data);
    
    switch (chartType) {
      case 'histogram':
        if (!xColumn) return null;
        const columnInfo = StatisticsAnalyzer.getColumnInfo(data, xColumn);
        if (columnInfo.type !== 'numeric') return null;
        
        const values = data.map(row => parseFloat(row[xColumn])).filter(val => !isNaN(val));
        const min = Math.min(...values);
        const max = Math.max(...values);
        const binCount = Math.min(10, Math.ceil(Math.sqrt(values.length)));
        const binSize = (max - min) / binCount;
        
        const labels: string[] = [];
        const chartData: number[] = [];
        
        for (let i = 0; i < binCount; i++) {
          const binStart = min + i * binSize;
          const binEnd = min + (i + 1) * binSize;
          labels.push(`${binStart.toFixed(1)}-${binEnd.toFixed(1)}`);
          
          const count = values.filter(val => val >= binStart && val < binEnd).length;
          chartData.push(count);
        }
        
        return {
          type: 'bar',
          title: `Distribution of ${xColumn}`,
          data: {
            labels,
            datasets: [{
              label: 'Frequency',
              data: chartData,
              backgroundColor: 'rgba(54, 162, 235, 0.6)',
              borderColor: 'rgba(54, 162, 235, 1)'
            }]
          }
        };
        
      case 'scatter':
        if (!xColumn || !yColumn) return null;
        const xValues = data.map(row => parseFloat(row[xColumn])).filter(val => !isNaN(val));
        const yValues = data.map(row => parseFloat(row[yColumn])).filter(val => !isNaN(val));
        
        return {
          type: 'scatter',
          title: `${xColumn} vs ${yColumn}`,
          data: {
            labels: xValues.map((_, i) => `Point ${i + 1}`),
            datasets: [{
              label: 'Data Points',
              data: xValues.map((x, i) => ({ x, y: yValues[i] })),
              backgroundColor: 'rgba(255, 99, 132, 0.6)',
              borderColor: 'rgba(255, 99, 132, 1)'
            }]
          }
        };
        
      default:
        return null;
    }
  }
}
