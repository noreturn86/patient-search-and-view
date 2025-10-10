import { useState, useEffect } from "react";
import axios from "axios";

export default function VisitSummary({ patient }) {
    return (
        <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-gray-200 text-gray-800">
                        <th className="p-2 border">Date</th>
                        <th className="p-2 border">Summary</th>
                    </tr>
                </thead>
                <tbody>
                    {patient?.encounters.map((encounter) => (
                        <tr className="hover:bg-gray-100">
                            <td className="p-2 border">{encounter.encounterDate}</td>
                            <td className="p-2 border">{encounter.summary}</td>
                        </tr>
                    ))}
                </tbody>
        </table>
    );
}