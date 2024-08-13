const EnvironmentChip = ({
  environmentLabel,
}: {
  environmentLabel: string;
}) => {
  return (
    <span className="rounded-2xl bg-teal px-2.5 py-1.5 text-xs font-medium uppercase tracking-wide text-white">
      {environmentLabel}
    </span>
  );
};

export { EnvironmentChip };
