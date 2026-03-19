const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const isOddSaturday = (date) => {
  const day = date.getDate();
  const weekOfMonth = Math.ceil(day / 7);
  return weekOfMonth % 2 === 1;
};

export const getEffectiveDay = (date, saturdayFollowDay = 'Friday') => {
  const dayName = weekdays[date.getDay()];
  if (dayName !== 'Saturday') return dayName;
  return isOddSaturday(date) ? 'Holiday' : saturdayFollowDay;
};

export const getCurrentAndNextClass = (entries = [], now = new Date()) => {
  const currentTime = now.toTimeString().slice(0, 5);
  let currentClass = null;
  let nextClass = null;

  for (const entry of entries) {
    if (entry.startTime <= currentTime && entry.endTime >= currentTime) {
      currentClass = entry;
    }
    if (!nextClass && entry.startTime > currentTime) {
      nextClass = entry;
    }
  }

  return { currentClass, nextClass };
};
