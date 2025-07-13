'use client';

import { useState } from 'react';
import moment from 'moment';

import { Async } from '@/components/async';
import Spin from '@/components/spin';
import medicationApi, { MedicationEntity } from '@/api/medication';

export default function Home() {
  const [patients, setPatients] = useState<MedicationEntity[]>([]);

  // Fields for creating a new medication
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('');

  // Pagination state
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const fetchMedications = async (page: number = 1) => {
    setIsLoading(true);

    try {
      const res = await medicationApi.getMedications({ page, limit });

      setPatients(res.items || []);
      setTotal(res.total || 0);
      setPage(page);
    } catch (error) {
      console.error('Failed to fetch medications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createMedication = async () => {
    if (!name.trim() || !dosage.trim() || !frequency.trim()) return;
    await medicationApi.createMedication({ name, dosage, frequency });

    setName('');
    setDosage('');
    setFrequency('');

    fetchMedications();
  };

  return (
    <Async request={fetchMedications} skeleton={<Spin />}>
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
            placeholder="Dosage (e.g., 500 mg)"
            value={dosage}
            onChange={(e) => setDosage(e.target.value)}
          />
          <input
            className="border px-2 py-1 rounded w-64"
            placeholder="Frequency (e.g., 2x per day)"
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
          />
          <button
            type="button"
            onClick={createMedication}
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
                <th className="border px-2 py-1 text-left">Dosage</th>
                <th className="border px-2 py-1 text-left">Frequency</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((s) => (
                <tr key={s.id}>
                  <td className="border px-2 py-1">{s.name}</td>
                  <td className="border px-2 py-1">{s.dosage}</td>
                  <td className="border px-2 py-1">{s.frequency}</td>
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
              onClick={() => fetchMedications(Math.max(page - 1, 1))}
              disabled={page <= 1 || isLoading}
            >
              Previous
            </button>
            <button
              type="button"
              className="bg-blue-600 text-white px-4 py-1 rounded disabled:bg-gray-200"
              onClick={() =>
                fetchMedications(Math.min(page + 1, Math.ceil(total / limit)))
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
