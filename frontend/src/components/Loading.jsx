function Loading({ message = "Loading..." }) {
  return (
    <div className="flex items-center justify-center py-10">
      <div className="flex items-center gap-3 text-gray-600">
        <div className="h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />

        <span className="text-sm">{message}</span>
      </div>
    </div>
  );
}

export default Loading;
