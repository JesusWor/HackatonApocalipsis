import { useState, useEffect } from 'react';
import { SpaceSimulation } from './components/SpaceSimulation';
import { ControlPanel } from './components/ControlPanel';
import { useNASAData } from '../Server/server';

export interface Asteroid {
  id: string;
  name: string;
  diameter: number; // km
  velocity: number; // km/s
  missDistance: number; // km
  hazardous: boolean;
  closeApproachDate: string;
  magnitude: number;
  type: 'asteroid' | 'comet';
}

export default function App() {
  const [simulationSpeed, setSimulationSpeed] = useState(10); // Velocidad inicial 10x
  const [isPaused, setIsPaused] = useState(false);
  const [objectType, setObjectType] = useState<'all' | 'asteroid' | 'comet'>('all');
  const [selectedAsteroid, setSelectedAsteroid] = useState<Asteroid | null>(null);
  
  // Obtener datos de NASA
  const { asteroids: nasaAsteroids, loading, error } = useNASAData();
  const [asteroids, setAsteroids] = useState<Asteroid[]>([]);

  // Actualizar asteroides cuando llegan datos
  useEffect(() => {
    setAsteroids(nasaAsteroids);
  }, [nasaAsteroids]);

  // Escuchar mensajes de Unity (por si se integra más adelante)
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'asteroids_data') {
        setAsteroids(event.data.asteroids);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
      {/* Header */}
      <header className="border-b border-blue-800/30 bg-slate-950/80 backdrop-blur-md shadow-lg">
        <div className="container mx-auto px-6 py-5">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500 blur-xl opacity-50"></div>
              <div className="relative w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center shadow-xl">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div>
              <h1 className="text-3xl tracking-tight bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                NEO Tracking System
              </h1>
              <p className="text-sm text-blue-300/80 mt-0.5">
                Near Earth Objects - Real-Time Visualization
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Control Panel - Left Side */}
          <div className="lg:col-span-4 xl:col-span-3">
            <ControlPanel
              objectType={objectType}
              onObjectTypeChange={setObjectType}
              asteroids={asteroids}
            />
          </div>

          {/* Unity Viewer - Right Side */}
          <div className="lg:col-span-8 xl:col-span-9">
            <SpaceSimulation 
              simulationSpeed={simulationSpeed}
              isPaused={isPaused}
              objectType={objectType}
              onSpeedChange={setSimulationSpeed}
              onPauseToggle={() => setIsPaused(!isPaused)}
              asteroids={asteroids}
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-blue-800/30 bg-slate-950/80 backdrop-blur-md mt-12">
        <div className="container mx-auto px-6 py-4">
          <p className="text-sm text-center text-gray-400">
            Data provided by NASA's Near Earth Object Web Service (NeoWs) API
          </p>
        </div>
      </footer>
    </div>
  );
}