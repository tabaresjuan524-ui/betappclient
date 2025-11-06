import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs/promises';
import path from 'path';

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY; 
const RAPIDAPI_HOST = 'odds.p.rapidapi.com';
const API_HOSTNAME = `https://${RAPIDAPI_HOST}`;

const requestOptions = {
  method: 'GET',
  headers: {
    'x-rapidapi-key': RAPIDAPI_KEY || '',
    'x-rapidapi-host': RAPIDAPI_HOST
  }
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function getSportsFromApi(): Promise<any[]> {
  if (!RAPIDAPI_KEY) throw new Error('API key no encontrada.');
  const response = await fetch(`${API_HOSTNAME}/v4/sports`, requestOptions);
  if (!response.ok) throw new Error(`Error al obtener los deportes: ${response.statusText}`);
  return response.json();
}

// CORREGIDO: Llama al endpoint /odds para obtener las cuotas
async function getEventsAndOddsFromApi(sportKey: string): Promise<any[]> {
    if (!RAPIDAPI_KEY) throw new Error('API key no encontrada.');
    const response = await fetch(`${API_HOSTNAME}/v4/sports/${sportKey}/odds/?regions=us&markets=h2h,spreads`, requestOptions);
    if (!response.ok) {
        console.warn(`No se pudieron obtener cuotas para ${sportKey}: ${response.statusText}`);
        return [];
    }
    return response.json();
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (!RAPIDAPI_KEY) return res.status(500).json({ error: 'La RAPIDAPI_KEY no está configurada.' });

    try {
        console.log("Iniciando la obtención y consolidación de datos...");
        const dataDir = path.join(process.cwd(), 'pages', 'data');
        let allLiveEvents: any[] = [];

        const files = await fs.readdir(dataDir).catch(() => []);
        const consolidatedFiles = files.filter(file => file.startsWith('live-events-consolidated-')).sort().reverse();

        if (consolidatedFiles.length > 0) {
            const latestFile = consolidatedFiles[0];
            const existingData = await fs.readFile(path.join(dataDir, latestFile), 'utf-8');
            allLiveEvents = JSON.parse(existingData);
        }

        const sports = await getSportsFromApi();
        const activeSports = sports.filter((sport: any) => sport.active && !sport.has_outrights);
        
        console.log(`Se encontraron ${activeSports.length} deportes activos. Obteniendo cuotas...`);
        for (const sport of activeSports) {
            console.log(`- Obteniendo para ${sport.title}`);
            const events = await getEventsAndOddsFromApi(sport.key);
            if (events && events.length > 0) {
                const enrichedEvents = events.map(event => ({ ...event, sport_group: sport.group }));
                allLiveEvents.push(...enrichedEvents);
            }
            await delay(1500); // Pausa de 1.5 segundos entre cada petición
        }

        const uniqueEvents = [...new Map(allLiveEvents.map(event => [event.id, event])).values()];
        const timestamp = new Date().toISOString().replace(/:/g, '-').replace(/\..+/, '');
        const fileName = `live-events-consolidated-${timestamp}.json`;
        await fs.writeFile(path.join(dataDir, fileName), JSON.stringify(uniqueEvents, null, 2));
        
        console.log(`¡Éxito! Datos guardados en: ${fileName}`);
        res.status(200).json({ message: 'Datos obtenidos y agregados.', fileName, totalEvents: uniqueEvents.length });

    } catch (error: any) {
        console.error('Error durante la obtención de datos:', error);
        res.status(500).json({ error: error.message || 'Falló la obtención de datos.' });
    }
}