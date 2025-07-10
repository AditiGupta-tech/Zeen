import Events from './Events';
import Therapies from './Therapies';

interface WithAuthProps {
  onLogout: () => void;
}

export default function WithAuth({ onLogout }: WithAuthProps) {
  return (
    <div className="text-center py-20">
      <h1 className="text-4xl font-bold text-green-700">Welcome to Zeen, Rockstar!</h1>
      <p className="mt-2 text-gray-600">You’re logged in and ready to roll.</p>
      <button
        onClick={onLogout}
        className="mt-6 px-6 py-3 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Log Out
      </button>
      <Therapies />
      <Events/>
    </div>
  );
}
