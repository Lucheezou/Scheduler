import React, { useState } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import dayjs from 'dayjs';

const CongesForm = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const typeConges = [
    { value: 'vacances', label: 'Vacances' },
    { value: 'recuperation', label: 'Récupération' },
    { value: 'formation', label: 'Formation' },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow mb-6">
      <div className="flex items-center gap-4 flex-wrap">
        {/* Text field */}
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            value="Dr Chouchane"
            disabled
            className="w-full p-2 border rounded-lg bg-gray-50"
          />
        </div>

        {/* Dropdown */}
        <div className="flex-1 min-w-[200px]">
          <select className="w-full p-2 border rounded-lg">
            {typeConges.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Date Picker */}
        <div className="relative">
          <button
            onClick={() => setShowDatePicker(!showDatePicker)}
            className="p-2 hover:bg-gray-100 rounded-lg border flex items-center gap-2"
          >
            <CalendarIcon className="h-5 w-5" />
            <span>Sélectionner les dates</span>
          </button>

          {/* Date Picker Popup */}
          {showDatePicker && (
            <div className="absolute top-full mt-2 bg-white rounded-lg shadow-lg p-4 z-50">
              <div className="grid gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date de début
                  </label>
                  <input
                    type="datetime-local"
                    value={dayjs(startDate).format('YYYY-MM-DDTHH:mm')}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date de fin
                  </label>
                  <input
                    type="datetime-local"
                    value={dayjs(endDate).format('YYYY-MM-DDTHH:mm')}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Demande congés
        </button>
      </div>
    </div>
  );
};

export default CongesForm;