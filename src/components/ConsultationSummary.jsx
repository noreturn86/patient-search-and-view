import { useState, useEffect } from "react";
import axios from "axios";


export default function ConsultationSummary({ patient }) {
    return (
        <table className="w-full text-left border-collapse">
            <thead>
                <tr className="bg-gray-200 text-gray-800">
                    <th className="p-2 border">Specialist</th>
                    <th className="p-2 border">Last Visit</th>
                    <th className="p-2 border">Summary</th>
                </tr>
            </thead>
            <tbody>

                {patient?.consultantLetters.map((letter) => (
                    <tr className="hover:bg-gray-100">
                        <td className="p-2 border">{letter.specialistType}</td>
                        <td className="p-2 border">{letter.letterDate}</td>
                        <td className="p-2 border">{letter.summary}</td>
                    </tr>
                ))}

            </tbody>
        </table>
    );
}