'use client';

import { useState } from 'react';
import moment from 'moment';

import { Async } from '@/components/async';
import Spin from '@/components/spin';
import patientApi, { PatientEntity } from '@/api/patient';

export default function Home() {
  const [patients, setPatients] = useState<PatientEntity[]>([]);

  // Fields for creating a new patient
  const [name, setName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');

  // Pagination state
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const fetchPatients = async (page: number = 1) => {
    setIsLoading(true);
    try {
      const res = await patientApi.getPatients({ page, limit });

      setPatients(res.items || []);
      setTotal(res.total || 0);
      setPage(page);
    } catch (error) {
      console.error('Failed to fetch patients:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createPatient = async () => {
    if (!name.trim()) return;
    await patientApi.createPatient({ name, dateOfBirth });

    setName('');
    setDateOfBirth('');
    fetchPatients();
  };

  return (
    <Async request={fetchPatients} skeleton={<Spin />}>
      <div className="p-8 font-sans">
        <h1 className="text-2xl font-bold mb-4">Assignment Manager</h1>

        <div className="flex gap-2 mb-4">
          <input
            className="border px-2 py-1 rounded w-64"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="border px-2 py-1 rounded w-64"
            type="date"
            value={dateOfBirth}
            onChange={(e) => {
              // Ensure value is always in YYYY-MM-DD format
              const val = e.target.value;
              const formatted = val.replace(/[^0-9\-]/g, '').slice(0, 10);
              setDateOfBirth(formatted);
            }}
            pattern="\d{4}-\d{2}-\d{2}"
            placeholder="YYYY-MM-DD"
          />
          <button
            type="button"
            onClick={createPatient}
            className="bg-blue-600 text-white px-4 py-1 rounded"
          >
            Add
          </button>
        </div>

        <div className="space-y-1">
          <table className="min-w-full border mt-4">
            <thead>
              <tr>
                <th className="border px-2 py-1 text-left">Name</th>
                <th className="border px-2 py-1 text-left">Date of Birth</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((s) => (
                <tr key={s.id}>
                  <td className="border px-2 py-1">{s.name}</td>
                  <td className="border px-2 py-1">
                    {moment(s.dateOfBirth).isValid()
                      ? moment(s.dateOfBirth).format('YYYY-MM-DD')
                      : '-'}
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
              onClick={() => fetchPatients(Math.max(page - 1, 1))}
              disabled={page <= 1 || isLoading}
            >
              Previous
            </button>
            <button
              type="button"
              className="bg-blue-600 text-white px-4 py-1 rounded disabled:bg-gray-200"
              onClick={() =>
                fetchPatients(Math.min(page + 1, Math.ceil(total / limit)))
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
