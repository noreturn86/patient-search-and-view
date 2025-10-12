import { useState, useEffect } from "react";
import axios from "axios";
import LabGraph from "../components/LabGraph";

export default function LabResultsPanel({ patient }) {

    function getLabGraphInfo(testType, units){
        const results = (patient.labResults ?? []).filter(r => (r.testType === testType) && (r.units === units));
        return results.map(r => ({x: r.testDate, y: parseFloat(r.resultValue)}));
    }

    function getExamGraphInfo(testType, units){
        const results = (patient.examData ?? []).filter(r => (r.dataType === "Weight") && (r.units === "kg"));
        return results.map(r => ({x: r.date, y: parseFloat(r.value)}));
    }

    return (
        <div className="w-full p-2 border rounded-lg bg-gray-50 shadow mt-2">
            <h2 className="text-lg font-semibold mb-2">Lab Results</h2>
            <div className="flex w-full border">
                <LabGraph points={getLabGraphInfo("A1c", "%")} xLabel="Date" yLabel="A1c(%)" />
                <LabGraph points={getExamGraphInfo("Weight", "kg")} xLabel="Date" yLabel="Weight(kg)" />
            </div>
        </div>
    );
}