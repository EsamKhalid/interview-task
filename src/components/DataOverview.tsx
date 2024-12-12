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
    //gets the results property of the SampleData object
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

    //loop through each issue
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
        return (
            <div className="flex justify-center items-center h-64 text-gray-500">
                Loading data...
            </div>
        );
    }

    //uses the returns from the calculateKeyData function to define the counts
    const { priorityCounts, typeCounts, statusCounts, satisfactionCounts } =
        calculateKeyData(data);

    return (
        <div className="p-6 space-y-6">
            <h2 className="text-3xl font-bold text-center mb-8">
                Key Data Overview
            </h2>

            <div className="grid grid-cols-4 gap-6">
                <div className="bg-white shadow-md rounded-lg p-4 border">
                    <h3 className="text-xl font-semibold text-blue-600 mb-4">
                        Tickets by Priority
                    </h3>
                    <ul className="space-y-2">
                        {
                            //uses object entries to map over the priorityCounts object and return the priority and count
                            //Object.entries(priorityCounts) returns [['low', 0], ['normal', 0], ['high', 0]]
                            //map iterates over each key value pair then makes a list item with the priority and count
                            Object.entries(priorityCounts).map(
                                ([priority, count]) => (
                                    <li
                                        key={priority}
                                        className="flex justify-between"
                                    >
                                        <span className="capitalize">
                                            {priority}
                                        </span>
                                        <span className="font-bold">
                                            {count}
                                        </span>
                                    </li>
                                )
                            )
                        }
                    </ul>
                </div>

                <div className="bg-white shadow-md rounded-lg p-4 border">
                    <h3 className="text-xl font-semibold text-green-600 mb-4">
                        Tickets by Type
                    </h3>
                    <ul className="space-y-2">
                        {Object.entries(typeCounts).map(([type, count]) => (
                            <li key={type} className="flex justify-between">
                                <span className="capitalize">{type}</span>
                                <span className="font-bold">{count}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="bg-white shadow-md rounded-lg p-4 border">
                    <h3 className="text-xl font-semibold text-purple-600 mb-4">
                        Tickets by Status
                    </h3>
                    <ul className="space-y-2">
                        {Object.entries(statusCounts).map(([status, count]) => (
                            <li key={status} className="flex justify-between">
                                <span className="capitalize">{status}</span>
                                <span className="font-bold">{count}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="bg-white shadow-md rounded-lg p-4 ">
                    <h3 className="text-xl font-semibold text-yellow-600 mb-4">
                        Tickets by Satisfaction Rating
                    </h3>
                    <ul className="space-y-2">
                        {Object.entries(satisfactionCounts).map(
                            ([rating, count]) => (
                                <li
                                    key={rating}
                                    className="flex justify-between"
                                >
                                    <span>Satisfaction {rating}</span>
                                    <span className="font-bold">{count}</span>
                                </li>
                            )
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default DataOverview;
