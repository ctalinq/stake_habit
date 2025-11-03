export default function CommitementSekeleton() {
  return (
    <>
      <div className="flex gap-1 align-center mb-6">
        <div className="w-12 h-12 mr-3 skeleton-circle" />
        <div className="skeleton h-8 grow-1" />
      </div>
      {Array(15)
        .fill(null)
        .map((_, index) => (
          <div key={index} className="skeleton h-4 grow-1 mb-2" />
        ))}
      <div className="skeleton mt-8 h-4 w-1/2 mb-2" />
      <div className="skeleton mt-8 h-10 w-1/3" />
    </>
  );
}
