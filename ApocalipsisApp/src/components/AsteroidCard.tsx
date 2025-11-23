import { AlertTriangle, Maximize2, Gauge, Calendar } from 'lucide-react';
import { Badge } from './ui/badge';
import { Card } from './ui/card';

interface Asteroid {
  id: string;
  name: string;
  diameter: number;
  velocity: number;
  missDistance: number;
  hazardous: boolean;
  closeApproachDate: string;
  magnitude: number;
}

interface AsteroidCardProps {
  asteroid: Asteroid;
  rank: number;
  isSelected: boolean;
  onSelect: () => void;
}

export function AsteroidCard({ asteroid, rank, isSelected, onSelect }: AsteroidCardProps) {
  const formatDistance = (km: number) => {
    if (km > 1000000) {
      return `${(km / 1000000).toFixed(2)} M km`;
    }
    return `${km.toLocaleString()} km`;
  };

  const getRiskLevel = (distance: number, hazardous: boolean) => {
    if (!hazardous) return { label: 'Bajo', color: 'bg-green-500' };
    if (distance < 5000000) return { label: 'Alto', color: 'bg-red-500' };
    if (distance < 20000000) return { label: 'Medio', color: 'bg-orange-500' };
    return { label: 'Bajo', color: 'bg-yellow-500' };
  };

  const risk = getRiskLevel(asteroid.missDistance, asteroid.hazardous);

  return (
    <Card
      className={`p-4 cursor-pointer transition-all duration-200 border ${
        isSelected
          ? 'bg-blue-950/70 border-blue-500 shadow-lg shadow-blue-500/20'
          : 'bg-gradient-to-br from-blue-950/30 to-purple-950/20 border-blue-900/30 hover:border-blue-700/50'
      }`}
      onClick={onSelect}
    >
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-2">
            <Badge variant="outline" className="bg-blue-950/50 border-blue-700">
              #{rank}
            </Badge>
            <div className="flex-1">
              <h3 className="text-sm leading-tight mb-1">{asteroid.name}</h3>
              <p className="text-xs text-gray-400">ID: {asteroid.id}</p>
            </div>
          </div>
          {asteroid.hazardous && (
            <AlertTriangle className="w-4 h-4 text-orange-500 flex-shrink-0" />
          )}
        </div>

        {/* Risk Badge */}
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${risk.color}`} />
          <span className="text-xs text-gray-300">Riesgo: {risk.label}</span>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-gray-400">
              <Maximize2 className="w-3 h-3" />
              <span>Diámetro</span>
            </div>
            <p className="text-blue-300">{asteroid.diameter.toFixed(2)} km</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1 text-gray-400">
              <Gauge className="w-3 h-3" />
              <span>Velocidad</span>
            </div>
            <p className="text-blue-300">{asteroid.velocity.toFixed(2)} km/s</p>
          </div>

          <div className="space-y-1">
            <div className="text-gray-400">Distancia mínima</div>
            <p className="text-blue-300">{formatDistance(asteroid.missDistance)}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1 text-gray-400">
              <Calendar className="w-3 h-3" />
              <span>Aproximación</span>
            </div>
            <p className="text-blue-300">
              {new Date(asteroid.closeApproachDate).getFullYear()}
            </p>
          </div>
        </div>

        {/* Magnitude */}
        <div className="pt-2 border-t border-blue-900/30">
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-400">Magnitud absoluta</span>
            <span className="text-blue-300">{asteroid.magnitude}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
