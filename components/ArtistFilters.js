import SearchIcon from "@/public/assets/SearchIcon.svg";
import Image from "next/image";

export default function ArtistFilters({
                                    searchQuery,
                                    setSearchQuery,
                                    artisticStyles,
                                    selectedArtisticStyles,
                                    setSelectedArtisticStyles,
                                    paintingStyles,
                                    selectedPaintingStyles,
                                    setSelectedPaintingStyles,
                                }) {
    const handleCheckboxChange = (value, stateSetter, currentState) => {
        if (currentState.includes(value)) {
            stateSetter(currentState.filter((item) => item !== value));
        } else {
            stateSetter([...currentState, value]);
        }
    };

    return (
        <div className="w-1/4 p-4 max-lg:w-full">
            {/* Search Field */}
            <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Search Artists</h3>
                <form className="w-full rounded-md border border-gray-300 flex gap-3 items-center px-[15px] py-[10px]">
                    <Image src={SearchIcon} alt="Search Icon" width={22} height={18} />
                    <input
                        type="text"
                        placeholder="Search by name"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="outline-none focus:outline-none"
                    />
                </form>
            </div>

            {/* Artistic Styles */}
            <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Artistic Style</h3>
                {artisticStyles.map((style) => (
                    <div key={style.title} className="flex items-center py-[8px]">
                        <label className="flex items-center cursor-pointer relative">
                            <input
                                type="checkbox"
                                className="peer h-5 w-5 cursor-pointer transition-all appearance-none rounded-sm shadow bg-[#E7E0DC] checked:bg-[#E7E0DC]"
                                checked={selectedArtisticStyles.includes(style.title)}
                                onChange={() =>
                                    handleCheckboxChange(style.title, setSelectedArtisticStyles, selectedArtisticStyles)
                                }
                            />
                            <span className="absolute text-[#AE8974] opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3.5 w-3.5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    stroke="currentColor"
                    strokeWidth="1"
                >
                  <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                  ></path>
                </svg>
              </span>
                        </label>
                        <span className="ml-2 text-sm">{style.title}</span>
                    </div>
                ))}
            </div>

            {/* Painting Styles */}
            <div>
                <h3 className="text-lg font-medium mb-2">Painting Styles</h3>
                {paintingStyles.map((style) => (
                    <div key={style.title} className="flex items-center py-[8px]">
                        <label className="flex items-center cursor-pointer relative">
                            <input
                                type="checkbox"
                                className="peer h-5 w-5 cursor-pointer transition-all appearance-none rounded-sm shadow bg-[#E7E0DC] checked:bg-[#E7E0DC]"
                                checked={selectedPaintingStyles.includes(style.title)}
                                onChange={() =>
                                    handleCheckboxChange(style.title, setSelectedPaintingStyles, selectedPaintingStyles)
                                }
                            />
                            <span className="absolute text-[#AE8974] opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3.5 w-3.5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    stroke="currentColor"
                    strokeWidth="1"
                >
                  <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                  ></path>
                </svg>
              </span>
                        </label>
                        <span className="ml-2 text-sm">{style.title}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
