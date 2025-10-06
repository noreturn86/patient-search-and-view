import { useState } from "react";

export default function ChronicIssuePanel({conditions}) {
    if (!conditions || conditions.length === 0) {
        return <div className="text-gray-500">No chronic conditions on file.</div>;
    }

    return (
        <div className="flex h-10">
            {conditions.map((c) => (
                <div key={c.id} className="flex flex-col items-center space-evenly w-80 border rounded">
                    <p className="text-lg font-semibold">{c.conditionName}</p>
                </div>
            ))}
        </div>
    );
}