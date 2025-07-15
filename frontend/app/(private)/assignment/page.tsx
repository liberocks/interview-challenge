'use client';

import { useState, useEffect } from 'react';
import moment from 'moment';

import { Async } from '@/components/async';
import Spin from '@/components/spin';
import assignmentApi, { AssignmentEntity } from '@/api/assignment';
import ShowIf from '@/components/show-if';
import patientApi, { PatientEntity } from '@/api/patient';
import medicationApi, { MedicationEntity } from '@/api/medication';

export default function Home() {
  const [patients, setPatients] = useState<AssignmentEntity[]>([]);

  // Fields for creating a new assignment
  const [patientId, setPatientId] = useState('');
  const [autoCompletePatients, setAutoCompletePatients] = useState<
    PatientEntity[]
  >([]);
  const [medicationId, setMedicationId] = useState('');
  const [autoCompleteMedications, setAutoCompleteMedications] = useState<
    MedicationEntity[]
  >([]);
  const [startDate, setStartDate] = useState('');
  const [numberOfDays, setNumberOfDays] = useState(1);

  // Pagination state
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // UX state
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [patientSearchTerm, setPatientSearchTerm] = useState('');
  const [medicationSearchTerm, setMedicationSearchTerm] = useState('');
  const [selectedPatientName, setSelectedPatientName] = useState('');
  const [selectedMedicationName, setSelectedMedicationName] = useState('');

  const searchPatients = async (query: string) => {
    if (!query.trim()) {
      setAutoCompletePatients([]);
      return;
    }

    try {
      const res = await patientApi.getPatients({ name: query, limit });
      setAutoCompletePatients(res.items || []);
    } catch (error) {
      console.error('Failed to search patients:', error);
      setAutoCompletePatients([]);
    }
  };

  const searchMedications = async (query: string) => {
    if (!query.trim()) {
      setAutoCompleteMedications([]);
      return;
    }

    try {
      const res = await medicationApi.getMedications({ name: query, limit });
      setAutoCompleteMedications(res.items || []);
    } catch (error) {
      console.error('Failed to search medications:', error);
      setAutoCompleteMedications([]);
    }
  };

  const fetchAssignments = async (page: number = 1) => {
    setIsLoading(true);

    try {
      const res = await assignmentApi.getAssigments({ page, limit });

      setPatients(res.items || []);
      setTotal(res.total || 0);
      setPage(page);
    } catch (error) {
      console.error('Failed to fetch assignments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createAssignment = async () => {
    if (
      !patientId.trim() ||
      !medicationId.trim() ||
      !startDate.trim() ||
      !numberOfDays
    )
      return;
    await assignmentApi.createAssignment({
      patientId,
      medicationId,
      startDate: moment(startDate).toDate(),
      numberOfDays,
    });

    setPatientId('');
    setMedicationId('');
    setStartDate('');
    setNumberOfDays(1);
    setShowCreateForm(false);
    setAutoCompletePatients([]);
    setAutoCompleteMedications([]);
    setPatientSearchTerm('');
    setMedicationSearchTerm('');
    setSelectedPatientName('');
    setSelectedMedicationName('');
    fetchAssignments();
  };

  // Debounce the search to avoid too many API calls
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (patientSearchTerm.trim()) {
        searchPatients(patientSearchTerm);
      } else {
        setAutoCompletePatients([]);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [patientSearchTerm]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (medicationSearchTerm.trim()) {
        searchMedications(medicationSearchTerm);
      } else {
        setAutoCompleteMedications([]);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [medicationSearchTerm]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.autocomplete-container')) {
        setAutoCompletePatients([]);
        setAutoCompleteMedications([]);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <Async request={fetchAssignments} skeleton={<Spin />}>
      <div className="p-8 font-sans">
        <div className="flex justify-between items-center mb-5">
          <h1 className="text-2xl font-bold">Assignments</h1>

          <ShowIf condition={!showCreateForm}>
            <button
              type="button"
              onClick={() => setShowCreateForm(true)}
              className="bg-teal-600 text-white px-4 py-1 rounded"
            >
              Add Assignment
            </button>
          </ShowIf>
          <ShowIf condition={showCreateForm}>
            <button
              type="button"
              onClick={() => {
                setShowCreateForm(false);
                setAutoCompletePatients([]);
                setAutoCompleteMedications([]);
                setPatientSearchTerm('');
                setMedicationSearchTerm('');
                setSelectedPatientName('');
                setSelectedMedicationName('');
              }}
              className="bg-rose-600 text-white px-4 py-1 rounded"
            >
              Cancel
            </button>
          </ShowIf>
        </div>

        <ShowIf condition={showCreateForm}>
          <div className="flex-col flex gap-5 mb-4 p-4 border rounded-lg bg-gray-100 border-gray-400">
            <div className="flex gap-2 items-center">
              <label className="block min-w-48" htmlFor="patientId">
                Patient
              </label>
              <div className="relative flex-1 autocomplete-container">
                <input
                  className="border px-2 py-1 rounded w-full"
                  placeholder="Search patients..."
                  value={selectedPatientName || patientId}
                  onChange={(e) => {
                    const value = e.target.value;
                    setPatientId(value);
                    setSelectedPatientName('');
                    setPatientSearchTerm(value);
                  }}
                  onFocus={() => {
                    if (patientId.trim()) {
                      setPatientSearchTerm(patientId);
                    }
                  }}
                />
                <ShowIf condition={autoCompletePatients.length > 0}>
                  <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-b-md max-h-48 overflow-y-auto z-10 shadow-lg">
                    {autoCompletePatients.map((patient) => (
                      <button
                        key={patient.id}
                        type="button"
                        className="w-full px-4 py-2 text-left hover:bg-gray-100 border-b border-b-gray-400 last:border-b-0"
                        onClick={() => {
                          setPatientId(patient.id);
                          setSelectedPatientName(patient.name);
                          setAutoCompletePatients([]);
                        }}
                      >
                        <div className="font-medium">{patient.name}</div>
                        <div className="text-sm text-gray-600">
                          ID: {patient.id}
                        </div>
                      </button>
                    ))}
                  </div>
                </ShowIf>
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <label className="block min-w-48" htmlFor="medicationId">
                Medication
              </label>
              <div className="relative flex-1 autocomplete-container">
                <input
                  className="border px-2 py-1 rounded w-full"
                  placeholder="Search medications..."
                  value={selectedMedicationName || medicationId}
                  onChange={(e) => {
                    const value = e.target.value;
                    setMedicationId(value);
                    setSelectedMedicationName('');
                    setMedicationSearchTerm(value);
                  }}
                  onFocus={() => {
                    if (medicationId.trim()) {
                      setMedicationSearchTerm(medicationId);
                    }
                  }}
                />
                <ShowIf condition={autoCompleteMedications.length > 0}>
                  <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-b-md max-h-48 overflow-y-auto z-10 shadow-lg">
                    {autoCompleteMedications.map((medication) => (
                      <button
                        key={medication.id}
                        type="button"
                        className="w-full px-4 py-2 text-left hover:bg-gray-100 border-b border-b-gray-400 last:border-b-0"
                        onClick={() => {
                          setMedicationId(medication.id);
                          setSelectedMedicationName(medication.name);
                          setAutoCompleteMedications([]);
                        }}
                      >
                        <div className="font-medium">{medication.name}</div>
                        <div className="text-sm text-gray-600">
                          {medication.dosage} • {medication.frequency} • ID:{' '}
                          {medication.id}
                        </div>
                      </button>
                    ))}
                  </div>
                </ShowIf>
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <label className="block min-w-48" htmlFor="startDate">
                Start Date
              </label>
              <input
                className="border px-2 py-1 rounded w-64 flex-1"
                type="date"
                value={startDate}
                onChange={(e) => {
                  // Ensure value is always in YYYY-MM-DD format
                  const val = e.target.value;
                  const formatted = val.replace(/[^0-9\-]/g, '').slice(0, 10);
                  setStartDate(formatted);
                }}
                pattern="\d{4}-\d{2}-\d{2}"
                placeholder="YYYY-MM-DD"
              />
            </div>
            <div className="flex gap-2 items-center">
              <label className="block min-w-48" htmlFor="numberOfDays">
                Number of Days
              </label>
              <input
                className="border px-2 py-1 rounded w-64 flex-1"
                type="number"
                min="1"
                value={numberOfDays}
                onChange={(e) => setNumberOfDays(Number(e.target.value))}
              />
            </div>
            <button
              type="button"
              onClick={createAssignment}
              className="bg-teal-600 text-white px-4 py-1 rounded"
            >
              Add
            </button>
          </div>
        </ShowIf>

        <div className="space-y-1">
          <table className="min-w-full border mt-4">
            <thead>
              <tr>
                <th className="border px-2 py-1 text-left">Patient</th>
                <th className="border px-2 py-1 text-left">Medication</th>
                <th className="border px-2 py-1 text-left">Start Date</th>
                <th className="border px-2 py-1 text-left">Number of Days</th>
                <th className="border px-2 py-1 text-left">Days remaining</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((s) => (
                <tr key={s.id}>
                  <td className="border px-2 py-1">{s.patient?.name}</td>
                  <td className="border px-2 py-1">
                    {s.medication?.name} (dosage: {s.medication?.dosage},
                    frequency: {s.medication?.frequency})
                  </td>
                  <td className="border px-2 py-1">
                    {moment(s.startDate).isValid()
                      ? moment(s.startDate).format('YYYY-MM-DD')
                      : '-'}
                  </td>
                  <td className="border px-2 py-1">{s.numberOfDays} day(s)</td>

                  <td className="border px-2 py-1">
                    <ShowIf condition={s.remainingDays > 0}>
                      {s.remainingDays} day(s)
                    </ShowIf>
                    <ShowIf condition={s.remainingDays <= 0}>
                      <span className="text-green-700">Completed</span>
                    </ShowIf>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex flex-row justify-between mt-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              Showing {limit * (page - 1) + 1} to{' '}
              {Math.min(limit * page, total)} of {total} entries
            </span>
            &bull;
            <span className="text-sm text-gray-600">
              Page {page} of {Math.ceil(total / limit)}
            </span>
          </div>
          <div>
            <button
              type="button"
              className="bg-teal-600 text-white px-4 py-1 rounded mr-2 disabled:bg-gray-200"
              onClick={() => fetchAssignments(Math.max(page - 1, 1))}
              disabled={page <= 1 || isLoading}
            >
              Previous
            </button>
            <button
              type="button"
              className="bg-teal-600 text-white px-4 py-1 rounded disabled:bg-gray-200"
              onClick={() =>
                fetchAssignments(Math.min(page + 1, Math.ceil(total / limit)))
              }
              disabled={page * limit >= total || isLoading}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </Async>
  );
}
