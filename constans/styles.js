const buttonStyles = "px-4 py-1 rounded-full";
const activeButtonStyles = "bg-black text-white";
const inactiveButtonStyles = "bg-white-100 dark:bg-gray";

const statuses = {
    done: 'text-green-700 bg-green-50 ring-green-600/20 dark:text-green-300 dark:bg-green-900/20',
    new: 'text-gray-600 bg-gray-50 ring-gray-500/10 dark:text-gray-300',
    paid: 'text-yellow-800 bg-yellow-50 ring-yellow-600/20',
    cancelled: 'text-red-700 bg-red-50 ring-red-600/20',
};

export { buttonStyles, activeButtonStyles, inactiveButtonStyles, statuses };