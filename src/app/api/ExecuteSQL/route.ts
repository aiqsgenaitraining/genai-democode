
const sqlite3 = require('sqlite3').verbose();

interface SqlRequest {
  query: string;
}

export async function POST(req: Request): Promise<Response> {
  try {
    const { query } = (await req.json()) as SqlRequest;
    console.log("Query:", query);
    if (!query) {
      return new Response(JSON.stringify({ error: 'SQL query missing' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const db = new sqlite3.Database('chinook.db');
    

    const rows = await new Promise<any[]>((resolve, reject) => {
      db.all(query, (err: Error | null, rows: any[]) => {
        if (err) {
          reject(err);
        } else {
            
          resolve(rows);
        }
      });
    });

    db.close();

    return new Response(JSON.stringify(rows), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error executing SQL:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}