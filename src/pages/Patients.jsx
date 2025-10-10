import { useState, useEffect } from "react";
import axios from "axios";
import ChronicIssuePanel from "../components/ChronicIssuePanel";
import LabGraph from "../components/LabGraph";
import ConsultationSummary from "../components/ConsultationSummary";
import VisitSummary from "../components/VisitSummary";
import ImagingSummary from "../components/ImagingSummary";
import OtherTestSummary from "../components/OtherTestSummary";

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
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [patient, setPatient] = useState(null);
    const [allPrescriptions, setAllPrescriptions] = useState([]);
    const [medSearchTerm, setMedSearchTerm] = useState("");
    const [selectedTab, setSelectedTab] = useState('Visits');

    //////////
    //ids of patients with fake data, highlighted for demonstration purposes
    const exampleIds = [41, 44, 48, 59];
    const examplePatients = allPatients.filter((p) => exampleIds.includes(p.id));
    //////////


    useEffect(() => {
        axios
            .get("http://localhost:8080/patients")
            .then((response) => {
                setAllPatients(response.data);
            })
            .catch((error) => console.error("Error retrieving patient list:", error));

        axios
            .get("http://localhost:8080/prescription_sentences")
            .then((response) => {
                setAllPrescriptions(response.data);
            })
            .catch((error) => console.error("Error retrieving prescription sentences:", error));
    }, []);


    useEffect(() => {
        if (selectedPatient) {
            axios
                .get(`http://localhost:8080/patients/${selectedPatient.id}`)
                .then((response) => {
                    setPatient(response.data);
                })
                .catch((error) => console.error("Error retrieving data:", error));
        }
    }, [selectedPatient]);



    const filteredPatients = allPatients.filter((p) => {
        const fullName = `${p.firstName} ${p.lastName}`.toLowerCase();
        return fullName.includes(searchTerm.toLowerCase());
    });

    const filteredPrescriptions = allPrescriptions.filter(p => p.scriptText.toLowerCase().includes(medSearchTerm.toLowerCase()));

    const docSummaryTabs = ['Visits', 'Consultations', 'Imaging', 'Other results'];

    function handleAddMedication(sentence) {
        axios
            .post("http://localhost:8080/medications", {
                "patient": { "id": patient.id },
                "prescription": sentence
            })
            .then((response) => {
                setPatient((prev) => ({
                    ...prev,
                    medications: [...(prev.medications || []), response.data],
                }));

                setSearchTerm("");
            })
            .catch(error => {
                console.error("Error adding medication:", error);
            });
    }

    function handleRemoveMedication(medicationId) {
        axios
            .delete(`http://localhost:8080/medications/${medicationId}`)
            .then(() => {
                setPatient((prev) => ({
                    ...prev,
                    medications: prev.medications.filter((m) => m.id !== medicationId),
                }));
            })
            .catch((error) => {
                console.error("Error removing medication:", error);
            });
    }


    if (!patient) {
        return (
            //patient search
            <div className="w-full flex flex-col gap-4 items-center justify-center relative">
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
                                    onClick={() => setSelectedPatient(p)}
                                >
                                    {p.firstName} {p.lastName}
                                </li>
                            ))
                        ) : (
                            <li className="px-2 py-1 text-gray-500">No results</li>
                        )}
                    </ul>
                )}

                {exampleIds.length > 0 && (
                    <div className="w-2/3 border">
                        <h2 className="p-2">View an example patient:</h2>
                        {examplePatients.length > 0 && (
                            examplePatients.map((p) => (
                                <div 
                                    key={p.id}
                                    className="flex items-center justify-between border p-2 cursor-pointer hover:bg-yellow-200"
                                    onClick={() => setSelectedPatient(p)}
                                    >
                                    <p>{p.firstName} {p.lastName}</p>
                                    <p>{calculateAge(p.dob)} year old {p.sex.toLowerCase()}</p>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center w-full">
            {/*back to search button*/}
            <div className="sticky top-0 w-full bg-gray-300 border-b rounded jz-10 flex flex-col justify-start">
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

            {/*ai chart summary*/}
            <div className="w-full flex flex-col lg:flex-row gap-2 mt-2">
                <div className="flex-1 p-2 border rounded-lg bg-gray-50 shadow">
                    <h2 className="text-lg font-semibold mb-2">Patient Summary</h2>
                    <div className="text-gray-700">[Ai-generated patient summary]</div>
                </div>
            </div>

            {/*recent history and medication list*/}
            <div className="w-full flex flex-col lg:flex-row gap-2 mt-2">

                <div className="flex-3 p-2 border rounded-lg bg-gray-50 shadow">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                            {docSummaryTabs.map((tab) => (
                                <p 
                                    className={`border border-2 border-b-0 rounded-tl-2xl rounded-tr-2xl p-2 cursor-pointer ${selectedTab === tab ? "border-yellow-500" : "border-black-500"}`}
                                    onClick={() => setSelectedTab(tab)}>{tab}</p>
                            ))}
                        </div>

                        <p className="text-lg font-semibold">{selectedTab}</p>
                    </div>
                    

                    {selectedTab === "Visits" && (
                        <VisitSummary patient={patient} />
                    )}

                    {selectedTab === "Consultations" && (
                        <ConsultationSummary patient={patient} />
                    )}

                    {selectedTab === "Imaging" && (
                        <ImagingSummary patient={patient} />
                    )}

                    {selectedTab === "Other results" && (
                        <OtherTestSummary patient={patient} />
                    )}
                </div>
                
                <div className="flex-2 p-2 border rounded-lg bg-gray-50 shadow relative">
                    <div className="flex items-center space-x-2 mb-2">
                        <input
                        type="text"
                        onChange={(e) => setMedSearchTerm(e.target.value)}
                        placeholder="Search or add medication..."
                        className="flex-grow border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="flex flex-col border w-full rounded-lgj">
                        {patient.medications.map((med) => (
                            <div
                                key={med.id}
                                className="flex items-center justify-between border w-full p-1"
                            >
                                <p>{med.prescription}</p>
                                <button
                                    onClick={() => handleRemoveMedication(med.id)}
                                    className="w-6 h-6 flex items-center justify-center bg-red-500 text-white rounded-full hover:bg-red-600 font-bold text-lg shadow-sm"
                                    title="Remove medication"
                                    >
                                    &minus;
                                </button>
                            </div>
                        ))}
                    </div>

                    {medSearchTerm && (
                        <ul className="absolute top-10 w-full bg-white border rounded-lg shadow max-h-60 overflow-y-auto">
                            {filteredPrescriptions.length > 0 ? (
                                filteredPrescriptions.map((p) => (
                                    <li
                                        key={p.id}
                                        className="px-2 py-1 hover:bg-gray-100 cursor-pointer"
                                        onClick={() => {handleAddMedication(p.scriptText)}}
                                    >
                                        {p.scriptText}
                                    </li>
                                ))
                            ) : (
                                <li className="px-2 py-1 text-gray-500">No results</li>
                            )}
                        </ul>
                    )}
                </div>

            </div>

            {/*chronic issues*/}
            <div className="w-full flex flex-col lg:flex-row gap-2 border rounded-lg bg-gray-50 shadow mt-2">
                <ChronicIssuePanel conditions={patient?.chronicConditions || []} />
            </div>

            {/*lab results*/}
            <div className="w-full p-2 border rounded-lg bg-gray-50 shadow mt-2">
                <h2 className="text-lg font-semibold mb-2">Lab Results</h2>
                <div className="flex w-full border">
                    <LabGraph points={[{ x: "2025-02-20", y: 7.8}, { x: "2025-10-04", y: 6.7}, { x: "2025-7-01", y: 7.3 }]} xLabel="Date" yLabel="A1c (%)" />
                    <LabGraph points={[{ x: "2025-02-20", y: 7.8}, { x: "2025-10-04", y: 6.7}, { x: "2025-7-01", y: 7.3 }]} xLabel="Date" yLabel="A1c (%)" />
                    <LabGraph points={[{ x: "2025-02-20", y: 7.8}, { x: "2025-10-04", y: 6.7}, { x: "2025-7-01", y: 7.3 }]} xLabel="Date" yLabel="A1c (%)" />
                    <LabGraph points={[{ x: "2025-02-20", y: 7.8}, { x: "2025-10-04", y: 6.7}, { x: "2025-7-01", y: 7.3 }]} xLabel="Date" yLabel="A1c (%)" />
                </div>
            </div>

            {/*prevention and screening*/}
            <div className="w-full p-2 border rounded-lg bg-gray-50 shadow mt-2">
                <h2 className="text-lg font-semibold mb-2">Prevention and Screening</h2>
                <div className="text-gray-700">This module not shown in this demo.</div>
            </div>
        </div>
    );
}
