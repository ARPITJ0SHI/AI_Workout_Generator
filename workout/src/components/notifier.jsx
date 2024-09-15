import React from 'react';
import { useNotification } from '../services/notification';

const Notification = () => {
  const { notifications, removeNotification } = useNotification();

  return (
    <div className="fixed top-4 right-4 z-50">
      {notifications.map(({ id, message, type }) => (
        <div
          key={id}
          className={`mb-2 p-4 rounded-md shadow-md ${
            type === 'success' ? 'bg-green-500' :
            type === 'error' ? 'bg-red-500' :
            'bg-blue-500'
          } text-white`}
        >
          <div className="flex justify-between items-center">
            <p>{message}</p>
            <button
              onClick={() => removeNotification(id)}
              className="ml-4 text-white hover:text-gray-200 focus:outline-none"
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Notification;