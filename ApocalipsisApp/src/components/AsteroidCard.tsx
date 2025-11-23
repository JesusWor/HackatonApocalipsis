import React, { useState } from 'react'

const ERROR_IMG_SRC =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg=='

export function ImageWithFallback(props: React.ImgHTMLAttributes<HTMLImageElement>) {
  const [didError, setDidError] = useState(false)

  const handleError = () => {
    setDidError(true)
  }

  const { src, alt, style, className, ...rest } = props

  return didError ? (
    <div
      className={`inline-block bg-gray-100 text-center align-middle ${className ?? ''}`}
      style={style}
    >
      <div className="flex items-center justify-center w-full h-full">
        <img src={ERROR_IMG_SRC} alt="Error loading image" {...rest} data-original-url={src} />
      </div>
    </div>
  ) : (
    <img src={src} alt={alt} className={className} style={style} {...rest} onError={handleError} />
  )
}

export interface AsteroidOrbitalData {
  epoch: string; // Epoch osculation
  e: string; // Eccentricity
  a: string; // Semi major axis
  i: string; // Inclination
  om: string; // Longitude of the ascending node
  per: string; // Orbital period
  w: string; // Argument of perihelion
  M: string; // Mean anomaly
  n: string; // Mean motion
}

interface AsteroidCardProps {
  name: string;
  imageUrl: string;
  orbitalData: AsteroidOrbitalData;
  isPotentiallyHazardous?: boolean;
}

export function AsteroidCard({ name, imageUrl, orbitalData, isPotentiallyHazardous }: AsteroidCardProps) {
  const orbitalFields = [
    { label: "Época", value: orbitalData.epoch, unit: "" },
    { label: "Excentricidad", value: orbitalData.e, unit: "" },
    { label: "Semi-eje mayor", value: orbitalData.a, unit: "AU" },
    { label: "Inclinación", value: orbitalData.i, unit: "°" },
    { label: "Long. nodo ascendente", value: orbitalData.om, unit: "°" },
    { label: "Período orbital", value: orbitalData.per, unit: "días" },
    { label: "Arg. del perihelio", value: orbitalData.w, unit: "°" },
    { label: "Anomalía media", value: orbitalData.M, unit: "°" },
    { label: "Movimiento medio", value: orbitalData.n, unit: "°/día" }
  ];

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-blue-500/20 rounded-xl overflow-hidden hover:border-blue-500/40 transition-all duration-300 group">
      {/* Image Section */}
      <div className="relative aspect-video bg-slate-900/50 overflow-hidden">
        <ImageWithFallback
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {isPotentiallyHazardous && (
          <div className="absolute top-3 right-3 bg-red-500/90 backdrop-blur-sm px-3 py-1 rounded-full">
            <span className="text-xs">⚠ Peligroso</span>
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent p-4">
          <h3 className="text-lg text-white">{name}</h3>
        </div>
      </div>

      {/* Orbital Data Section */}
      <div className="p-4 space-y-2">
        <div className="mb-3">
          <h4 className="text-sm text-blue-400 mb-2">Datos Orbitales</h4>
          <div className="h-px bg-gradient-to-r from-blue-500/50 to-transparent"></div>
        </div>
        
        <div className="grid grid-cols-1 gap-2">
          {orbitalFields.map((field, index) => (
            <div 
              key={index} 
              className="flex justify-between items-center py-1.5 px-2 rounded-lg bg-slate-900/30 hover:bg-slate-900/50 transition-colors"
            >
              <span className="text-xs text-slate-400">{field.label}</span>
              <span className="text-xs text-white">
                {field.value} {field.unit && <span className="text-slate-500">{field.unit}</span>}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
