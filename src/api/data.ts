import axios from "axios";
import { Request, Response } from "express";
import { SampleData } from "./types";
import { start } from "repl";
import { get } from "http";

const DATA_URL =
    "https://sampleapi.squaredup.com/integrations/v1/service-desk?datapoints=100";

const calculatePercentageTypes = (data: SampleData) => {
    //makes an array of issues based on the results property from SampleData
    const results = data.results;

    //define issue types
    const issueTypes = ["question", "problem", "task"];

    //define array to store the type and percentage of each issue
    const issueCounts: { type: string; percentage: number }[] = [];

    //loop through each issueType
    issueTypes.forEach((issueType) => {
        //filter the issues based on the issue type and get the length of the array
        const count = results.filter(
            (issue) => issue.type === issueType
        ).length;
        //divide the count by the total number of issues and multiply by 100 to get the percentage
        const percentage = (count / results.length) * 100;
        issueCounts.push({
            type: issueType,
            percentage: Number(percentage.toFixed(2)),
        });
    });

    //return the array of issue types and their percentage
    return issueCounts;
};

const calculatePercentagePriority = (data: SampleData) => {
    //makes an array of issues based on the results property from SampleData
    const results = data.results;

    //define priority types
    const priorityTypes = ["low", "normal", "high"];

    //define array to store the priority and percentage of each issue
    const priorityCounts: { type: string; percentage: number }[] = [];

    //loop through each priority
    priorityTypes.forEach((priorityType) => {
        //filter the issues based on the priority type and get the length of the array
        const count = results.filter(
            (issue) => issue.priority === priorityType
        ).length;
        //divide the count by the total number of issues and multiply by 100 to get the percentage
        const percentage = (count / results.length) * 100;
        priorityCounts.push({
            type: priorityType,
            percentage: Number(percentage.toFixed(2)),
        });
    });

    //return the array of priority types and their percentage
    return priorityCounts;
};

const calculateCloseTime = (issue: { created: string; updated: string }) => {
    //convert the created and updated date to a date object
    const startDate = new Date(issue.created);
    const endDate = new Date(issue.updated);

    //calculate the close time in hours
    const closeTime =
        (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);

    //return the close time
    return closeTime;
};

const calculateAverageTime = (data: SampleData) => {
    //makes an array of issues based on the results property from SampleData
    const results = data.results;

    var timeTotal = 0;
    //get the number of high priority issues
    const count = results.filter((issue) => issue.priority === "high").length;

    //loop through each issue
    results.forEach((issue) => {
        //calculate the close time for the issue
        const closingTime = calculateCloseTime(issue);

        //if the issue is high priority add the closing time to the total time
        if (issue.priority === "high") {
            timeTotal += closingTime;
        }
    });

    //divide the total time by the number of high priority issues to get the average time
    const averageTime = timeTotal / count;

    //return the average time
    return Number(averageTime.toFixed(2));
};

const getScoreValue = (data: SampleData, averageTime: number) => {
    //makes an array of issues based on the results property from SampleData
    const results = data.results;

    //create an array to store the satisfaction rating of each issue
    const scores: { score: string }[] = [];

    //loop through each issue
    results.forEach((issue) => {
        //if the issue is high priority and the close time is greater than the average time
        if (
            issue.priority === "high" &&
            calculateCloseTime(issue) > averageTime
        ) {
            //add the satisfaction rating to the array
            scores.push(issue.satisfaction_rating);
        }
    });

    //return the array of satisfaction ratings
    return scores;
};

export const GET = async (req: Request, res: Response) => {
    const { data } = await axios.get<SampleData>(DATA_URL);

    res.send(data);
    //res.status(200).json(getScoreValue(data, calculateAverageTime(data)));
    //res.status(200).json(calculatePercentageTypes(data));
    //res.status(200).json(calculatePercentagePriority(data));
    //res.status(200).json(calculateAverageTime(data) + " hours");
};
