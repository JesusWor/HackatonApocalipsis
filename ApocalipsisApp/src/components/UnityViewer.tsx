import { useEffect, useRef, useState } from 'react';
import { Maximize2, Loader2, TrendingUp, Play, Pause, RotateCcw } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Slider } from './ui/slider';
import { Separator } from './ui/separator';

interface UnityViewerProps {
  simulationSpeed: number;
  isPaused: boolean;
  objectType: 'all' | 'asteroid' | 'comet';
  onSpeedChange: (speed: number) => void;
  onPauseToggle: () => void;
}

export function UnityViewer({ simulationSpeed, isPaused, objectType, onSpeedChange, onPauseToggle }: UnityViewerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const speedPresets = [0.1, 0.5, 1, 2, 5, 10, 50, 100, 500, 1000];

  const handleReset = () => {
    onSpeedChange(1);
  };

  useEffect(() => {
    // Enviar configuración a Unity
    const sendToUnity = () => {
      if (iframeRef.current && iframeRef.current.contentWindow) {
        iframeRef.current.contentWindow.postMessage({
          type: 'simulation_config',
          data: {
            speed: simulationSpeed,
            paused: isPaused,
            filterType: objectType,
            timestamp: Date.now()
          }
        }, '*');
      }
    };

    sendToUnity();
  }, [simulationSpeed, isPaused, objectType]);

  const toggleFullscreen = () => {
    const element = document.querySelector('.unity-container');
    if (!document.fullscreenElement && element) {
      element.requestFullscreen();
      setIsFullscreen(true);
    } else if (document.fullscreenElement) {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div className="unity-container space-y-4">
      {/* Viewer Card */}
      <div className="bg-slate-900/50 backdrop-blur-xl border border-blue-500/20 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 px-6 py-3 border-b border-blue-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse shadow-lg shadow-green-400/50"></div>
            <h2 className="text-lg">Visualización 3D</h2>
            <Badge variant="outline" className="bg-blue-950/50 border-blue-700 text-xs">
              Unity WebGL
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleFullscreen}
              className="hover:bg-blue-950/50"
            >
              <Maximize2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Unity Viewport */}
        <div className="relative w-full aspect-[16/9] bg-gradient-to-br from-slate-950 via-blue-950/50 to-purple-950/50">
          {/* Placeholder para Unity */}
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
            {/* Animated background */}
            <div className="absolute inset-0 overflow-hidden opacity-20">
              <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            <div className="relative z-10 text-center space-y-6 max-w-2xl">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-2xl shadow-2xl shadow-blue-500/50 mb-4">
                <Loader2 className="w-10 h-10 text-white animate-spin" />
              </div>

              <div>
                <h3 className="text-2xl mb-2 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                  Unity WebGL Integration
                </h3>
                <p className="text-blue-300/80">
                  Aquí se cargará tu visualización 3D de Unity
                </p>
              </div>

              {/* Current State */}
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="bg-blue-950/30 border border-blue-700/30 rounded-lg p-3">
                  <p className="text-blue-300/60 text-xs mb-1">Estado</p>
                  <p className="text-white">{isPaused ? '⏸️ Pausado' : '▶️ Activo'}</p>
                </div>
                <div className="bg-blue-950/30 border border-blue-700/30 rounded-lg p-3">
                  <p className="text-blue-300/60 text-xs mb-1">Velocidad</p>
                  <p className="text-white">{simulationSpeed}x</p>
                </div>
                <div className="bg-blue-950/30 border border-blue-700/30 rounded-lg p-3">
                  <p className="text-blue-300/60 text-xs mb-1">Filtro</p>
                  <p className="text-white capitalize">
                    {objectType === 'all' ? 'Todos' : objectType === 'asteroid' ? 'Asteroides' : 'Cometas'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Iframe para Unity (descomenta cuando tengas el build) */}
          
          <iframe
            ref={iframeRef}
            src="/unity/index.html"
            className="w-full h-full"
            title="Unity Asteroid Simulation"
            allow="fullscreen; autoplay"
          />
         
        </div>
      </div>

      {/* Simulation Speed Controls */}
      <div className="bg-slate-900/50 backdrop-blur-xl border border-blue-500/20 rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 px-6 py-4 border-b border-blue-500/20">
          <h2 className="flex items-center gap-2 text-lg">
            <TrendingUp className="w-5 h-5 text-blue-400" />
            Velocidad de Simulación
          </h2>
        </div>

        <div className="p-6 space-y-6">
          {/* Speed Slider */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-300">
                Velocidad actual
              </label>
              <Badge variant="secondary" className="bg-blue-950/50">
                {simulationSpeed}x
              </Badge>
            </div>
            
            <Slider
              value={[simulationSpeed]}
              onValueChange={(values) => onSpeedChange(values[0])}
              min={-1000}
              max={1000}
              step={1}
              className="w-full"
            />

          </div>

          <Separator className="bg-blue-900/30" />

          {/* Playback Controls */}
          <div className="space-y-3">
            <label className="text-sm text-gray-300">Controles de reproducción</label>
            <div className="flex gap-2">
              <Button
                onClick={onPauseToggle}
                size="lg"
                className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-lg shadow-blue-500/30 h-12"
              >
                {isPaused ? (
                  <>
                    <Play className="w-5 h-5 mr-2 fill-current" />
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
                className="border-blue-700/50 hover:bg-blue-950/50 hover:border-blue-600 h-12 px-4"
              >
                <RotateCcw className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}