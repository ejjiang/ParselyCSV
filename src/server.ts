import express from 'express';
import multer from 'multer';
import csv from 'csv-parser';
import fs from 'fs';
import path from 'path';
import { DataAnalyzer } from './analysis/analyzer';
import { AnalysisOptions } from './analysis/types';

const app = express();
const PORT = process.env.PORT || 3000;

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed!'));
    }
  }
});

// Serve static files
app.use(express.static('public'));

// Middleware for parsing JSON
app.use(express.json());

// Parse CSV file and return data
const parseCSV = (filePath: string): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const results: any[] = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (error) => reject(error));
  });
};

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.post('/upload', upload.single('csvFile'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const csvData = await parseCSV(req.file.path);
    
    // Clean up the uploaded file
    fs.unlinkSync(req.file.path);
    
    res.json({
      message: 'File uploaded and parsed successfully',
      data: csvData,
      rowCount: csvData.length
    });
  } catch (error) {
    console.error('Error processing CSV:', error);
    res.status(500).json({ error: 'Error processing CSV file' });
  }
});

// Analysis endpoints
app.post('/analyze/basic-stats', (req, res) => {
  try {
    const { data, options } = req.body;
    
    if (!data || !Array.isArray(data)) {
      return res.status(400).json({ error: 'Data array is required' });
    }

    const result = DataAnalyzer.generateBasicStats(data, options);
    res.json(result);
  } catch (error) {
    console.error('Error in basic stats analysis:', error);
    res.status(500).json({ error: 'Error performing basic statistics analysis' });
  }
});

app.post('/analyze/correlation', (req, res) => {
  try {
    const { data, options } = req.body;
    
    if (!data || !Array.isArray(data)) {
      return res.status(400).json({ error: 'Data array is required' });
    }

    const result = DataAnalyzer.generateCorrelationAnalysis(data, options);
    res.json(result);
  } catch (error) {
    console.error('Error in correlation analysis:', error);
    res.status(500).json({ error: 'Error performing correlation analysis' });
  }
});

app.post('/analyze/distribution', (req, res) => {
  try {
    const { data, columnName } = req.body;
    
    if (!data || !Array.isArray(data)) {
      return res.status(400).json({ error: 'Data array is required' });
    }
    
    if (!columnName) {
      return res.status(400).json({ error: 'Column name is required' });
    }

    const result = DataAnalyzer.generateDistributionAnalysis(data, columnName);
    res.json(result);
  } catch (error) {
    console.error('Error in distribution analysis:', error);
    res.status(500).json({ error: 'Error performing distribution analysis' });
  }
});

app.post('/analyze/chart', (req, res) => {
  try {
    const { data, chartType, xColumn, yColumn } = req.body;
    
    if (!data || !Array.isArray(data)) {
      return res.status(400).json({ error: 'Data array is required' });
    }
    
    if (!chartType) {
      return res.status(400).json({ error: 'Chart type is required' });
    }

    const result = DataAnalyzer.generateChartData(data, chartType, xColumn, yColumn);
    
    if (!result) {
      return res.status(400).json({ error: 'Invalid chart configuration' });
    }
    
    res.json(result);
  } catch (error) {
    console.error('Error generating chart data:', error);
    res.status(500).json({ error: 'Error generating chart data' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
