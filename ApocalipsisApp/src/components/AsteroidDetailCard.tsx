import { AlertTriangle, Maximize2, X } from 'lucide-react';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { Button } from './ui/button';

export interface AsteroidOrbitalData {
  epoch: string;
  e: string;  // eccentricity
  a: string;  // semi-major axis (AU)
  i: string;  // inclination (deg)
  om: string; // longitude of ascending node (deg)
  per: string; // perihelion distance (AU)
  w: string;  // argument of perihelion (deg)
  M: string;  // mean anomaly (deg)
  n: string;  // mean motion (deg/day)
}

interface AsteroidDetailCardProps {
  name: string;
  imageUrl: string;
  orbitalData: AsteroidOrbitalData;
  onClose?: () => void;
  diameter?: number;
  velocity?: number;
  hazardous?: boolean;
  closeApproachDate?: string;
}

export function AsteroidDetailCard({ 
  name, 
  imageUrl, 
  orbitalData, 
  onClose,
  diameter,
  velocity,
  hazardous,
  closeApproachDate 
}: AsteroidDetailCardProps) {
  return (
    <Card className="bg-gradient-to-br from-blue-950/50 to-purple-950/30 border border-blue-900/30 backdrop-blur-sm overflow-hidden">
      {/* Header */}
      <div className="relative">
        <img 
          src={imageUrl} 
          alt={name}
          className="w-full h-48 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
        
        {onClose && (
          <Button
            onClick={onClose}
            variant="outline"
            size="sm"
            className="absolute top-3 right-3 bg-slate-950/80 border-blue-700/50 hover:bg-slate-900"
          >
            <X className="w-4 h-4" />
          </Button>
        )}

        <div className="absolute bottom-3 left-3 right-3">
          <div className="flex items-center gap-2 mb-2">
            <h2 className="text-xl">{name}</h2>
            {hazardous && (
              <Badge variant="destructive" className="text-xs">
                <AlertTriangle className="w-3 h-3 mr-1" />
                Peligroso
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Basic Info */}
      {(diameter || velocity || closeApproachDate) && (
        <div className="p-4 border-b border-blue-900/30">
          <div className="grid grid-cols-3 gap-4 text-sm">
            {diameter && (
              <div>
                <div className="text-gray-400 text-xs mb-1">Diámetro</div>
                <div className="text-blue-300">{diameter.toFixed(2)} km</div>
              </div>
            )}
            {velocity && (
              <div>
                <div className="text-gray-400 text-xs mb-1">Velocidad</div>
                <div className="text-blue-300">{velocity.toFixed(2)} km/s</div>
              </div>
            )}
            {closeApproachDate && (
              <div>
                <div className="text-gray-400 text-xs mb-1">Aproximación</div>
                <div className="text-blue-300">
                  {new Date(closeApproachDate).toLocaleDateString()}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Orbital Parameters */}
      <div className="p-4">
        <h3 className="text-sm mb-3 text-blue-300 flex items-center gap-2">
          <Maximize2 className="w-4 h-4" />
          Parámetros Orbitales
        </h3>
        
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="space-y-1">
            <div className="text-gray-400">Época (JD)</div>
            <div className="text-blue-200 font-mono">{orbitalData.epoch}</div>
          </div>

          <div className="space-y-1">
            <div className="text-gray-400">Excentricidad</div>
            <div className="text-blue-200 font-mono">{orbitalData.e}</div>
          </div>

          <div className="space-y-1">
            <div className="text-gray-400">Semi-eje mayor (AU)</div>
            <div className="text-blue-200 font-mono">{orbitalData.a}</div>
          </div>

          <div className="space-y-1">
            <div className="text-gray-400">Inclinación (°)</div>
            <div className="text-blue-200 font-mono">{orbitalData.i}</div>
          </div>

          <div className="space-y-1">
            <div className="text-gray-400">Long. nodo asc. (°)</div>
            <div className="text-blue-200 font-mono">{orbitalData.om}</div>
          </div>

          <div className="space-y-1">
            <div className="text-gray-400">Dist. perihelio (AU)</div>
            <div className="text-blue-200 font-mono">{orbitalData.per}</div>
          </div>

          <div className="space-y-1">
            <div className="text-gray-400">Arg. perihelio (°)</div>
            <div className="text-blue-200 font-mono">{orbitalData.w}</div>
          </div>

          <div className="space-y-1">
            <div className="text-gray-400">Anomalía media (°)</div>
            <div className="text-blue-200 font-mono">{orbitalData.M}</div>
          </div>

          <div className="space-y-1 col-span-2">
            <div className="text-gray-400">Movimiento medio (°/día)</div>
            <div className="text-blue-200 font-mono">{orbitalData.n}</div>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="px-4 py-3 bg-slate-950/50 border-t border-blue-900/30">
        <p className="text-xs text-gray-400">
          Datos orbitales del JPL Small-Body Database
        </p>
      </div>
    </Card>
  );
}
