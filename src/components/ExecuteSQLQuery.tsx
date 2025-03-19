import React, { useEffect, useState } from 'react';

interface ExecuteSQLQueryProps {
  query: string;
}

export const ExecuteSQLQuery: React.FC<ExecuteSQLQueryProps> = ({ query }) => {
  const [result, setResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/ExecuteSQL', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);
        setResult(data.result);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('An error occurred. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [query]);

  return (
    <div>
      {isLoading ? (
        'Fetching data...'
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div>{result}</div>
      )}
    </div>
  );
};