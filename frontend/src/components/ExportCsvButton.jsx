import { useState } from "react";
import { downloadCsv } from "../services/api";

function ExportCsvButton() {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    try {
      setLoading(true);

      const blob = await downloadCsv();

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;
      link.download = "scraped_data.csv";

      document.body.appendChild(link);
      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(
        "CSV download failed:",
        error
      );

      alert(
        "Unable to download CSV file."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {loading ? "Exporting..." : "⬇ Export CSV"}
    </button>
  );
}

export default ExportCsvButton;