function Navbar() {
  return (
    <header className="h-16 border-b bg-white px-6 flex items-center justify-between">
      <div>
        <h1 className="text-xl font-bold text-gray-800">
          Universal Web Scraper
        </h1>
        <p className="text-xs text-gray-500">
          Web Scraping & Data Management Platform
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
          U
        </div>

        <div className="hidden sm:block">
          <p className="text-sm font-medium text-gray-700">Admin</p>
          <p className="text-xs text-gray-500">Administrator</p>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
