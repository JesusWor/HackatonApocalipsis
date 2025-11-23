import { Play, Pause, RotateCcw, FastForward } from 'lucide-react';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Badge } from './ui/badge';

interface SimulationControlsProps {
  speed: number;
  onSpeedChange: (speed: number) => void;
  isPaused: boolean;
  onPauseToggle: () => void;
}

export function SimulationControls({ 
  speed, 
  onSpeedChange, 
  isPaused, 
  onPauseToggle 
}: SimulationControlsProps) {
  const speedPresets = [0.1, 0.5, 1, 2, 5, 10, 50, 100, 1000];
  
  const handleReset = () => {
    onSpeedChange(1);
  };

  return (
    <div className="bg-gradient-to-br from-blue-950/50 to-purple-950/30 border border-blue-900/30 rounded-lg p-6 backdrop-blur-sm">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="flex items-center gap-2">
            <FastForward className="w-5 h-5 text-blue-400" />
            Controles de Simulación
          </h3>
          <Badge variant="outline" className="bg-blue-950/50">
            {speed}x velocidad
          </Badge>
        </div>

        {/* Play/Pause Controls */}
        <div className="flex items-center gap-3">
          <Button
            onClick={onPauseToggle}
            variant="default"
            size="lg"
            className="flex-1 bg-blue-600 hover:bg-blue-700"
          >
            {isPaused ? (
              <>
                <Play className="w-5 h-5 mr-2" />
                Reproducir
              </>
            ) : (
              <>
                <Pause className="w-5 h-5 mr-2" />
                Pausar
              </>
            )}
          </Button>
          
          <Button
            onClick={handleReset}
            variant="outline"
            size="lg"
            className="border-blue-700 hover:bg-blue-950"
          >
            <RotateCcw className="w-5 h-5" />
          </Button>
        </div>

        {/* Speed Slider */}
        <div className="space-y-3">
          <label className="text-sm text-gray-300">
            Velocidad de simulación: {speed}x
          </label>
          <Slider
            value={[speed]}
            onValueChange={(values) => onSpeedChange(values[0])}
            min={-1000}
            max={1000}
            step={1}
            className="w-full"
          />
        </div>

      </div>
    </div>
  );
}
