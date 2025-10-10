import { useState, useEffect } from "react";
import axios from "axios";

export default function ImagingSummary({ patient }) {
    return (
        <table className="min-w-full border-collapse">
            <thead>
                <tr className="bg-gray-200">
                    <th className="border px-4 py-2 text-left">Date</th>
                    <th className="border px-4 py-2 text-left">Test Type</th>
                    <th className="border px-4 py-2 text-left">Result Summary</th>
                </tr>
            </thead>
            <tbody>
                {/* Data rows will be added here later */}
            </tbody>
        </table>
    );
}