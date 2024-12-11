import axios from "axios";
import { Request, Response } from "express";
import { SampleData } from "./types";
import { start } from "repl";
import { get } from "http";

const DATA_URL =
    "https://sampleapi.squaredup.com/integrations/v1/service-desk?datapoints=500";

const calculatePercentageTypes = (data: SampleData) => {
    const results = data.results;

    const issueTypes = ["question", "problem", "task"];

    const issueCounts: { type: string; percentage: number }[] = [];

    issueTypes.forEach((issueType) => {
        const count = results.filter(
            (issue) => issue.type === issueType
        ).length;
        const percentage = (count / results.length) * 100;
        issueCounts.push({
            type: issueType,
            percentage: percentage,
        });
    });

    return issueCounts;
};

const calculatePercentagePriority = (data: SampleData) => {
    const results = data.results;

    const priorityTypes = ["low", "normal", "high"];

    const priorityCounts: { type: string; percentage: number }[] = [];

    priorityTypes.forEach((priorityType) => {
        const count = results.filter(
            (issue) => issue.priority === priorityType
        ).length;
        const percentage = (count / results.length) * 100;
        priorityCounts.push({
            type: priorityType,
            percentage: percentage,
        });
    });

    return priorityCounts;
};

const calculateCloseTime = (issue: { created: string; updated: string }) => {
    const startDate = new Date(issue.created);
    const endDate = new Date(issue.updated);

    const average =
        (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);

    return average;
};

const calculateAverageTime = (data: SampleData) => {
    const results = data.results;

    var timeTotal = 0;
    const count = results.filter((issue) => issue.priority === "high").length;

    results.forEach((issue) => {
        const average = calculateCloseTime(issue);

        if (issue.priority === "high") {
            timeTotal += average;
        }
    });

    const averageTime = timeTotal / count;

    return averageTime;
};

const getScoreValue = (data: SampleData, averageTime: number) => {
    const scores: { score: string }[] = [];
    const results = data.results;

    results.forEach((issue) => {
        if (issue.priority === "high") {
            if (calculateCloseTime(issue) > averageTime) {
                scores.push(issue.satisfaction_rating);
            }
        }
    });

    return scores;
};

export const GET = async (req: Request, res: Response) => {
    const { data } = await axios.get<SampleData>(DATA_URL);

    const results = data.results;

    res.status(200).json(calculateAverageTime(data));
};
