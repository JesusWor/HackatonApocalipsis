import { useEffect, useRef, useState } from 'react';
import { Maximize2, TrendingUp, Play, Pause, RotateCcw } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Slider } from './ui/slider';
import { Separator } from './ui/separator';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

interface SpaceSimulationProps {
  simulationSpeed: number;
  isPaused: boolean;
  objectType: 'all' | 'asteroid' | 'comet';
  onSpeedChange: (speed: number) => void;
  onPauseToggle: () => void;
  asteroids: any[];
  onAsteroidSelect?: (asteroid: any) => void;
  selectedAsteroid?: any;
}

export function SpaceSimulation({ 
  simulationSpeed, 
  isPaused, 
  objectType, 
  onSpeedChange, 
  onPauseToggle,
  asteroids,
  onAsteroidSelect,
  selectedAsteroid
}: SpaceSimulationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    controls: OrbitControls;
    earth: THREE.Mesh;
    asteroidObjects: Array<{
      mesh: THREE.Mesh;
      orbit: THREE.Line;
      data: any;
      angle: number;
      speed: number;
    }>;
    animationId: number | null;
  } | null>(null);

  const speedPresets = [0.1, 0.5, 1, 2, 5, 10, 50, 100, 500, 1000];

  const handleReset = () => {
    onSpeedChange(1);
  };

  // Inicializar Three.js
  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000510);

    // Camera
    const camera = new THREE.PerspectiveCamera(
      60,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      10000
    );
    camera.position.set(0, 100, 200);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 50;
    controls.maxDistance = 500;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 1.5);
    sunLight.position.set(100, 50, 100);
    scene.add(sunLight);

    const pointLight = new THREE.PointLight(0xffffff, 1, 1000);
    pointLight.position.set(0, 0, 0);
    scene.add(pointLight);

    // Starfield
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.7 });
    const starsVertices = [];
    for (let i = 0; i < 10000; i++) {
      const x = (Math.random() - 0.5) * 2000;
      const y = (Math.random() - 0.5) * 2000;
      const z = (Math.random() - 0.5) * 2000;
      starsVertices.push(x, y, z);
    }
    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    // Earth - Mejorada con mejor diseño
    const earthGeometry = new THREE.SphereGeometry(15, 128, 128);
    
    // Crear textura procedural para la Tierra
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d')!;
    
    // Gradiente de océanos
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#1a2980');
    gradient.addColorStop(0.5, '#0f4c81');
    gradient.addColorStop(1, '#0a2540');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Agregar continentes (patrón aleatorio)
    ctx.fillStyle = '#2a5c3f';
    for (let i = 0; i < 50; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const radius = 20 + Math.random() * 100;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Nubes
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    for (let i = 0; i < 100; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const radius = 10 + Math.random() * 40;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
    
    const earthTexture = new THREE.CanvasTexture(canvas);
    earthTexture.needsUpdate = true;
    
    const earthMaterial = new THREE.MeshPhongMaterial({
      map: earthTexture,
      emissive: 0x0a1f3d,
      emissiveIntensity: 0.3,
      shininess: 15,
      bumpScale: 0.05,
    });
    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    scene.add(earth);

    // Earth atmosphere - Mejorada
    const atmosphereGeometry = new THREE.SphereGeometry(16.2, 128, 128);
    const atmosphereMaterial = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
          gl_FragColor = vec4(0.3, 0.6, 1.0, 1.0) * intensity;
        }
      `,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      transparent: true,
    });
    const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    scene.add(atmosphere);

    sceneRef.current = {
      scene,
      camera,
      renderer,
      controls,
      earth,
      asteroidObjects: [],
      animationId: null,
    };

    // Animation loop
    const animate = () => {
      if (!sceneRef.current) return;

      sceneRef.current.animationId = requestAnimationFrame(animate);
      
      // Rotate Earth
      sceneRef.current.earth.rotation.y += 0.001;
      
      // Update asteroids
      if (!isPaused) {
        sceneRef.current.asteroidObjects.forEach((asteroidObj) => {
          asteroidObj.angle += asteroidObj.speed * simulationSpeed * 0.001;
          
          const distance = asteroidObj.data.distance || 100;
          const x = Math.cos(asteroidObj.angle) * distance;
          const z = Math.sin(asteroidObj.angle) * distance;
          const y = Math.sin(asteroidObj.angle * 0.5) * (distance * 0.1);
          
          asteroidObj.mesh.position.set(x, y, z);
          asteroidObj.mesh.rotation.x += 0.01;
          asteroidObj.mesh.rotation.y += 0.01;
        });
      }

      sceneRef.current.controls.update();
      sceneRef.current.renderer.render(sceneRef.current.scene, sceneRef.current.camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current || !sceneRef.current) return;
      
      sceneRef.current.camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      sceneRef.current.camera.updateProjectionMatrix();
      sceneRef.current.renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (sceneRef.current?.animationId) {
        cancelAnimationFrame(sceneRef.current.animationId);
      }
      if (sceneRef.current?.renderer && containerRef.current) {
        containerRef.current.removeChild(sceneRef.current.renderer.domElement);
      }
      sceneRef.current?.renderer.dispose();
    };
  }, []);

  // Update asteroids when data changes
  useEffect(() => {
    if (!sceneRef.current) return;

    // Remove old asteroids
    sceneRef.current.asteroidObjects.forEach((obj) => {
      sceneRef.current?.scene.remove(obj.mesh);
      sceneRef.current?.scene.remove(obj.orbit);
    });
    sceneRef.current.asteroidObjects = [];

    // Add new asteroids
    asteroids.forEach((asteroid, index) => {
      if (!sceneRef.current) return;

      // Calcular distancia basada en missDistance (escala logarítmica para visualización)
      const distance = 50 + Math.log10(asteroid.missDistance || 1000000) * 10;
      
      // Tamaño del asteroide basado en diámetro
      const size = Math.max(0.5, Math.min(3, asteroid.diameter * 0.3));
      
      // Color según peligrosidad
      const color = asteroid.hazardous ? 0xff3333 : 0xaaaaaa;
      
      // Crear asteroide
      const geometry = asteroid.type === 'comet' 
        ? new THREE.ConeGeometry(size, size * 2, 8)
        : new THREE.SphereGeometry(size, 16, 16);
      
      const material = new THREE.MeshPhongMaterial({
        color,
        emissive: asteroid.hazardous ? 0x661111 : 0x222222,
        shininess: 10,
      });
      
      const mesh = new THREE.Mesh(geometry, material);
      
      // Posición inicial
      const angle = (index / asteroids.length) * Math.PI * 2;
      mesh.position.set(
        Math.cos(angle) * distance,
        Math.sin(angle * 0.5) * (distance * 0.1),
        Math.sin(angle) * distance
      );
      
      sceneRef.current.scene.add(mesh);

      // Crear órbita
      const orbitPoints = [];
      for (let i = 0; i <= 64; i++) {
        const a = (i / 64) * Math.PI * 2;
        orbitPoints.push(
          new THREE.Vector3(
            Math.cos(a) * distance,
            Math.sin(a * 0.5) * (distance * 0.1),
            Math.sin(a) * distance
          )
        );
      }
      
      const orbitGeometry = new THREE.BufferGeometry().setFromPoints(orbitPoints);
      const orbitMaterial = new THREE.LineBasicMaterial({
        color: asteroid.hazardous ? 0xff6666 : 0x4444ff,
        transparent: true,
        opacity: 0.3,
      });
      
      const orbit = new THREE.Line(orbitGeometry, orbitMaterial);
      sceneRef.current.scene.add(orbit);

      // Guardar referencia
      sceneRef.current.asteroidObjects.push({
        mesh,
        orbit,
        data: { ...asteroid, distance },
        angle,
        speed: asteroid.velocity / 30, // Escalar velocidad para visualización
      });
    });
  }, [asteroids]);

  return (
    <div className="space-y-4">
      {/* Viewer Card */}
      <div className="bg-slate-900/50 backdrop-blur-xl border border-blue-500/20 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 px-6 py-3 border-b border-blue-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse shadow-lg shadow-green-400/50"></div>
            <h2 className="text-lg">Simulación 3D</h2>
            <Badge variant="outline" className="bg-blue-950/50 border-blue-700 text-xs">
              Three.js
            </Badge>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-xs text-blue-300">
              {asteroids.length} objetos en órbita
            </div>
          </div>
        </div>

        {/* 3D Canvas */}
        <div 
          ref={containerRef} 
          className="w-full aspect-[16/9] bg-black relative"
        >
          {asteroids.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-gray-400">Esperando datos de asteroides...</p>
                <p className="text-sm text-gray-500 mt-2">Conecta con el backend para cargar datos</p>
              </div>
            </div>
          )}
        </div>

        {/* Controls info */}
        <div className="px-6 py-3 bg-slate-950/50 border-t border-blue-500/20 text-xs text-gray-400">
          <p>🖱️ Click izquierdo: Rotar | Rueda: Zoom | Click derecho: Pan</p>
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
              min={0.1}
              max={1000}
              step={0.1}
              className="w-full"
            />

            {/* Speed Presets */}
            <div className="grid grid-cols-5 gap-2">
              {speedPresets.map((preset) => (
                <Button
                  key={preset}
                  onClick={() => onSpeedChange(preset)}
                  variant={simulationSpeed === preset ? "default" : "outline"}
                  size="sm"
                  className={`text-xs h-8 ${
                    simulationSpeed === preset 
                      ? "bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/30" 
                      : "border-blue-800/50 hover:bg-blue-950/50 hover:border-blue-600"
                  }`}
                >
                  {preset}x
                </Button>
              ))}
            </div>
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