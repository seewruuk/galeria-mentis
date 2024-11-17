export default function Pagination({ totalItems, itemsPerPage, currentPage, setCurrentPage }) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    return (
        <div className="flex justify-center mt-8">
            {Array.from({ length: totalPages }, (_, i) => (
                <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`mx-1 px-3 py-1 border rounded-md ${
                        currentPage === i + 1 ? "bg-primary text-white" : "bg-white"
                    }`}
                >
                    {i + 1}
                </button>
            ))}
        </div>
    );
}
