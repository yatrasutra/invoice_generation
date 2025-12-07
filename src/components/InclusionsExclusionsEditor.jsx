import React, { useState } from 'react';

const InclusionsExclusionsEditor = ({
  title,
  items,
  customText,
  onItemsChange,
  onCustomTextChange,
  predefinedItems = [],
  type = 'inclusions', // 'inclusions' or 'exclusions'
}) => {
  const [newItem, setNewItem] = useState('');

  const iconColor = type === 'inclusions' ? 'text-green-600' : 'text-red-600';
  const bgColor = type === 'inclusions' ? 'from-green-50 to-emerald-50' : 'from-red-50 to-rose-50';
  const borderColor = type === 'inclusions' ? 'border-green-200' : 'border-red-200';
  const buttonColor = type === 'inclusions' ? 'from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700' : 'from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700';

  const handleToggleItem = (item) => {
    if (items.includes(item)) {
      onItemsChange(items.filter((i) => i !== item));
    } else {
      onItemsChange([...items, item]);
    }
  };

  const handleAddCustomItem = () => {
    if (newItem.trim()) {
      onItemsChange([...items, newItem.trim()]);
      setNewItem('');
    }
  };

  const handleRemoveItem = (item) => {
    onItemsChange(items.filter((i) => i !== item));
  };

  return (
    <div className={`bg-gradient-to-br ${bgColor} rounded-2xl p-6 border-2 ${borderColor}`}>
      <div className="flex items-center gap-3 mb-5">
        <div className={`h-10 w-10 bg-white rounded-xl flex items-center justify-center shadow-md`}>
          {type === 'inclusions' ? (
            <svg className={`h-5 w-5 ${iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className={`h-5 w-5 ${iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
        </div>
        <div>
          <h4 className="text-base font-bold text-gray-900">{title}</h4>
          <p className="text-sm text-gray-600">Select and add items</p>
        </div>
      </div>

      {/* Predefined Items - Checkboxes */}
      {predefinedItems.length > 0 && (
        <div className="mb-5">
          <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-3">
            Standard Items
          </p>
          <div className="space-y-2 bg-white rounded-xl p-4 max-h-48 overflow-y-auto">
            {predefinedItems.map((item, index) => (
              <label
                key={index}
                className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  checked={items.includes(item)}
                  onChange={() => handleToggleItem(item)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-0.5 flex-shrink-0"
                />
                <span className="text-sm text-gray-700">{item}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Custom Items Already Added */}
      {items.length > 0 && (
        <div className="mb-5">
          <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-3">
            Selected Items
          </p>
          <div className="space-y-2">
            {items.map((item, index) => (
              <div
                key={index}
                className="flex items-start justify-between gap-3 bg-white rounded-lg p-3 group hover:shadow-md transition-all"
              >
                <div className="flex items-start gap-2 flex-1">
                  <span className={`${iconColor} font-bold mt-0.5`}>•</span>
                  <span className="text-sm text-gray-700">{item}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveItem(item)}
                  className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-all flex-shrink-0"
                  title="Remove item"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Custom Item */}
      <div className="mb-5">
        <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-3">
          Add Custom Item
        </p>
        <div className="flex gap-2">
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCustomItem())}
            placeholder="Type custom item and click Add"
            className="input-field flex-1"
          />
          <button
            type="button"
            onClick={handleAddCustomItem}
            disabled={!newItem.trim()}
            className={`px-5 py-2 bg-gradient-to-r ${buttonColor} text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg flex items-center gap-2`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add
          </button>
        </div>
      </div>

      {/* Additional Custom Text */}
      <div>
        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-3">
          Additional Notes (Optional)
        </label>
        <textarea
          value={customText}
          onChange={(e) => onCustomTextChange(e.target.value)}
          placeholder="Any additional notes or special conditions..."
          rows="3"
          className="input-field resize-none"
        />
      </div>
    </div>
  );
};

export default InclusionsExclusionsEditor;



