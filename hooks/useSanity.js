import {useEffect, useState} from "react";

const useSanity = (fn, slug) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        try{
            const response = await fn(slug ? slug : null);
            setData(response);
        }catch (e){
            setError(e);
        }finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchData();
    }, []);

    return {data, loading, error};

};

export default useSanity;