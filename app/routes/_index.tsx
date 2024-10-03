import { type MetaFunction } from '@remix-run/node';
import { useState, useEffect } from 'react';

export const meta: MetaFunction = () => {
  return [
    { title: 'SB1U Krok Champions' },
    {
      property: 'og:title',
      content: 'SB1U Krokinole Champions',
    },
    {
      name: 'description',
      content: 'Her kan du registrere resultater fra SB1U Krokinolekamper.',
    },
  ];
};

export default function Index() {
  const newLink = 'https://krokelo.sb1u.no';
  const [counter, setCounter] = useState(5);
  useEffect(() => {
    if (counter > 0) {
      setTimeout(() => setCounter(counter - 1), 1000);
    } else if (counter === 0) {
      window.location.href = newLink;
    }
  }, [counter]);

  return (
    <div
      className={
        'mx-auto flex-col items-center justify-center rounded-3xl dark:bg-gray-800 dark:text-white'
      }
    >
      <div>
        <h1 className="mt-[100px] text-center text-5xl font-bold text-gray-900 dark:text-white">
          SB1U Krokinole har flyttet til{' '}
          <a
            className="text-blue-600 underline visited:text-purple-600 hover:text-blue-800"
            href={newLink}
          >
            krokelo.sb1u.no
          </a>
        </h1>
        <p className="text-center text-lg text-gray-700 dark:text-gray-300">
          Du blir automatisk videresendt om {counter} sekunder.
        </p>
      </div>
    </div>
  );
}
