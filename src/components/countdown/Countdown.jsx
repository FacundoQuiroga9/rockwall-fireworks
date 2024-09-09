/* eslint-disable react/no-unescaped-entities */
import { useState, useEffect } from 'react';
import './Countdown.css';

const Countdown = () => {
  const [timeRemaining, setTimeRemaining] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [nextOpeningTitle, setNextOpeningTitle] = useState('');

  // Definir rangos de apertura con título
  const openingRanges = [
    {
      title: 'Independence Day',
      start: new Date('June 24, 2025 09:00:00').getTime(),
      end: new Date('July 4, 2025 23:59:59').getTime(),
    },
    {
      title: 'Diwali',
      start: new Date('October 26, 2024 09:00:00').getTime(),
      end: new Date('November 1, 2024 23:59:59').getTime(),
    },
    {
      title: "New Year's Eve",
      start: new Date('December 20, 2024 09:00:00').getTime(),
      end: new Date('January 1, 2025 23:59:59').getTime(),
    },
    {
      title: 'Texas Independence Day',
      start: new Date('February 25, 2025 09:00:00').getTime(),
      end: new Date('March 2, 2025 23:59:59').getTime(),
    },
    {
      title: 'San Jacinto Day',
      start: new Date('April 16, 2025 09:00:00').getTime(),
      end: new Date('April 21, 2025 23:59:59').getTime(),
    },
    {
      title: 'Memorial Day',
      start: new Date('May 21, 2025 09:00:00').getTime(),
      end: new Date('May 26, 2025 23:59:59').getTime(),
    },
  ];

  // Función para obtener el próximo rango de apertura más cercano
  const getNextOpeningRange = () => {
    const now = new Date().getTime();

    // Verificar si ya estamos dentro de un rango de apertura
    const currentRange = openingRanges.find(range => now >= range.start && now <= range.end);

    if (currentRange) {
      return { ...currentRange, isWithinRange: true };
    }

    // Si no estamos dentro de ningún rango, encontrar el próximo rango futuro
    const futureRanges = openingRanges.filter(range => range.start > now);

    // Ordenar los rangos futuros por fecha de inicio para encontrar el más cercano
    futureRanges.sort((a, b) => a.start - b.start);

    return futureRanges.length ? { ...futureRanges[0], isWithinRange: false } : null;
  };

  useEffect(() => {
    const nextRange = getNextOpeningRange();

    const interval = setInterval(() => {
      const now = new Date().getTime();

      if (nextRange) {
        setNextOpeningTitle(nextRange.title); // Establecer el título del próximo rango

        if (nextRange.isWithinRange) {
          // Si estamos dentro de un rango de apertura
          setIsOpen(true);
        } else {
          // Si no estamos dentro del rango, calcular el tiempo restante
          const distance = nextRange.start - now;

          const days = Math.floor(distance / (1000 * 60 * 60 * 24));
          const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

          setIsOpen(false);
          setTimeRemaining({ days, hours, minutes });
        }
      } else {
        setIsOpen(false);
        setTimeRemaining({});
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [openingRanges]);

  return (
    <div className="countdown">
      {isOpen ? (
        <h2>We're Open!</h2>
      ) : (
        <div>
          <h2>NEXT OPENING: <span className='holiday'>{nextOpeningTitle.toUpperCase()}</span></h2>
          <div className="time">
            {timeRemaining.days !== undefined ? (
              <>
                {timeRemaining.days} days {timeRemaining.hours} hours {timeRemaining.minutes} minutes
              </>
            ) : (
              <p>No upcoming openings.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Countdown;
