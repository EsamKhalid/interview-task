import axios from "axios";
import { Request, Response } from "express";
import { SampleData } from "./types";
import { start } from "repl";

const DATA_URL =
    "https://sampleapi.squaredup.com/integrations/v1/service-desk?datapoints=500";

const calculatePercentageTypes = (data: SampleData, type: string) => {
    const results = data.results;

    const count = results.filter((issue) => issue.type === type).length;

    const percentage = count / results.length;

    return percentage * 100;
};

const calculatePercentagePriority = (data: SampleData, priority: string) => {
    const results = data.results;

    const count = results.filter((issue) => issue.priority === priority).length;

    const percentage = count / results.length;

    return percentage * 100;
};

const calculateCloseTime = (startDate: Date, endDate: Date) => {
    const average =
        (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);

    return average;
};

export const GET = async (req: Request, res: Response) => {
    const { data } = await axios.get<SampleData>(DATA_URL);

    const results = data.results;

    const issueTypes = ["question", "problem", "task"];

    const issueCounts: { type: string; percentage: number }[] = [];

    issueTypes.forEach((issueType) => {
        const percentage = calculatePercentageTypes(data, issueType);
        issueCounts.push({
            type: issueType,
            percentage: percentage,
        });

        //res.status(200).json(calculatePercentage(data, issueType));
    });

    const priorityTypes = ["low", "normal", "high"];

    const priorityCounts: { type: string; percentage: number }[] = [];

    const averageCounts: { priority: string; average: number }[] = [];

    priorityTypes.forEach((priorityType) => {
        const percentage = calculatePercentagePriority(data, priorityType);
        priorityCounts.push({
            type: priorityType,
            percentage: percentage,
        });

        //res.status(200).json(calculatePercentage(data, issueType));
    });

    var timeTotal = 0;
    const count = results.filter((issue) => issue.priority === "high").length;

    results.forEach((issue) => {
        const startDate = new Date(issue.created);
        const endDate = new Date(issue.updated);

        const average = calculateCloseTime(startDate, endDate);

        if (issue.priority === "high") {
            averageCounts.push({ priority: issue.priority, average: average });
            timeTotal += average;
        }
    });

    //res.status(200).json(averageCounts);

    const averageTime = timeTotal / count;
    res.status(200).json(timeTotal / count);

    //res.status(200).json(priorityCounts);

    // const averageCounts: { priority: string; average: number }[] = [];

    // results.forEach((issue) => {
    //     const startDate = new Date(issue.created);
    //     const endDate = new Date(issue.updated);

    //     const average =
    //         (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);

    //     averageCounts.push({ priority: issue.priority, average: average });
    // });

    //res.status(200).json(averageCounts);

    //res.send(data);
};
