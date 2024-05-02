export const YellowBadge = ({ children }: { children: string }) => {
  return (
    <span className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">
      {children}
    </span>
  );
};

export const GreenBadge = ({ children }: { children: string }) => {
  return (
    <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
      {children}
    </span>
  );
};

export const BlueBadge = ({ children }: { children: string }) => {
  return (
    <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
      {children}
    </span>
  );
};
