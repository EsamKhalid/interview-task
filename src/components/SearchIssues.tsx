import React from "react";
import { SampleData } from "api/types";
import { useState } from "react";
interface SearchIssuesProps {
    //Get the issues from the SampleData type using results property
    //Issues : Array of Issues
    issues: SampleData["results"];
}

const SearchIssues: React.FC<SearchIssuesProps> = ({ issues }) => {
    //uses the useState o create a searchTerm variable and setSearchTerm function to update
    const [searchTerm, setSearchTerm] = useState("");

    //Array filtered issues is created by filtering the issues array by the organization_id
    const filteredIssues = issues.filter((issue) =>
        issue.organization_id.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return (
        <>
            <div className="border p-3">
                <h2 className="text-2xl mb-4">Issue List</h2>
                <input
                    type="text"
                    placeholder="Search by organization_id"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border border-black p-3 mb-5 w-full"
                />
                <table className="table-auto w-full border-collapse">
                    <thead>
                        <tr className="[&>*]:border [&>*]:border-black">
                            <th>ID</th>
                            <th>Type</th>
                            <th>Priority</th>
                            <th>Organisation ID</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredIssues.map((issue) => (
                            <tr
                                key={issue.id}
                                className="[&>*]:border [&>*]:border-black [&>*]:p-[5px]"
                            >
                                <td>{issue.id}</td>
                                <td>{issue.type}</td>
                                <td
                                    className={
                                        issue.priority === "high"
                                            ? "bg-red-500"
                                            : issue.priority === "normal"
                                            ? "bg-yellow-400"
                                            : "bg-green-500"
                                    }
                                >
                                    {issue.priority}
                                </td>
                                <td>{issue.organization_id}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default SearchIssues;
