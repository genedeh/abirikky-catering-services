type EmptyStateCardProps = {
  title: string;
  description: string;
};

export function EmptyStateCard({ title, description }: EmptyStateCardProps) {
  return (
    <div className="relative z-raised mx-auto mt-16 max-w-xl rounded-xl border border-white/10 bg-white/[0.06] p-8 text-center">
      <p className="font-display text-3xl font-bold text-white">{title}</p>
      <p className="mt-3 text-base font-medium leading-7 text-white/65">
        {description}
      </p>
    </div>
  );
}
