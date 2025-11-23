import { useState, useEffect } from 'react';

export interface AsteroidData {
  id: string;
  name: string;
  diameter: number;
  velocity: number;
  missDistance: number;
  hazardous: boolean;
  closeApproachDate: string;
  magnitude: number;
  type: 'asteroid' | 'comet';
}

const BACKEND_URL = 'http://localhost:5173';

export function useNASAData() {
  const [asteroids, setAsteroids] = useState<AsteroidData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Intentar conectar al backend con timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 segundos timeout

        const response = await fetch(`${BACKEND_URL}/api/sentry`, {
          signal: controller.signal,
        });
        
        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error('Error fetching data from backend');
        }

        const data = await response.json();
        
        // Procesar datos de Sentry API
        if (data.data && Array.isArray(data.data)) {
          const processedAsteroids: AsteroidData[] = data.data.slice(0, 10).map((item: any) => {
            // Parsear datos de Sentry API
            const diameter = parseFloat(item.diameter) || 0.5;
            const velocity = parseFloat(item.v_inf) || 20; // velocidad relativa
            const closeApproachDate = item.last_obs || new Date().toISOString();
            
            return {
              id: item.des || item.fullname,
              name: item.fullname || item.des,
              diameter: diameter,
              velocity: velocity,
              missDistance: parseFloat(item.dist) * 149597870.7 || 10000000, // AU to km
              hazardous: true, // Sentry API solo tiene objetos potencialmente peligrosos
              closeApproachDate: closeApproachDate,
              magnitude: parseFloat(item.h) || 20,
              type: 'asteroid',
            };
          });

          setAsteroids(processedAsteroids);
          console.log('✅ Datos cargados desde NASA API');
        } else {
          // Si no hay datos del backend, usar datos de ejemplo
          setAsteroids(getMockData());
          console.log('📊 Usando datos de ejemplo (respuesta vacía del backend)');
        }
      } catch (err) {
        console.warn('⚠️ Backend no disponible, usando datos de ejemplo:', err);
        setError(null); // No mostrar error al usuario
        setAsteroids(getMockData());
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    // Actualizar cada 5 minutos
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  return { asteroids, loading, error };
}

function getMockData(): AsteroidData[] {
  return [
    {
      id: '99942',
      name: '99942 Apophis',
      diameter: 0.37,
      velocity: 30.73,
      missDistance: 31860000,
      hazardous: true,
      closeApproachDate: '2029-04-13',
      magnitude: 19.7,
      type: 'asteroid'
    },
    {
      id: '101955',
      name: '101955 Bennu',
      diameter: 0.49,
      velocity: 28.0,
      missDistance: 480000,
      hazardous: true,
      closeApproachDate: '2182-09-24',
      magnitude: 20.9,
      type: 'asteroid'
    },
    {
      id: '433',
      name: '433 Eros',
      diameter: 16.84,
      velocity: 24.36,
      missDistance: 26758428,
      hazardous: true,
      closeApproachDate: '2025-01-31',
      magnitude: 10.4,
      type: 'asteroid'
    },
    {
      id: '4179',
      name: '4179 Toutatis',
      diameter: 4.6,
      velocity: 31.0,
      missDistance: 6900000,
      hazardous: true,
      closeApproachDate: '2069-11-05',
      magnitude: 15.3,
      type: 'asteroid'
    },
    {
      id: '1950',
      name: '1950 DA',
      diameter: 1.3,
      velocity: 15.1,
      missDistance: 7800000,
      hazardous: true,
      closeApproachDate: '2880-03-16',
      magnitude: 17.4,
      type: 'asteroid'
    },
    {
      id: '2340',
      name: '2340 Hathor',
      diameter: 0.5,
      velocity: 33.2,
      missDistance: 1200000,
      hazardous: true,
      closeApproachDate: '2086-10-21',
      magnitude: 20.1,
      type: 'asteroid'
    },
    {
      id: '25143',
      name: '25143 Itokawa',
      diameter: 0.33,
      velocity: 23.8,
      missDistance: 10500000,
      hazardous: false,
      closeApproachDate: '2026-07-11',
      magnitude: 19.2,
      type: 'asteroid'
    },
    {
      id: '162173',
      name: '162173 Ryugu',
      diameter: 0.9,
      velocity: 31.9,
      missDistance: 96000000,
      hazardous: false,
      closeApproachDate: '2076-05-10',
      magnitude: 18.7,
      type: 'asteroid'
    },
    {
      id: '1866',
      name: '1866 Sisyphus',
      diameter: 8.5,
      velocity: 27.7,
      missDistance: 16000000,
      hazardous: false,
      closeApproachDate: '2071-11-24',
      magnitude: 13.0,
      type: 'asteroid'
    },
    {
      id: '4660',
      name: '4660 Nereus',
      diameter: 0.33,
      velocity: 6.5,
      missDistance: 3900000,
      hazardous: false,
      closeApproachDate: '2060-02-14',
      magnitude: 18.2,
      type: 'asteroid'
    }
  ];
}