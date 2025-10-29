import { useMemo } from "react";

interface FilterOption {
  value: string;
  label: string;
  countKey?: string;
}

interface FilterSelectProps {
  label: string;
  value: string;
  options: FilterOption[];
  userList: User[];
  onChange: (value: string) => void;
  className?: string;
}

type CountFunction = (user: User) => boolean;

export default function FilterSelect({
  label,
  value,
  options,
  userList,
  onChange,
  className = "",
}: FilterSelectProps) {
  // Mapeia as funções de contagem para cada tipo de filtro
  const countFunctions: Record<string, CountFunction> = useMemo(
    () => ({
      // Status counts
      ativo: (user: User) =>
        user.isActive &&
        (user.profile !== "Professor" || user.isTeacherActive) &&
        (user.profile !== "Presenter" || user.isPresenterActive),
      ativo_pendente: (user: User) =>
        (user.profile === "Professor" &&
          user.isActive &&
          !user.isTeacherActive) ||
        (user.profile === "Presenter" &&
          user.isActive &&
          !user.isPresenterActive),
      inativo: (user: User) => !user.isActive,

      // Permission counts
      superadmin: (user: User) => user.isSuperadmin,
      admin: (user: User) => user.isAdmin && !user.isSuperadmin,
      normal: (user: User) => !user.isAdmin && !user.isSuperadmin,

      // Profile counts
      apresentador: (user: User) => user.profile === "Presenter",
      professor: (user: User) => user.profile === "Professor",
      ouvinte: (user: User) => user.profile === "Listener",
    }),
    [],
  );

  // Calcula a contagem para cada opção
  const getCounts = useMemo(() => {
    const counts: Record<string, number> = {};

    options.forEach((option) => {
      if (option.countKey && countFunctions[option.countKey]) {
        counts[option.countKey] = (userList || []).filter(
          countFunctions[option.countKey],
        ).length;
      }
    });

    return counts;
  }, [userList, options, countFunctions]);

  return (
    <div className={`filter-dropdown ${className}`}>
      <label className="filter-dropdown-label">{label}</label>
      <select
        className="filter-dropdown-select"
        onChange={(e) => onChange(e.target.value)}
        value={value}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
            {option.countKey && ` (${getCounts[option.countKey] || 0})`}
          </option>
        ))}
      </select>
    </div>
  );
}
