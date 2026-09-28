import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

import Dashboard from "./pages/Dashboard";
import ScrapeWebsite from "./pages/ScrapeWebsite";
import ScrapedData from "./pages/ScrapedData";
import RecordDetails from "./pages/RecordDetails";
import DatabaseSchema from "./pages/DatabaseSchema";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <div className="flex">
          <Sidebar />

          <main className="flex-1 p-6">
            <Routes>
              <Route path="/" element={<Dashboard />} />

              <Route
                path="/scrape"
                element={<ScrapeWebsite />}
              />

              <Route
                path="/data"
                element={<ScrapedData />}
              />

              <Route
                path="/data/:id"
                element={<RecordDetails />}
              />

              <Route
                path="/schema"
                element={<DatabaseSchema />}
              />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;