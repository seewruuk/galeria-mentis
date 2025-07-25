import Image from "next/image";
import SearchIcon from "@/public/assets/SearchIcon.svg";

export default function ProductFilters({
                                           productOptions,
                                           filters,
                                           setFilters,
                                           searchQuery,
                                           setSearchQuery,
                                           priceRange,
                                           setPriceRange,
                                           productCategories,
                                           filterAndSortProducts,
                                           categoryFilters,
                                           setCategoryFilters,
                                           category
                                       }) {
    const handleFilterChange = (filterName, value) => {
        if(filterName === "productCategory") {
            filterAndSortProducts("productCategory")
        }
        setFilters((prev) => {
            const currentValues = prev[filterName] || [];
            if (currentValues.includes(value)) {
                return {
                    ...prev,
                    [filterName]: currentValues.filter((v) => v !== value),
                };
            } else {
                return {
                    ...prev,
                    [filterName]: [...currentValues, value],
                };
            }
        });

    };


    const handleCategoryChange = (categorySlug) => {
        setCategoryFilters
        ((prev) => ({
            ...prev,
            [categorySlug]: !prev[categorySlug],
        }));
        filterAndSortProducts("productCategory");
    }


    return (
        <div className="w-1/4 p-4 max-lg:w-full">
            <form
                className="w-full rounded-md border border-gray-300 flex gap-3 items-center px-[15px] py-[10px]"
            >
                <Image src={SearchIcon} alt="Search Icon" width={22} height={18} />
                <input
                    type="text"
                    placeholder="Search by name"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="outline-none focus:outline-none"
                />
            </form>

            <div className="mt-6">
                <h4 className="font-medium mb-2">Price</h4>
                <input
                    type="range"
                    min="0"
                    max="10000"
                    step="100"
                    value={priceRange}
                    onChange={(e) => setPriceRange(Number(e.target.value))}
                    className="w-full accent-[#AE8974] appearance-none bg-[#E7E0DC] h-2 rounded-full"
                />
                <p className="text-sm text-gray-500 mt-1">Up to {priceRange} £</p>
            </div>

            {productOptions?.map((option) => (
                <div key={option.name} className="mt-6">
                    <h4 className="font-medium mb-2">{option.name}</h4>
                    {option.options?.map((opt) => opt.value).map((value) => (
                        <div key={value} className="flex items-center py-[8px]">
                            <label className="flex items-center cursor-pointer relative">
                                <input
                                    type="checkbox"
                                    className="peer h-5 w-5 cursor-pointer transition-all appearance-none rounded-sm shadow bg-[#E7E0DC] checked:bg-[#E7E0DC]"
                                    checked={filters[option.name]?.includes(value) || false}
                                    onChange={() => handleFilterChange(option.name, value)}
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
                            <span className="ml-2 text-sm">{value}</span>
                        </div>
                    ))}
                </div>
            ))}

            {
                category === "all" ? (
                    <div className="mt-6">
                        <h4 className="font-medium mb-2">Medium</h4>
                        {
                            productCategories?.map((item, index) => {

                                    if(item.slug==="all") return ;

                                    return (
                                        <div key={index} className="flex items-center py-[8px]">
                                            <label className="flex items-center cursor-pointer relative">
                                                <input
                                                    type="checkbox"
                                                    className="peer h-5 w-5 cursor-pointer transition-all appearance-none rounded-sm shadow bg-[#E7E0DC] checked:bg-[#E7E0DC]"
                                                    checked={categoryFilters[item.slug] || false}
                                                    onChange={() => handleCategoryChange(item.slug)}
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
                                            <span className="ml-2 text-sm">{item.title}</span>
                                        </div>

                                    );
                                }
                            )
                        }
                    </div>
                ) : null
            }
        </div>
    );
}
