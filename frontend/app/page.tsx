'use client';

import { useState } from 'react';
import moment from 'moment';

import { Async } from '@/components/async';
import Spin from '@/components/spin';
import patientApi, { PatientEntity } from '@/api/patient';

export default function Home() {
  const [patients, setPatients] = useState<PatientEntity[]>([]);
  const [name, setName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');

  const fetchSamples = async () => {
    const res = await patientApi.getPatients({ page: 1, limit: 10 });
    setPatients(res.items || []);
  };

  const createPatient = async () => {
    if (!name.trim()) return;
    await patientApi.createPatient({ name, dateOfBirth });

    setName('');
    setDateOfBirth('');
    fetchSamples();
  };

  return (
    <Async request={fetchSamples} skeleton={<Spin />}>
      <div className="p-8 font-sans">
        <h1 className="text-2xl font-bold mb-4">Medication Manager</h1>

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

        <ul className="space-y-1">
          <table className="min-w-full border mt-4">
            <thead>
              <tr>
                <th className="border px-2 py-1 text-left">ID</th>
                <th className="border px-2 py-1 text-left">Name</th>
                <th className="border px-2 py-1 text-left">Date of Birth</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((s) => (
                <tr key={s.id}>
                  <td className="border px-2 py-1">{s.id}</td>
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
        </ul>
      </div>
    </Async>
  );
}
