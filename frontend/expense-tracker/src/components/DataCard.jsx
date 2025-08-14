import React from 'react';

const DataCard = ({ title, icon, count, total, color, recentItems = [], itemLabel = "items" }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <span className={`text-2xl ${color}`}>{icon}</span>
      </div>
      
      <div className="space-y-2">
        
        <p className={`text-3xl font-bold ${color}`}>
              {typeof total === 'number' ? formatCurrency(total) : total}
            </p>
            <p className="text-xs text-gray-500">Total Amount</p>
        
        {total !== undefined && (
          <>
            
            <p className="text-lg font-semibold">
          {count}
        </p>
          </>
        )}
      </div>

      {recentItems.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Recent</h4>
          <div className="space-y-1">
            {recentItems.slice(0, 3).map((item, index) => (
              <div key={index} className="flex justify-between items-center text-sm">
                <span className="text-gray-600 truncate">{item.name || item.description || item.title}</span>
                {item.amount && (
                  <span className={`font-semibold ${color}`}>
                    {formatCurrency(item.amount)}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DataCard;
