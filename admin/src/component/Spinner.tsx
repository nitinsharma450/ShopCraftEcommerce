export default function Spinner({className} : {className ?: string}) {
  return (
    <div className={"flex items-center justify-center min-h-screen bg-white" + className}>
      <div className="w-16 h-16 border-4 border-purple-500 border-dashed rounded-full animate-spin"></div>
    </div>
  );
}
