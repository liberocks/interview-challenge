'use client';

import { useState } from 'react';
import moment from 'moment';

import { Async } from '@/components/async';
import Spin from '@/components/spin';
import patientApi, { PatientEntity } from '@/api/patient';
import ShowIf from '@/components/show-if';

export default function Home() {
  const [patients, setPatients] = useState<PatientEntity[]>([]);

  // Fields for creating a new patient
  const [name, setName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');

  // Pagination state
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // UX state
  const [showCreateForm, setShowCreateForm] = useState(false);

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
        <div className="flex justify-between items-center mb-5">
          <h1 className="text-2xl font-bold">Patients</h1>

          <ShowIf condition={!showCreateForm}>
            <button
              type="button"
              onClick={() => setShowCreateForm(true)}
              className="bg-teal-600 text-white px-4 py-1 rounded hover:cursor-pointer"
            >
              Add Patient
            </button>
          </ShowIf>
          <ShowIf condition={showCreateForm}>
            <button
              type="button"
              onClick={() => setShowCreateForm(false)}
              className="bg-rose-600 text-white px-4 py-1 rounded hover:cursor-pointer"
            >
              Cancel
            </button>
          </ShowIf>
        </div>

        <ShowIf condition={showCreateForm}>
          <div className="flex-col flex gap-5 mb-4 p-4 border rounded-lg bg-gray-100 border-gray-400">
            <div className="flex gap-2 items-center">
              <label className="block min-w-48" htmlFor="name">
                Name
              </label>
              <input
                className="border px-2 py-1 rounded w-64 flex-1"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="flex gap-2 items-center">
              <label className="block min-w-48" htmlFor="dateOfBirth">
                Date of Birth
              </label>
              <input
                className="border px-2 py-1 rounded w-64 flex-1"
                type="date"
                value={dateOfBirth}
                onChange={(e) => {
                  setDateOfBirth(e.target.value);
                }}
                pattern="\d{4}-\d{2}-\d{2}"
                placeholder="YYYY-MM-DD"
              />
            </div>
            <button
              type="button"
              onClick={createPatient}
              className="bg-teal-600 text-white px-4 py-1 rounded hover:cursor-pointer"
            >
              Add
            </button>
          </div>
        </ShowIf>

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
              className="bg-teal-600 text-white px-4 py-1 rounded mr-2 disabled:bg-gray-200 hover:cursor-pointer"
              onClick={() => fetchPatients(Math.max(page - 1, 1))}
              disabled={page <= 1 || isLoading}
            >
              Previous
            </button>
            <button
              type="button"
              className="bg-teal-600 text-white px-4 py-1 rounded disabled:bg-gray-200 hover:cursor-pointer"
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
