import { useState } from "react";
import Image from "next/image";

export default function LazyImage({
                                      src,
                                      alt,
                                      className = "",
                                      style = {},
                                      priority = false,
                                      fill = false,
                                      width,
                                      height,
                                      sizes,
                                      ...props
                                  }) {
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(false);

    const handleLoad = () => {
        setLoaded(true);
    };

    const handleError = () => {
        setError(true);
    };

    // Jeśli użyto fill, renderujemy Image z fill
    if (fill) {
        return (
            <div className={`relative overflow-hidden ${className}`} style={style}>
                {!loaded && !error && (
                    <div className="absolute inset-0 animate-pulse bg-gray-200 z-0" />
                )}
                {!error ? (
                    <Image
                        src={src}
                        alt={alt || ""}
                        fill
                        sizes={sizes || "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
                        className={`object-contain transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
                        priority={priority}
                        onLoad={handleLoad}
                        onError={handleError}
                        {...props}
                    />
                ) : (
                    <div className="flex items-center justify-center h-[250px] bg-gray-100 text-gray-500">
                        Image unavailable
                    </div>
                )}
            </div>
        );
    }

    // Jeśli podano width i height, używamy ich
    if (width && height) {
        return (
            <div className={`relative overflow-hidden ${className}`} style={style}>
                {!loaded && !error && (
                    <div className="absolute inset-0 animate-pulse bg-gray-200 z-0" />
                )}
                {!error ? (
                    <Image
                        src={src}
                        alt={alt || ""}
                        width={width}
                        height={height}
                        sizes={sizes || "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
                        className={`w-full h-auto object-contain transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
                        priority={priority}
                        onLoad={handleLoad}
                        onError={handleError}
                        {...props}
                    />
                ) : (
                    <div className="flex items-center justify-center h-[250px] bg-gray-100 text-gray-500">
                        Image unavailable
                    </div>
                )}
            </div>
        );
    }

    // Fallback dla przypadków bez width/height - używamy naturalnej wysokości obrazu
    // Używamy szerokiego width, aby Next.js mógł zoptymalizować obraz
    // className="h-auto" sprawia, że wysokość jest automatyczna i proporcjonalna do szerokości
    // Dodajemy min-height i aspect-ratio, żeby zarezerwować miejsce przed załadowaniem (zapobiega pustej przestrzeni w CSS columns)
    return (
        <div className={`relative w-full ${className}`} style={{ ...style, minHeight: '300px', aspectRatio: 'auto' }}>
            {!loaded && !error && (
                <div className="absolute inset-0 animate-pulse bg-gray-200 z-0" style={{ minHeight: '300px', width: '100%' }} />
            )}
            {!error ? (
                <div className="relative w-full" style={{ minHeight: loaded ? 'auto' : '300px' }}>
                    <Image
                        src={src}
                        alt={alt || ""}
                        width={1200}
                        height={1200}
                        sizes={sizes || "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
                        className="w-full h-auto object-contain transition-opacity duration-300"
                        style={{ opacity: loaded ? 1 : 0, minHeight: '300px' }}
                        priority={priority}
                        onLoad={handleLoad}
                        onError={handleError}
                        {...props}
                    />
                </div>
            ) : (
                <div className="flex items-center justify-center h-[300px] bg-gray-100 text-gray-500">
                    Image unavailable
                </div>
            )}
        </div>
    );
}
