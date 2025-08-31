/**
 * Gets the color classes for a given color.
 * @param {string} color The color to get classes for.
 * @returns {Record<string, string>} The color classes.
 */
export const getColorClasses = (color: string): Record<string, string> => {
  const baseColors: Record<
    string,
    { bg: string; text: string; border: string }
  > = {
    red: { bg: 'bg-red-500', text: 'text-red-300', border: 'border-red-500' },
    blue: {
      bg: 'bg-blue-500',
      text: 'text-blue-300',
      border: 'border-blue-500',
    },
    green: {
      bg: 'bg-green-500',
      text: 'text-green-300',
      border: 'border-green-500',
    },
    yellow: {
      bg: 'bg-yellow-500',
      text: 'text-yellow-300',
      border: 'border-yellow-500',
    },
    purple: {
      bg: 'bg-purple-500',
      text: 'text-purple-300',
      border: 'border-purple-500',
    },
    pink: {
      bg: 'bg-pink-500',
      text: 'text-pink-300',
      border: 'border-pink-500',
    },
    indigo: {
      bg: 'bg-indigo-500',
      text: 'text-indigo-300',
      border: 'border-indigo-500',
    },
    gray: {
      bg: 'bg-gray-500',
      text: 'text-gray-300',
      border: 'border-gray-500',
    },
    violet: {
      bg: 'bg-violet-500',
      text: 'text-violet-300',
      border: 'border-violet-500',
    },
    orange: {
      bg: 'bg-orange-500',
      text: 'text-orange-300',
      border: 'border-orange-500',
    },
    teal: {
      bg: 'bg-teal-500',
      text: 'text-teal-300',
      border: 'border-teal-500',
    },
    cyan: {
      bg: 'bg-cyan-500',
      text: 'text-cyan-300',
      border: 'border-cyan-500',
    },
    lime: {
      bg: 'bg-lime-500',
      text: 'text-lime-300',
      border: 'border-lime-500',
    },
    amber: {
      bg: 'bg-amber-500',
      text: 'text-amber-300',
      border: 'border-amber-500',
    },
    emerald: {
      bg: 'bg-emerald-500',
      text: 'text-emerald-300',
      border: 'border-emerald-500',
    },
    fuchsia: {
      bg: 'bg-fuchsia-500',
      text: 'text-fuchsia-300',
      border: 'border-fuchsia-500',
    },
    rose: {
      bg: 'bg-rose-500',
      text: 'text-rose-300',
      border: 'border-rose-500',
    },
    sky: { bg: 'bg-sky-500', text: 'text-sky-300', border: 'border-sky-500' },
    slate: {
      bg: 'bg-slate-500',
      text: 'text-slate-300',
      border: 'border-slate-500',
    },
  };

  return (
    baseColors[color] || {
      bg: 'bg-violet-500',
      text: 'text-violet-300',
      border: 'border-violet-500',
    }
  );
};
