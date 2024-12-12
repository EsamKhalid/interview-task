import React from "react";
import { SampleData } from "api/types";

interface IssuesByPriorityProps {
    //Get the issues from the SampleData type using results property
    //Issues : Array of Issues
    issues: SampleData["results"];
}

//Give each priority a value to sort by
const priorityOrder = {
    low: 1,
    normal: 2,
    high: 3,
};

const IssuesByPriority: React.FC<IssuesByPriorityProps> = ({ issues }) => {
    //creates a new sorted array called sorted issues and uses js sort method to sort the issues by priority
    const sortedIssues = issues.slice(0, 100).sort((a, b) => {
        return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
    return (
        <>
            <div className="border p-3">
                <h2 className="text-2xl mb-4">Issue List</h2>
                <table className="table-auto w-full border-collapse">
                    <thead>
                        <tr className="[&>*]:border [&>*]:border-black">
                            <th>ID</th>
                            <th>Type</th>
                            <th>Priority</th>
                            <th>Status</th>
                            <th>Subject</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedIssues.map((issue) => (
                            <tr
                                key={issue.id}
                                className="[&>*]:border [&>*]:border-black [&>*]:p-[5px]"
                            >
                                <td>{issue.id}</td>
                                <td>{issue.type}</td>
                                <td>{issue.priority}</td>
                                <td>{issue.status}</td>
                                <td>{issue.subject}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default IssuesByPriority;
