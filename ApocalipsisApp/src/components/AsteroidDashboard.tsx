import { useState, useEffect } from 'react';
import { AsteroidCard} from './AsteroidCard';
import type { AsteroidOrbitalData } from './AsteroidCard';
import { Loader2, AlertTriangle, Maximize2 } from 'lucide-react';
import { Badge } from './ui/badge';

const orbitalData: AsteroidOrbitalData = {
        epoch: "2455562.5",
        e: "0.204",
        a: "1.13",
        i: "6.03",
        om: "2.06",
        per: "437",
        w: "66.2",
        M: "102",
        n: "0.824"
      };

export function AsteroidDashboard() {
  const [asteroids, setAsteroids] = useState<AsteroidOrbitalData[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'dangerous' | 'large'>('dangerous');

  useEffect(() => {
    // Simular carga de datos de la API de NASA
    // En producción, aquí harías fetch a la NASA NeoWs API
    const fetchAsteroids = async () => {
      const orbitalData: AsteroidOrbitalData = {
        epoch: "2455562.5",
        e: "0.204",
        a: "1.13",
        i: "6.03",
        om: "2.06",
        per: "437",
        w: "66.2",
        M: "102",
        n: "0.824"
      };

      // Simular delay de red
      setTimeout(() => {
        setAsteroids([orbitalData]);
        setLoading(false);
      }, 1000);
    };

    fetchAsteroids();
  }, []);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-950/50 to-purple-950/30 border border-blue-900/30 rounded-lg p-4 backdrop-blur-sm">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h2 className="text-xl mb-1">Asteroide seleccionado</h2>
          </div>

        </div>

      </div>

      {/* Asteroid List */}
      <div className="space-y-3 max-h-[800px] overflow-y-auto pr-2 custom-scrollbar">
        <AsteroidCard name = "101955 Bennu" imageUrl='https://wp.technologyreview.com/wp-content/uploads/2020/10/BennuAsteroid.jpg' orbitalData = {orbitalData}></AsteroidCard>
      </div>
    </div>
  );
}
