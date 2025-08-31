import * as ss from 'simple-statistics';
import { StatisticalSummary, ColumnInfo } from './types';

export class StatisticsAnalyzer {
  
  /**
   * Analyze a single column and return statistical summary
   */
  static analyzeColumn(data: any[], columnName: string): StatisticalSummary {
    const values = data.map(row => row[columnName]).filter(val => val !== null && val !== undefined && val !== '');
    
    if (values.length === 0) {
      return { count: 0 };
    }

    // Check if values are numeric
    const numericValues = values.map(val => {
      const num = parseFloat(val);
      return isNaN(num) ? null : num;
    }).filter(val => val !== null) as number[];

    const summary: StatisticalSummary = {
      count: values.length
    };

    if (numericValues.length > 0) {
      summary.mean = ss.mean(numericValues);
      summary.median = ss.median(numericValues);
      summary.stdDev = ss.standardDeviation(numericValues);
      summary.min = ss.min(numericValues);
      summary.max = ss.max(numericValues);
      summary.range = summary.max - summary.min;
      
      // Calculate quartiles
      const sorted = [...numericValues].sort((a, b) => a - b);
      summary.quartiles = {
        q1: ss.quantile(sorted, 0.25),
        q2: ss.quantile(sorted, 0.5),
        q3: ss.quantile(sorted, 0.75)
      };
    }

    // Calculate mode for all values (including non-numeric)
    const frequency: { [key: string]: number } = {};
    values.forEach(val => {
      const key = String(val);
      frequency[key] = (frequency[key] || 0) + 1;
    });
    
    const maxFreq = Math.max(...Object.values(frequency));
    summary.mode = Object.keys(frequency).find(key => frequency[key] === maxFreq);

    return summary;
  }

  /**
   * Detect column data type
   */
  static detectColumnType(data: any[], columnName: string): 'numeric' | 'string' | 'date' | 'boolean' | 'mixed' {
    const values = data.map(row => row[columnName]).filter(val => val !== null && val !== undefined && val !== '');
    
    if (values.length === 0) return 'string';

    let numericCount = 0;
    let dateCount = 0;
    let booleanCount = 0;

    values.forEach(val => {
      const str = String(val).toLowerCase();
      
      // Check for boolean
      if (['true', 'false', 'yes', 'no', '1', '0'].includes(str)) {
        booleanCount++;
      }
      // Check for date
      else if (!isNaN(Date.parse(str)) || /^\d{4}-\d{2}-\d{2}/.test(str)) {
        dateCount++;
      }
      // Check for numeric
      else if (!isNaN(parseFloat(str))) {
        numericCount++;
      }
    });

    const total = values.length;
    const numericRatio = numericCount / total;
    const dateRatio = dateCount / total;
    const booleanRatio = booleanCount / total;

    if (numericRatio > 0.8) return 'numeric';
    if (dateRatio > 0.8) return 'date';
    if (booleanRatio > 0.8) return 'boolean';
    if (numericRatio > 0.3 || dateRatio > 0.3 || booleanRatio > 0.3) return 'mixed';
    
    return 'string';
  }

  /**
   * Get column information including statistics
   */
  static getColumnInfo(data: any[], columnName: string): ColumnInfo {
    const values = data.map(row => row[columnName]);
    const nonNullValues = values.filter(val => val !== null && val !== undefined && val !== '');
    const uniqueValues = [...new Set(nonNullValues)];
    
    const type = this.detectColumnType(data, columnName);
    const statistics = type === 'numeric' ? this.analyzeColumn(data, columnName) : undefined;
    
    return {
      name: columnName,
      type,
      nullCount: values.length - nonNullValues.length,
      uniqueCount: uniqueValues.length,
      sampleValues: uniqueValues.slice(0, 5),
      statistics
    };
  }

  /**
   * Calculate correlation between two numeric columns
   */
  static calculateCorrelation(data: any[], col1: string, col2: string): number | null {
    const values1 = data.map(row => parseFloat(row[col1])).filter(val => !isNaN(val));
    const values2 = data.map(row => parseFloat(row[col2])).filter(val => !isNaN(val));
    
    if (values1.length !== values2.length || values1.length < 2) {
      return null;
    }

    try {
      return ss.sampleCorrelation(values1, values2);
    } catch (error) {
      return null;
    }
  }

  /**
   * Perform linear regression between two numeric columns
   */
  static linearRegression(data: any[], xCol: string, yCol: string): any {
    const xValues = data.map(row => parseFloat(row[xCol])).filter(val => !isNaN(val));
    const yValues = data.map(row => parseFloat(row[yCol])).filter(val => !isNaN(val));
    
    if (xValues.length !== yValues.length || xValues.length < 2) {
      return null;
    }

    try {
      const regression = ss.linearRegression(xValues.map((x, i) => [x, yValues[i]]));
      const regressionFunction = (x: number) => regression.m * x + regression.b;
      return {
        slope: regression.m,
        intercept: regression.b,
        rSquared: ss.rSquared(xValues.map((x, i) => [x, yValues[i]]), regressionFunction)
      };
    } catch (error) {
      return null;
    }
  }
}
