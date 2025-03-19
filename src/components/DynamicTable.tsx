import React from 'react';

interface TableData {
  [key: string]: any;
}

interface TableProps {
  data: TableData[];
}

const DynamicTable: React.FC<TableProps> = ({ data }) => {
 // console.log(data)



  if (!data || data.length === 0 || data === undefined ) {
    return <p className="p-4">No data to display.</p>;
  }

  if (data.error) {
    return <p className="p-4 text-red-500">Error: {data.error}</p>;
  }
  const columns = data.length > 0 ? Object.keys(data[0]) : [];

  return (
    <div className="overflow-auto max-h-96 max-w-xl">
      <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
        {columns.map((column) => (
          <th
          key={column}
          scope="col"
          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
          {column}
          </th>
        ))}
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {data.map((row, rowIndex) => (
        <tr key={rowIndex}>
          {columns.map((column) => (
          <td
            key={`${rowIndex}-${column}`}
            className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
          >
            {row[column]}
          </td>
          ))}
        </tr>
        ))}
      </tbody>
      </table>
    </div>
  );
};

export default DynamicTable;