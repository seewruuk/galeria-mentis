"use client"
import { motion, AnimatePresence } from "framer-motion";
import ArtistCard from "@/components/ArtistCard";
import ArtistArtworks from "@/components/ArtistArtworks";

// Animation variants for container and items
const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, scale: 0.95, y: -20, transition: { duration: 0.2 } },
};

export default function ArtistsList({ artists, artworksLimit = 3 }) {
    return (
        <motion.div
            className="w-full relative flex flex-col gap-[250px]"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <AnimatePresence mode="popLayout">
                {artists.length > 0 ? (
                    artists.map((artist) => (
                        <motion.div
                            key={artist.slug}
                            layout
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            variants={itemVariants}
                            className="flex gap-5 max-lg:flex-col max-lg:items-center"
                        >
                            <ArtistCard
                                avatar={artist.avatar}
                                artistLink={artist.slug}
                                artistName={artist.name}
                                location={artist.location}
                                description={artist.description}
                            />
                            <div className="lg:flex-grow w-full">
                                <ArtistArtworks artistId={artist._id} limit={artworksLimit} />
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center justify-center h-[400px] text-center size-full"
                    >
                        <h2 className="text-xl font-semibold mb-4">No Artist found</h2>
                        <p className="text-gray-500">Try adjusting your filters or search criteria.</p>

                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}