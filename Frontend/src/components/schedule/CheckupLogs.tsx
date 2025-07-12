import React, { useState } from "react";
import { useAppContext } from "../../context/appContext";
import type { CheckupLog as CheckupLogType } from "../../types/Index";
import { format } from "date-fns";
import { FilePen, Trash2 } from "lucide-react";

const CheckupLogs: React.FC = () => {
  const { checkupLogs, addCheckupLog, updateCheckupLog, deleteCheckupLog, isLoading } = useAppContext();
  const [newLog, setNewLog] = useState({ date: format(new Date(), "yyyy-MM-dd"), doctorName: "", notes: "" });
  const [file, setFile] = useState<File | null>(null);
  const [editingLogId, setEditingLogId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLog.date || !newLog.doctorName || !newLog.notes) {
      alert("All fields are required.");
      return;
    }
    if (editingLogId) {
      await updateCheckupLog(editingLogId, { ...newLog });
      setEditingLogId(null);
    } else {
      await addCheckupLog(newLog);
    }
    setNewLog({ date: format(new Date(), "yyyy-MM-dd"), doctorName: "", notes: "" });
    setFile(null);
    setShowForm(false);
  };

  const handleEdit = (log: CheckupLogType) => {
    setNewLog({ date: log.date, doctorName: log.doctorName, notes: log.notes });
    setEditingLogId(log.id);
    setShowForm(true);
  };

  return (
    <div style={{
      padding: "20px",
      borderRadius: "12px",
      marginTop: "20px",
      background: "#f7f9fc",
      boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
      maxWidth: "750px",
      marginInline: "auto",
      fontFamily: "Segoe UI, sans-serif"
    }}>
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px"
      }}>
        <h3 style={{ fontSize: "1.2rem", color: "#333", margin: 0 }}>🩺 Checkup Logs</h3>
        {!showForm && (
          <button onClick={() => setShowForm(true)} style={{
            padding: "8px 16px",
            background: "#3f51b5",
            color: "#fff",
            border: "none",
            borderRadius: "20px",
            fontSize: "0.9rem",
            cursor: "pointer",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
          }}>
            + Add New Log
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: "10px", marginBottom: "25px" }}>
          <input
            type="date"
            value={newLog.date}
            onChange={(e) => setNewLog({ ...newLog, date: e.target.value })}
            style={{
              padding: "8px", borderRadius: "6px", border: "1px solid #ccc", fontSize: "0.9rem"
            }}
          />
          <input
            type="text"
            placeholder="Doctor's Name"
            value={newLog.doctorName}
            onChange={(e) => setNewLog({ ...newLog, doctorName: e.target.value })}
            style={{
              padding: "8px", borderRadius: "6px", border: "1px solid #ccc", fontSize: "0.9rem"
            }}
          />
          <textarea
            placeholder="Notes about the checkup"
            value={newLog.notes}
            onChange={(e) => setNewLog({ ...newLog, notes: e.target.value })}
            rows={2}
            style={{
              padding: "8px", borderRadius: "6px", border: "1px solid #ccc",
              fontSize: "0.9rem", resize: "vertical"
            }}
          />
          {/* Custom file upload */}
          <label style={{
  border: "1px dashed #aaa",
  padding: "10px",
  borderRadius: "8px",
  fontSize: "0.85rem",
  color: file ? "#2e2e72" : "#555",
  cursor: "pointer",
  background: "#fff",
  textAlign: "center",
  transition: "all 0.25s ease",
  boxShadow: file ? "inset 0 0 0 2px #4e54c8" : "none",
  position: "relative",
  overflow: "hidden"
}} 
onMouseEnter={(e) => {
  (e.currentTarget.style.background = "#f0f4ff");
  (e.currentTarget.style.borderColor = "#4e54c8");
}}
onMouseLeave={(e) => {
  (e.currentTarget.style.background = "#fff");
  (e.currentTarget.style.borderColor = "#aaa");
}}>
  {file ? `📎 Attached: ${file.name}` : "📁 Attach a File (PDF, DOC, Image)"}
  <input
    type="file"
    accept=".pdf,.doc,.docx,image/*"
    onChange={(e) => setFile(e.target.files?.[0] || null)}
    style={{ display: "none" }}
  />
</label>


          <div style={{ display: "flex", gap: "10px", marginTop: "5px" }}>
            <button type="submit" style={{
              padding: "8px 16px",
              background: "#3f51b5",
              color: "#fff",
              fontWeight: 500,
              border: "none",
              borderRadius: "9999px",
              fontSize: "0.9rem",
              cursor: "pointer"
            }}>
              {editingLogId ? "✎ Update Log" : "Add Log"}
            </button>
            <button type="button" onClick={() => {
              setNewLog({ date: format(new Date(), "yyyy-MM-dd"), doctorName: "", notes: "" });
              setEditingLogId(null);
              setShowForm(false);
            }} style={{
              padding: "8px 12px",
              background: "#999",
              color: "#fff",
              fontSize: "0.85rem",
              border: "none",
              borderRadius: "9999px",
              cursor: "pointer"
            }}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Logs Section */}
      <div style={{
        display: "grid",
        gap: "16px",
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))"
      }}>
        {checkupLogs.length === 0 ? (
          <p style={{ fontStyle: "italic", color: "#666" }}>No checkup logs added yet.</p>
        ) : (
          checkupLogs
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .map((log, idx) => (
              <div key={log.id} style={{
                background: "#fff",
                border: "1px solid #ddd",
                borderRadius: "10px",
                padding: "12px",
                fontSize: "0.9rem",
                boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                position: "relative",
                animation: `fadeIn 0.3s ease ${idx * 0.05}s both`
              }}>
                <div style={{ fontWeight: 600, color: "#2e2e72", marginBottom: "4px" }}>
                  {format(new Date(log.date), "PPP")}
                </div>
                <div><strong>👨‍⚕️ Doctor:</strong> {log.doctorName}</div>
                <div style={{ margin: "6px 0", color: "#555" }}>{log.notes}</div>

                <div style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  display: "flex",
                  gap: "6px"
                }}>
                  <button onClick={() => handleEdit(log)} style={{
                    border: "none",
                    background: "#e3eaff",
                    padding: "6px",
                    borderRadius: "9999px",
                    cursor: "pointer"
                  }}>
                    <FilePen size={16} color="#3f51b5" />
                  </button>
                  <button onClick={() => deleteCheckupLog(log.id)} style={{
                    border: "none",
                    background: "#ffe5e5",
                    padding: "6px",
                    borderRadius: "9999px",
                    cursor: "pointer"
                  }}>
                    <Trash2 size={16} color="#e53935" />
                  </button>
                </div>
              </div>
            ))
        )}
      </div>

      {/* Animation styles */}
      <style>
        {`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0px);
            }
          }
        `}
      </style>
    </div>
  );
};

export default CheckupLogs;
