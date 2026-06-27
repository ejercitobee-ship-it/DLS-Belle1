interface TestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TestModal = ({ isOpen, onClose }: TestModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-8 max-w-md">
        <h2 className="text-2xl font-bold mb-4">Test Modal</h2>
        <p className="mb-6">This is a test modal</p>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
};
