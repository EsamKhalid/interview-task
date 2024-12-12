import { SampleData } from "api/types";
import axios from "axios";
import { useEffect, useState } from "react";

import IssuesByPriority from "./IssuesByPriority";
import FilterByPriority from "./FilterByPriority";

function Data() {
    const [data, setData] = useState<SampleData | undefined>(undefined);

    console.log(data);

    /**
     * Gets the data.
     * Hint: consider using the react-query library that is ready to go!
     * */
    useEffect(() => {
        let mounted = true;

        const fetchData = async () => {
            const { data: allData } = await axios.get<SampleData>("/api/data");

            if (mounted) {
                setData(allData);
            }
        };

        fetchData();

        return () => {
            mounted = false;
        };
    }, []);

    if (!data) {
        return "loading data...";
    }

    return (
        <div className="border p-4">
            {/* <pre className="text-sm">{JSON.stringify(data, null, 2)}</pre> */}
            {/* <IssuesByPriority issues={data.results} /> */}
            <FilterByPriority issues={data.results} />
        </div>
    );
}

export default Data;
