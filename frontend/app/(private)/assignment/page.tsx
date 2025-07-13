'use client';

import { useState } from 'react';
import moment from 'moment';

import { Async } from '@/components/async';
import Spin from '@/components/spin';
import assignmentApi, { AssignmentEntity } from '@/api/assignment';
import ShowIf from '@/components/show-if';

export default function Home() {
  const [patients, setPatients] = useState<AssignmentEntity[]>([]);

  // Fields for creating a new assignment
  const [patientId, setPatientId] = useState('');
  const [medicationId, setMedicationId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [numberOfDays, setNumberOfDays] = useState(1);

  // Pagination state
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

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
    fetchAssignments();
  };

  return (
    <Async request={fetchAssignments} skeleton={<Spin />}>
      <div className="p-8 font-sans">
        <h1 className="text-2xl font-bold mb-4">Assignment Manager</h1>

        <div className="flex gap-2 mb-4">
          <input
            className="border px-2 py-1 rounded w-64"
            placeholder="Patient ID"
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
          />
          <input
            className="border px-2 py-1 rounded w-64"
            placeholder="Medication ID"
            value={medicationId}
            onChange={(e) => setMedicationId(e.target.value)}
          />
          <input
            className="border px-2 py-1 rounded w-64"
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
          <input
            className="border px-2 py-1 rounded w-64"
            type="number"
            min="1"
            value={numberOfDays}
            onChange={(e) => setNumberOfDays(Number(e.target.value))}
          />
          <button
            type="button"
            onClick={createAssignment}
            className="bg-blue-600 text-white px-4 py-1 rounded"
          >
            Add
          </button>
        </div>

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
                  <td className="border px-2 py-1">{s.numberOfDays}</td>

                  <td className="border px-2 py-1">
                    <ShowIf condition={s.remainingDays > 0}>
                      {s.remainingDays} day(s)
                    </ShowIf>
                    <ShowIf condition={s.remainingDays <= 0}>
                      <span className="text-green-500">Completed</span>
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
              className="bg-blue-600 text-white px-4 py-1 rounded mr-2 disabled:bg-gray-200"
              onClick={() => fetchAssignments(Math.max(page - 1, 1))}
              disabled={page <= 1 || isLoading}
            >
              Previous
            </button>
            <button
              type="button"
              className="bg-blue-600 text-white px-4 py-1 rounded disabled:bg-gray-200"
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
