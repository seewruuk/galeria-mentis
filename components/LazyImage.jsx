import { useState } from "react";

export default function LazyImage({
                                      src,
                                      alt,
                                      className = "",
                                      style = {},
                                      ...props
                                  }) {
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(false);

    return (
        <div className={`relative overflow-hidden ${className}`} style={style}>
            {/* Skeleton placeholder */}
            {!loaded && !error && (
                <div className="absolute inset-0 animate-pulse bg-gray-200" />
            )}

            {/* Główny obrazek (pojawia się płynnie) */}
            {!error ? (
                <img
                    src={src}
                    alt={alt}
                    className="w-full h-auto object-cover"
                    onLoad={() => setLoaded(true)}
                    onError={() => setError(true)}
                    {...props}
                />
            ) : (
                // Fallback, gdy obrazek nie może się załadować
                <div className="flex items-center justify-center h-[250px] bg-gray-100 text-gray-500">
                    Obraz niedostępny
                </div>
            )}
        </div>
    );
}
