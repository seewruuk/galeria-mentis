/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true, // Włączone dla lepszego development experience i wykrywania problemów
    images: {
        remotePatterns: [
            {protocol: 'https', hostname: 'cdn.sanity.io'},
        ],
        formats: ['image/avif', 'image/webp'], // Nowoczesne formaty obrazów
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
        minimumCacheTTL: 60, // Cache obrazów przez 60 sekund
        dangerouslyAllowSVG: false, // Bezpieczeństwo - nie pozwalaj na SVG z zewnętrznych źródeł
        contentDispositionType: 'attachment',
        contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    },
    // Optymalizacja kompresji
    compress: true,
    // Optymalizacja bundle size
    swcMinify: true,
    // Optymalizacja eksperymentalna (Next.js 15)
    experimental: {
        optimizePackageImports: ['framer-motion', 'lucide-react', 'react-icons'],
    },
};

export default nextConfig;
