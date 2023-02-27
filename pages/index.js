import React from 'react';
import { useRouter } from 'next/router';

const Page = ({ data, error }) => {
  const router = useRouter();

  const refreshData = () => {
    router.replace(router.asPath, undefined, { scroll: false });
  };

  const handleInsert = async () => {
    try {
      const response = await fetch('/api/insert-location', {
        method: 'POST',
        body: JSON.stringify({
          date: new Date(),
        }),
      });

      const json = await response.json();
      refreshData();

      if (!response.ok) {
        throw new Error(json.message);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch('/api/delete-location', {
        method: 'POST',
        body: JSON.stringify({
          id: id,
        }),
      });

      const json = await response.json();
      refreshData();

      if (!response.ok) {
        throw new Error(json.message);
      }
    } catch (error) {
      alert(error.message);
      console.error(error.message);
    }
  };

  if (error) {
    return (
      <main style={{ fontFamily: 'system-ui' }}>
        <h1>Error</h1>
        <pre>{JSON.stringify(error, null, 2)}</pre>
      </main>
    );
  }

  return (
    <main style={{ fontFamily: 'system-ui' }}>
      <h1>Getting Started With CockroachDB, pg-promise and Next.js</h1>
      <h2>Insert</h2>
      <p>Click submit to insert a new location</p>
      <button onClick={handleInsert}>Submit</button>
      <h2>Data</h2>
      {data.locations.map((l, i) => {
        const { id, date, city, lat, lng, runtime } = l;
        return (
          <dl key={i} style={{ marginBottom: 64 }}>
            <dt>Id</dt>
            <dd>
              <span>{id}</span> <button onClick={() => handleDelete(id)}>delete</button>
            </dd>
            <dt>Date</dt>
            <dd>{date}</dd>
            <dt>City</dt>
            <dd>{city}</dd>
            <dt>Latitude</dt>
            <dd>{lat}</dd>
            <dt>Longitude</dt>
            <dd>{lng}</dd>
            <dt>Runtime</dt>
            <dd>{runtime}</dd>
          </dl>
        );
      })}
    </main>
  );
};

export const getServerSideProps = async () => {
  const { client } = require('../db');
  const db = client();

  try {
    const response = await db.any('SELECT * from locations');

    return {
      props: {
        data: {
          locations: response.map((res) => {
            const { id, date, city, lat, lng, runtime } = res;
            return {
              id,
              date: String(new Date(date * 1000)),
              city,
              lat,
              lng,
              runtime,
            };
          }),
        },
      },
    };
  } catch (error) {
    return {
      props: {
        error: error.message,
      },
    };
  }
};

export default Page;
