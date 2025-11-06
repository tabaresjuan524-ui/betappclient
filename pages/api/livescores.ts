import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs/promises';
import path from 'path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const dataDir = path.join(process.cwd(), 'pages', 'data');
  try {
    const files = await fs.readdir(dataDir);
    
    // CORRECCIÓN: Ahora busca el archivo "consolidated" que contiene todos los deportes.
    const mockFiles = files
      .filter(file => file.startsWith('live-events-consolidated-') && file.endsWith('.json'))
      .sort() // Ordena alfabéticamente (funciona para fechas en formato ISO)
      .reverse(); // El más nuevo primero

    if (mockFiles.length === 0) {
      // Si no hay un archivo consolidado, busca un archivo mock como respaldo.
      const fallbackFiles = files
        .filter(file => file.startsWith('live-events-mock-') && file.endsWith('.json'))
        .sort()
        .reverse();

      if (fallbackFiles.length === 0) {
        throw new Error('No mock data file found. Please run /api/fetch-live-data first.');
      }
      
      const latestFallbackFile = fallbackFiles[0];
      console.log(`Serving FALLBACK mock data from: ${latestFallbackFile}`);
      const mockFilePath = path.join(dataDir, latestFallbackFile);
      const mockData = await fs.readFile(mockFilePath, 'utf-8');
      return res.status(200).json(JSON.parse(mockData));
    }

    const latestMockFile = mockFiles[0];
    console.log(`Serving latest CONSOLIDATED data from: ${latestMockFile}`);
    
    const mockFilePath = path.join(dataDir, latestMockFile);
    const mockData = await fs.readFile(mockFilePath, 'utf-8');
    const events = JSON.parse(mockData);

    return res.status(200).json(events);
  } catch (error: any) {
    console.error('Error reading mock data file:', error);
    return res.status(500).json({ error: error.message || 'Could not read or process mock data file.' });
  }
}