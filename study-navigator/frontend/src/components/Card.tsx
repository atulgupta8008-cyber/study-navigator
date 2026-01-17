export default function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-gray-900 rounded-xl p-6 shadow-lg">
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      {children}
    </div>
  );
}
