import {useEffect, useState} from "react";

const useSanity = (fn, slug) => {
    // Dla pojedynczych elementów zwracamy null, dla tablic []
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try{
            const response = await fn(slug ? slug : null);
            // Jeśli response jest undefined, zwracamy null (dla pojedynczych elementów)
            // Jeśli response jest tablicą, zwracamy ją (może być pusta)
            setData(response === undefined ? null : response);
        }catch (e){
            setError(e);
            setData(null);
        }finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [slug]); // Reaguje na zmiany slug

    return {data, loading, error};

};

export default useSanity;