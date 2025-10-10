import { useState, useEffect } from "react";
import axios from "axios";

export default function ImagingSummary({ patient }) {
    return (
        <table className="min-w-full border-collapse">
            <thead>
                <tr className="bg-gray-200">
                    <th className="border p-2 text-left">Date</th>
                    <th className="border p-2 text-left">Test Type</th>
                    <th className="border p-2 text-left">Result Summary</th>
                </tr>
            </thead>
            <tbody>
                {patient?.imagingReports.map((report) => (
                    <tr className="hover:bg-gray-100">
                        <td className="p-2 border">{report.date}</td>
                        <td className="p-2 border">{report.testType}</td>
                        <td className="p-2 border">{report.resultSummary}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}