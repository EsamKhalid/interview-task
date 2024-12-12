import { SampleData } from "api/types";
import axios from "axios";
import { useEffect, useState } from "react";

import IssuesByPriority from "./IssuesByPriority";
import FilterByPriority from "./FilterByPriority";
import SearchIssues from "./SearchIssues";
import DataOverview from "./DataOverView";

function Data() {
    const [data, setData] = useState<SampleData | undefined>(undefined);

    //create a usesState to store the selected component, default value is issues by priority
    const [selectedComponent, setSelectedComponent] =
        useState<string>("IssuesByPriority");

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

    //handle the change of the component
    const handleComponentChange = (
        //the event is a change event on a select element
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        //uses the set function in the useState to update the selectedComponent
        setSelectedComponent(event.target.value);
    };

    return (
        <div className="border p-4">
            <div className="mb-4">
                <select
                    id="component-select"
                    className="p-2 border rounded"
                    //calls the event handler when this select element changes
                    onChange={handleComponentChange}
                    value={selectedComponent}
                >
                    <option value="IssuesByPriority">Issues By Priority</option>
                    <option value="FilterByPriority">Filter By Priority</option>
                    <option value="SearchIssues">Search Issues</option>
                    <option value="DataOverview">Data Overview</option>
                    <option value="BackendData">Backend Data</option>
                </select>
            </div>
            {selectedComponent === "IssuesByPriority" && (
                <IssuesByPriority issues={data.results} />
            )}
            {selectedComponent === "FilterByPriority" && (
                <FilterByPriority issues={data.results} />
            )}
            {selectedComponent === "SearchIssues" && (
                <SearchIssues issues={data.results} />
            )}
            {selectedComponent === "DataOverview" && (
                <DataOverview issues={data.results} />
            )}
            {selectedComponent === "BackendData" && (
                <pre className="text-sm">{JSON.stringify(data, null, 2)}</pre>
            )}
        </div>
    );
}

export default Data;
