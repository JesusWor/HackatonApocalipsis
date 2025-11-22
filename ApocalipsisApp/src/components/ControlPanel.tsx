import { Filter } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import type { Asteroid } from '../types/asteroid';
import { Card } from './ui/card';

interface ControlPanelProps {
  objectType: 'all' | 'asteroid' | 'comet';
  onObjectTypeChange: (type: 'all' | 'asteroid' | 'comet') => void;
  asteroids: Asteroid[];
}

export function ControlPanel({
  objectType,
  onObjectTypeChange,
  asteroids
}: ControlPanelProps) {
  const filteredAsteroids = asteroids.filter(asteroid => 
    objectType === 'all' || asteroid.type === objectType
  );

  const hazardousCount = filteredAsteroids.filter(a => a.hazardous).length;

  return (
    <div className="space-y-6">
      {/* Main Control Card */}
      <div className="bg-slate-900/50 backdrop-blur-xl border border-blue-500/20 rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 px-6 py-4 border-b border-blue-500/20">
          <h2 className="flex items-center gap-2 text-lg">
            <Filter className="w-5 h-5 text-blue-400" />
            Filtros
          </h2>
          <p className="text-xs text-blue-300/60 mt-1">Configuración de visualización</p>
        </div>

        <div className="p-6 space-y-6">
          {/* Object Type Filter */}
          <div className="space-y-3">
            <label className="text-sm text-gray-300 flex items-center justify-between">
              Tipo de objeto
              <Badge variant="outline" className="bg-blue-950/50 border-blue-700 text-xs">
                {filteredAsteroids.length} objetos
              </Badge>
            </label>
            <Select value={objectType} onValueChange={onObjectTypeChange}>
              <SelectTrigger className="bg-slate-950/50 border-blue-700/50 h-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-blue-700/50">
                <SelectItem value="all">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                    Todos los objetos
                  </div>
                </SelectItem>
                <SelectItem value="asteroid">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-orange-400"></div>
                    Solo asteroides
                  </div>
                </SelectItem>
                <SelectItem value="comet">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
                    Solo cometas
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Asteroids List */}
      <div className="bg-slate-900/50 backdrop-blur-xl border border-blue-500/20 rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 px-6 py-4 border-b border-blue-500/20">
          <div className="flex items-center justify-between">
            <h2 className="text-lg">Objetos detectados</h2>
            {hazardousCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                {hazardousCount} peligrosos
              </Badge>
            )}
          </div>
        </div>

        <div className="p-4 space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar">
          {filteredAsteroids.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <p className="text-sm">No hay datos disponibles</p>
              <p className="text-xs mt-2">Unity enviará los datos vía postMessage</p>
            </div>
          ) : (
            filteredAsteroids.map((asteroid) => (
              <Card
                key={asteroid.id}
                className="p-3 bg-gradient-to-br from-blue-950/30 to-purple-950/20 border-blue-900/30 hover:border-blue-700/50 transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2 flex-1 min-w-0">
                    <div className={`w-2 h-2 rounded-full mt-1 flex-shrink-0 ${
                      asteroid.hazardous ? 'bg-red-400' : 'bg-blue-400'
                    }`}></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm truncate">{asteroid.name}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                        <span>{asteroid.diameter.toFixed(1)} km</span>
                        <span>•</span>
                        <span>{asteroid.velocity.toFixed(1)} km/s</span>
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-[10px] bg-slate-950/50 border-blue-800 flex-shrink-0">
                    {asteroid.type === 'asteroid' ? 'Asteroide' : 'Cometa'}
                  </Badge>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
