import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";

import {
  getRecordById,
  updateRecord,
} from "../services/api";

import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";

function RecordDetails() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();

  const editMode = searchParams.get("edit") === "true";

  const [record, setRecord] = useState(null);
  const [formData, setFormData] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadRecord();
  }, [id]);

  const loadRecord = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getRecordById(id);

      const data = response.data || response;

      setRecord(data);

      setFormData({
        url: data.url || "",
        title: data.title || "",
        headings: data.headings || [],
        paragraphs: data.paragraphs || [],
        links: data.links || [],
      });
    } catch (err) {
      console.error("Failed to load record:", err);

      setError(
        err.response?.data?.detail ||
          "Unable to load record."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSave = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const payload = {
        ...formData,
        headings:
          typeof formData.headings === "string"
            ? formData.headings
                .split("\n")
                .map((item) => item.trim())
                .filter(Boolean)
            : formData.headings,

        paragraphs:
          typeof formData.paragraphs === "string"
            ? formData.paragraphs
                .split("\n")
                .map((item) => item.trim())
                .filter(Boolean)
            : formData.paragraphs,
      };

      const response = await updateRecord(id, payload);

      const updatedRecord = response.data || response;

      setRecord(updatedRecord);

      setFormData({
        url: updatedRecord.url || "",
        title: updatedRecord.title || "",
        headings: updatedRecord.headings || [],
        paragraphs: updatedRecord.paragraphs || [],
        links: updatedRecord.links || [],
      });

      setSuccess("Record updated successfully.");
    } catch (err) {
      console.error("Update failed:", err);

      setError(
        err.response?.data?.detail ||
          "Unable to update record."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Loading message="Loading record..." />;
  }

  if (error && !record) {
    return <ErrorMessage message={error} />;
  }

  if (!record || !formData) {
    return (
      <ErrorMessage message="Record not found." />
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}

      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <Link
            to="/data"
            className="text-sm text-blue-600 hover:underline"
          >
            ← Back to Scraped Data
          </Link>

          <h2 className="mt-2 text-2xl font-bold text-gray-800">
            Record #{record.id}
          </h2>
        </div>

        {!editMode && (
          <Link
            to={`/data/${id}?edit=true`}
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Edit Record
          </Link>
        )}
      </div>

      <ErrorMessage message={error} />

      {success && (
        <div className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {success}
        </div>
      )}

      {editMode ? (
        <EditForm
          formData={formData}
          onChange={handleChange}
          onSubmit={handleSave}
          saving={saving}
        />
      ) : (
        <RecordView record={record} />
      )}
    </div>
  );
}

function RecordView({ record }) {
  return (
    <div className="space-y-5">
      {/* Basic Information */}

      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h3 className="mb-5 text-lg font-semibold text-gray-800">
          Basic Information
        </h3>

        <div className="grid gap-5 md:grid-cols-2">
          <InfoItem
            label="ID"
            value={`#${record.id}`}
          />

          <InfoItem
            label="Title"
            value={record.title || "No title"}
          />

          <div className="md:col-span-2">
            <p className="mb-1 text-xs font-medium uppercase text-gray-500">
              URL
            </p>

            <a
              href={record.url}
              target="_blank"
              rel="noopener noreferrer"
              className="break-all text-sm text-blue-600 hover:underline"
            >
              {record.url}
            </a>
          </div>

          <InfoItem
            label="Scraped At"
            value={
              record.scraped_at
                ? new Date(
                    record.scraped_at
                  ).toLocaleString()
                : "-"
            }
          />
        </div>
      </div>

      {/* Headings */}

      <ContentSection
        title="Headings"
        items={record.headings}
      />

      {/* Paragraphs */}

      <ContentSection
        title="Paragraphs"
        items={record.paragraphs}
      />

      {/* Links */}

      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-gray-800">
          Links
        </h3>

        {!record.links?.length ? (
          <p className="text-sm text-gray-500">
            No links found.
          </p>
        ) : (
          <div className="space-y-3">
            {record.links.map((link, index) => (
              <div
                key={index}
                className="rounded-lg border bg-gray-50 p-3"
              >
                <p className="text-sm font-medium text-gray-700">
                  {link.text || "Untitled link"}
                </p>

                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 block break-all text-xs text-blue-600 hover:underline"
                >
                  {link.href}
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ContentSection({ title, items }) {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold text-gray-800">
        {title}
      </h3>

      {!items?.length ? (
        <p className="text-sm text-gray-500">
          No {title.toLowerCase()} found.
        </p>
      ) : (
        <ul className="space-y-2">
          {items.map((item, index) => (
            <li
              key={index}
              className="rounded-lg bg-gray-50 px-4 py-3 text-sm text-gray-700"
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function InfoItem({ label, value }) {
  return (
    <div>
      <p className="mb-1 text-xs font-medium uppercase text-gray-500">
        {label}
      </p>

      <p className="text-sm text-gray-800">
        {value}
      </p>
    </div>
  );
}

function EditForm({
  formData,
  onChange,
  onSubmit,
  saving,
}) {
  return (
    <form
      onSubmit={onSubmit}
      className="space-y-5"
    >
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h3 className="mb-5 text-lg font-semibold text-gray-800">
          Edit Record
        </h3>

        <div className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              URL
            </label>

            <input
              type="url"
              name="url"
              value={formData.url}
              onChange={onChange}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Title
            </label>

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={onChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Headings
            </label>

            <textarea
              name="headings"
              value={
                Array.isArray(formData.headings)
                  ? formData.headings.join("\n")
                  : formData.headings
              }
              onChange={onChange}
              rows={6}
              placeholder="One heading per line"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Paragraphs
            </label>

            <textarea
              name="paragraphs"
              value={
                Array.isArray(formData.paragraphs)
                  ? formData.paragraphs.join("\n")
                  : formData.paragraphs
              }
              onChange={onChange}
              rows={10}
              placeholder="One paragraph per line"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Link
          to="/data"
          className="rounded-lg border bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </Link>

        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}

export default RecordDetails;