import ChronicIssuePanel from "../components/ChronicIssuePanel";
import { useState, useEffect } from "react";
import axios from "axios";

// get current age from dob
function calculateAge(dobString) {
    const dob = new Date(dobString);
    const today = new Date();

    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    const dayDiff = today.getDate() - dob.getDate();

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        age--;
    }
    return age;
}

export default function Patients() {
    const [allPatients, setAllPatients] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [patient, setPatient] = useState(null);

    useEffect(() => {
        axios
            .get("http://localhost:8080/patients")
            .then((response) => {
                setAllPatients(response.data);
            })
            .catch((error) => console.error("Error retrieving data:", error));
    }, []);

    const filteredPatients = allPatients.filter((p) => {
        const fullName = `${p.firstName} ${p.lastName}`.toLowerCase();
        return fullName.includes(searchTerm.toLowerCase());
    });

    if (!patient) {
        return (
            <div className="w-full flex flex-col gap-2 items-center justify-center relative">
                <h2>Search patients by name:</h2>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-1/2 border px-2 py-1"
                    placeholder="Type a name..."
                />

                {searchTerm && (
                    <ul className="absolute top-20 w-1/2 bg-white border rounded-lg shadow max-h-60 overflow-y-auto">
                        {filteredPatients.length > 0 ? (
                            filteredPatients.map((p) => (
                                <li
                                    key={p.id}
                                    className="px-2 py-1 hover:bg-gray-100 cursor-pointer"
                                    onClick={() => setPatient(p)}
                                >
                                    {p.firstName} {p.lastName}
                                </li>
                            ))
                        ) : (
                            <li className="px-2 py-1 text-gray-500">No results</li>
                        )}
                    </ul>
                )}
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center w-full">
            {/*back to search button*/}
            <div className="sticky top-0 w-full bg-white z-10 flex flex-col justify-start">
                <button
                    onClick={() => {
                        setPatient(null);
                        setSearchTerm('');
                    }}
                    className="w-auto px-3 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-500 cursor-pointer"
                >
                    ← Back
                </button>

                {/*ids/contacts*/}
                <div className="w-full flex flex-col lg:flex-row items-start justify-between text-lg font-semibold p-2 border rounded mt-2 gap-2">
                    <div>
                        {patient.firstName} {patient.lastName}
                    </div>
                    <div>
                        DOB: {patient.dob} ({calculateAge(patient.dob)}) {patient.sex}
                    </div>
                    <div>HCN: {patient.healthCardNumber}</div>
                    <div>Email: {patient.email}</div>
                    <div>Phone: {patient.phoneNumber}</div>
                </div>
            </div>

            {/*ai chart summary and medication list*/}
            <div className="w-full flex flex-col lg:flex-row gap-2 mt-2">
                <div className="flex-1 p-2 border rounded-lg bg-gray-50 shadow">
                    <h2 className="text-lg font-semibold mb-2">Patient Summary</h2>
                    <div className="text-gray-700">[Ai-generated patient summary]</div>
                </div>
                <div className="flex-1 p-2 border rounded-lg bg-gray-50 shadow">
                    <h2 className="text-lg font-semibold mb-2">Medications</h2>
                    <div className="text-gray-700">[Medications list]</div>
                </div>
            </div>

            {/*recent history*/}
            <div className="w-full flex flex-col lg:flex-row gap-2 mt-2">
                <div className="flex-1 p-2 border rounded-lg bg-gray-50 shadow">
                    <h2 className="text-lg font-semibold mb-2">Recent Issues</h2>
                    <div className="text-gray-700">[Ai-generated list of of recent issues]</div>
                </div>
                <div className="flex-1 p-2 border rounded-lg bg-gray-50 shadow">
                    <h2 className="text-lg font-semibold mb-2">Visit History</h2>
                    <div className="text-gray-700">[List of visits with date and summary]</div>
                </div>
            </div>

            {/*chronic issues*/}
            <div className="w-full flex flex-col lg:flex-row gap-2 p-1 border rounded-lg bg-gray-50 shadow mt-2">
                <ChronicIssuePanel />
                <ChronicIssuePanel />
            </div>

            {/*test results*/}
            <div className="w-full p-2 border rounded-lg bg-gray-50 shadow mt-2">
                <h2 className="text-lg font-semibold mb-2">Test Results</h2>
                <div className="text-gray-700">[Test results]</div>
            </div>

            {/*consultations*/}
            <div className="w-full p-2 border rounded-lg bg-gray-50 shadow mt-2">
                <h2 className="text-lg font-semibold mb-2">Consultations</h2>
                <div className="text-gray-700">[Communications with consultants]</div>
            </div>

            {/*prevention and screening*/}
            <div className="w-full p-2 border rounded-lg bg-gray-50 shadow mt-2">
                <h2 className="text-lg font-semibold mb-2">Prevention and Screening</h2>
                <div className="text-gray-700">[Summary and list of recommendations]</div>
            </div>
        </div>
    );
}
