interface ActivityGraphProps {
  dates: Date[];
}

export const ActivityGraph = ({ dates }: ActivityGraphProps) => {
  const getStartOfWeek = () => {
    const now = new Date();
    now.setUTCDate(now.getUTCDate() - 7);
    return now;
  };

  const startOfWeek = getStartOfWeek();

  const processDates = (dates: Date[]): Array<[string, number[]]> => {
    const weekMap = new Map<string, number[]>();
    const now = new Date();
    const currentDayISO = now.toISOString().split('T')[0]; // Current day in ISO format
    const currentHour = now.getUTCHours();
    const startHour = 6; // 06:00 UTC time / 08:00 Norwegian time

    for (
      let d = new Date(startOfWeek);
      d <= now;
      d.setUTCDate(d.getUTCDate() + 1)
    ) {
      const dayISO = d.toISOString().split('T')[0];
      const hourArray = Array.from({ length: 11 }, () => 0); // Initialize hour array with 0 for each hour.
      weekMap.set(dayISO, hourArray);
    }

    dates.forEach((date) => {
      const matchDate = new Date(date);
      const matchDayISO = matchDate.toISOString().split('T')[0];
      const matchHour = matchDate.getUTCHours();
      const hourIndex = matchHour - startHour;

      if (weekMap.has(matchDayISO)) {
        const hourArray = weekMap.get(matchDayISO);
        if (hourArray && hourIndex >= 0 && hourIndex < hourArray.length) {
          hourArray[hourIndex]++;
        }
      }
    });

    // Adjust the hourArray for the current day to set future hours to -1, excluding the current hour
    if (weekMap.has(currentDayISO)) {
      const hourArray = weekMap.get(currentDayISO);
      if (hourArray) {
        for (let i = currentHour - startHour + 1; i < hourArray.length; i++) {
          // Start marking as -1 from the hour after the current hour
          if (i >= 0) {
            hourArray[i] = -1;
          }
        }
      }
    }

    return Array.from(weekMap.entries()).map(([dateString, hours]) => [
      new Date(dateString).toLocaleString('no-NO', {
        weekday: 'short',
        timeZone: 'Europe/Oslo',
      }),
      hours,
    ]);
  };

  const processedDates = processDates(dates);
  const hoursLabels = [
    '08:00',
    '09:00',
    '10:00',
    '11:00',
    '12:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
    '18:00',
  ];

  const getColor = (count: number) => {
    if (count >= 7) return 'bg-green-800'; // Darker Green
    if (count >= 3) return 'bg-green-400'; // Green
    if (count >= 1) return 'bg-green-200'; // Light Green
    if (count === 0) return 'bg-gray-200'; // Grey
    return 'invisible'; // Dark Green
  };

  return (
    <div className="overflow-x-auto lg:flex lg:justify-center">
      <div className="flex min-w-max lg:min-w-0">
        <div className="flex flex-shrink-0 flex-col items-center justify-between">
          <div className="text-xs lg:text-sm">Time</div>
          {processedDates.map(([day], dayIndex) => (
            <h3
              className="mb-1 flex h-[32px] items-center justify-center text-xs lg:text-sm"
              key={dayIndex}
            >
              {day}
            </h3>
          ))}
        </div>
        <div className="flex">
          {hoursLabels.map((hoursLabel, hourIndex) => (
            <div key={hourIndex} className="mx-1 flex flex-col items-center">
              <div className="w-[40px] text-center text-xs lg:text-sm">
                {hoursLabel}
              </div>
              {processedDates.map(([, hours], dayIndex) => (
                <div
                  key={dayIndex}
                  className={`mb-1 flex h-[40px] w-[40px] items-center justify-center text-xs lg:text-base dark:text-black ${getColor(hours[hourIndex])}`}
                >
                  {hours[hourIndex] > 0 ? hours[hourIndex] : ''}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
