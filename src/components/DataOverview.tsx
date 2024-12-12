import React from "react";
import { SampleData } from "api/types";
import axios from "axios";
import { useEffect, useState } from "react";
interface DataOverviewProps {
    //Get the issues from the SampleData type using results property
    //Issues : Array of Issues
    issues: SampleData["results"];
}

const calculateKeyData = (data: SampleData) => {
    //gets the results property and slices the first 100 results
    const results = data.results;

    //define object for each count
    const priorityCounts = { low: 0, normal: 0, high: 0 };
    const typeCounts = { question: 0, problem: 0, task: 0, incident: 0 };
    const statusCounts = {
        open: 0,
        closed: 0,
        hold: 0,
        pending: 0,
        solved: 0,
        new: 0,
    };
    const satisfactionCounts: { [key: string]: number } = {};

    results.forEach((issue) => {
        //increment the count for each priority, type, status and satisfaction rating
        priorityCounts[issue.priority]++;

        typeCounts[issue.type]++;

        statusCounts[issue.status]++;

        const rating = issue.satisfaction_rating.score;
        //if satisfaction rating exists increment the count, otherwise set it to 0
        satisfactionCounts[rating] = (satisfactionCounts[rating] || 0) + 1;
    });

    return {
        priorityCounts,
        typeCounts,
        statusCounts,
        satisfactionCounts,
    };
};

const DataOverview: React.FC<DataOverviewProps> = ({ issues }) => {
    //importing data straight into the component same as in Data.tsx
    const [data, setData] = useState<SampleData | undefined>(undefined);
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

    //uses the returns from the calculateKeyData function to define the counts
    const { priorityCounts, typeCounts, statusCounts, satisfactionCounts } =
        calculateKeyData(data);
    return (
        <>
            <div className="border p-4">
                <h2 className="text-2xl mb-4">Key Data Overview</h2>
                <div>
                    <h3 className="text-xl">Tickets by Priority</h3>
                    <ul>
                        {
                            //uses object entries to map over the priorityCounts object and return the priority and count
                            //Object.entries(priorityCounts) returns [['low', 0], ['normal', 0], ['high', 0]]
                            //map iterates over each key value pair then makes a list item with the priority and count
                            Object.entries(priorityCounts).map(
                                ([priority, count]) => (
                                    <li key={priority}>
                                        {priority}: {count}
                                    </li>
                                )
                            )
                        }
                    </ul>
                </div>

                <div>
                    <h3 className="text-xl">Tickets by Type</h3>
                    <ul>
                        {Object.entries(typeCounts).map(([type, count]) => (
                            <li key={type}>
                                {type}: {count}
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h3 className="text-xl">Tickets by Status</h3>
                    <ul>
                        {Object.entries(statusCounts).map(([status, count]) => (
                            <li key={status}>
                                {status}: {count}
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h3 className="text-xl">Tickets by Satisfaction Rating</h3>
                    <ul>
                        {Object.entries(satisfactionCounts).map(
                            ([rating, count]) => (
                                <li key={rating}>
                                    {rating}: {count}
                                </li>
                            )
                        )}
                    </ul>
                </div>
            </div>
        </>
    );
};

export default DataOverview;
