import React from 'react';

const CapacityBar = ({ currentLoad, maxCapacity, percentage }) => {
    const barColor = percentage >= 100 ? 'bg-red-600' : percentage >= 80 ? 'bg-yellow-400' : 'bg-blue-600';

    return (
        <div className="mt-2">
            <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-gray-600">Capacity</span>
                <span className="font-bold">{currentLoad} / {maxCapacity}</span>
            </div>
            <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
                <div 
                    className={`h-full ${barColor} transition-all duration-500`} 
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                ></div>
            </div>
        </div>
    );
};

export default CapacityBar;