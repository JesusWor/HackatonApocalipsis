import { useState, useEffect } from 'react';
import { AsteroidCard } from './AsteroidCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Loader2, AlertTriangle, Maximize2 } from 'lucide-react';
import { Badge } from './ui/badge';

interface Asteroid {
  id: string;
  name: string;
  diameter: number; // km
  velocity: number; // km/s
  missDistance: number; // km
  hazardous: boolean;
  closeApproachDate: string;
  magnitude: number;
}

interface AsteroidDashboardProps {
  onSelectAsteroid: (id: string) => void;
  selectedAsteroid: string | null;
}

export function AsteroidDashboard({ onSelectAsteroid, selectedAsteroid }: AsteroidDashboardProps) {
  const [asteroids, setAsteroids] = useState<Asteroid[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'dangerous' | 'large'>('dangerous');

  useEffect(() => {
    // Simular carga de datos de la API de NASA
    // En producción, aquí harías fetch a la NASA NeoWs API
    const fetchAsteroids = async () => {
      setLoading(true);
      
      // Datos simulados basados en asteroides reales
      const mockAsteroids: Asteroid[] = [
        {
          id: '433',
          name: '433 Eros',
          diameter: 16.84,
          velocity: 24.36,
          missDistance: 26758428,
          hazardous: true,
          closeApproachDate: '2025-01-31',
          magnitude: 10.4
        },
        {
          id: '99942',
          name: '99942 Apophis',
          diameter: 0.37,
          velocity: 30.73,
          missDistance: 31860000,
          hazardous: true,
          closeApproachDate: '2029-04-13',
          magnitude: 19.7
        },
        {
          id: '101955',
          name: '101955 Bennu',
          diameter: 0.49,
          velocity: 28.0,
          missDistance: 480000,
          hazardous: true,
          closeApproachDate: '2182-09-24',
          magnitude: 20.9
        },
        {
          id: '1866',
          name: '1866 Sisyphus',
          diameter: 8.5,
          velocity: 27.7,
          missDistance: 16000000,
          hazardous: false,
          closeApproachDate: '2071-11-24',
          magnitude: 13.0
        },
        {
          id: '4179',
          name: '4179 Toutatis',
          diameter: 4.6,
          velocity: 31.0,
          missDistance: 6900000,
          hazardous: true,
          closeApproachDate: '2069-11-05',
          magnitude: 15.3
        },
        {
          id: '25143',
          name: '25143 Itokawa',
          diameter: 0.33,
          velocity: 23.8,
          missDistance: 10500000,
          hazardous: false,
          closeApproachDate: '2026-07-11',
          magnitude: 19.2
        },
        {
          id: '162173',
          name: '162173 Ryugu',
          diameter: 0.9,
          velocity: 31.9,
          missDistance: 96000000,
          hazardous: false,
          closeApproachDate: '2076-05-10',
          magnitude: 18.7
        },
        {
          id: '1950',
          name: '1950 DA',
          diameter: 1.3,
          velocity: 15.1,
          missDistance: 7800000,
          hazardous: true,
          closeApproachDate: '2880-03-16',
          magnitude: 17.4
        },
        {
          id: '2340',
          name: '2340 Hathor',
          diameter: 0.5,
          velocity: 33.2,
          missDistance: 1200000,
          hazardous: true,
          closeApproachDate: '2086-10-21',
          magnitude: 20.1
        },
        {
          id: '4660',
          name: '4660 Nereus',
          diameter: 0.33,
          velocity: 6.5,
          missDistance: 3900000,
          hazardous: false,
          closeApproachDate: '2060-02-14',
          magnitude: 18.2
        }
      ];

      // Simular delay de red
      setTimeout(() => {
        setAsteroids(mockAsteroids);
        setLoading(false);
      }, 1000);
    };

    fetchAsteroids();
  }, []);

  const sortedAsteroids = [...asteroids].sort((a, b) => {
    if (sortBy === 'dangerous') {
      // Ordenar por distancia de aproximación (más cercanos primero)
      return a.missDistance - b.missDistance;
    } else {
      // Ordenar por diámetro (más grandes primero)
      return b.diameter - a.diameter;
    }
  });

  const hazardousCount = asteroids.filter(a => a.hazardous).length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-950/50 to-purple-950/30 border border-blue-900/30 rounded-lg p-4 backdrop-blur-sm">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h2 className="text-xl mb-1">Asteroides Cercanos</h2>
            <p className="text-sm text-gray-400">Top 10 NEOs</p>
          </div>
          <Badge variant="destructive" className="flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            {hazardousCount} Peligrosos
          </Badge>
        </div>

        {/* Tabs */}
        <Tabs value={sortBy} onValueChange={(v) => setSortBy(v as 'dangerous' | 'large')}>
          <TabsList className="grid w-full grid-cols-2 bg-blue-950/50">
            <TabsTrigger value="dangerous" className="text-xs">
              Más Peligrosos
            </TabsTrigger>
            <TabsTrigger value="large" className="text-xs">
              Más Grandes
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Asteroid List */}
      <div className="space-y-3 max-h-[800px] overflow-y-auto pr-2 custom-scrollbar">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
          </div>
        ) : (
          sortedAsteroids.map((asteroid, index) => (
            <AsteroidCard
              key={asteroid.id}
              asteroid={asteroid}
              rank={index + 1}
              isSelected={selectedAsteroid === asteroid.id}
              onSelect={() => onSelectAsteroid(asteroid.id)}
            />
          ))
        )}
      </div>

      {/* API Info */}
      <div className="bg-black/30 border border-blue-900/20 rounded-lg p-3 text-xs text-gray-400">
        <p className="mb-1">📡 Datos de NASA NeoWs API</p>
        <p className="text-[10px]">
          Para datos en vivo, configura tu API key de NASA en: 
          <span className="text-blue-400"> api.nasa.gov</span>
        </p>
      </div>
    </div>
  );
}
