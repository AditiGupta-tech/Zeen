import React, { useState } from "react";
import { useAppContext } from "../../context/appContext";
import type { EmergencyContact as EmergencyContactType } from "../../types/Index";
import { FilePen, Trash2 } from "lucide-react";

const EmergencyContacts: React.FC = () => {
  const { emergencyContacts, addEmergencyContact, updateEmergencyContact, deleteEmergencyContact, isLoading } = useAppContext();
  const [newContact, setNewContact] = useState({ name: "", relationship: "", phone: "" });
  const [editingContactId, setEditingContactId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContact.name || !newContact.phone) {
      alert("Name and Phone are required.");
      return;
    }
    if (editingContactId) {
      await updateEmergencyContact(editingContactId, newContact);
      setEditingContactId(null);
    } else {
      await addEmergencyContact(newContact);
    }
    setNewContact({ name: "", relationship: "", phone: "" });
    setShowForm(false);
  };

  const handleEdit = (contact: EmergencyContactType) => {
    setNewContact({ name: contact.name, relationship: contact.relationship, phone: contact.phone });
    setEditingContactId(contact.id);
    setShowForm(true);
  };

  if (isLoading) return <p>Loading emergency contacts...</p>;

  return (
    <div style={{
      padding: "20px",
      borderRadius: "12px",
      background: "#f9fafc",
      boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
      maxWidth: "750px",
      marginInline: "auto",
      marginTop: "20px",
      fontFamily: "Segoe UI, sans-serif"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <h3 style={{ fontSize: "1.2rem", color: "#333", margin: 0 }}>📞 Emergency Contacts</h3>
        {!showForm && (
          <button onClick={() => setShowForm(true)} style={{
            padding: "8px 16px",
            background: "#2f4de0",
            color: "#fff",
            border: "none",
            borderRadius: "20px",
            fontSize: "0.9rem",
            cursor: "pointer",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
          }}>
            ➕ Add Contact
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: "10px", marginBottom: "25px" }}>
          <input
            type="text"
            placeholder="Name"
            value={newContact.name}
            onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
            style={{
              padding: "8px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              fontSize: "0.9rem"
            }}
          />
          <input
            type="text"
            placeholder="Relationship (e.g. Parent, Doctor)"
            value={newContact.relationship}
            onChange={(e) => setNewContact({ ...newContact, relationship: e.target.value })}
            style={{
              padding: "8px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              fontSize: "0.9rem"
            }}
          />
          <input
            type="tel"
            placeholder="Phone"
            value={newContact.phone}
            onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
            style={{
              padding: "8px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              fontSize: "0.9rem"
            }}
          />

          <div style={{ display: "flex", gap: "10px", marginTop: "5px" }}>
            <button type="submit" style={{
              padding: "8px 16px",
              background: "#2f4de0",
              color: "#fff",
              fontWeight: 500,
              border: "none",
              borderRadius: "9999px",
              fontSize: "0.9rem",
              cursor: "pointer"
            }}>
              {editingContactId ? "✎ Update" : "Add Contact"}
            </button>
            <button type="button" onClick={() => {
              setNewContact({ name: "", relationship: "", phone: "" });
              setEditingContactId(null);
              setShowForm(false);
            }} style={{
              padding: "8px 12px",
              background: "#888",
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

      {/* Saved contacts */}
      <div style={{
        display: "grid",
        gap: "16px",
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))"
      }}>
        {emergencyContacts.length === 0 ? (
          <p style={{ fontStyle: "italic", color: "#666" }}>No emergency contacts added yet.</p>
        ) : (
          emergencyContacts.map((contact, idx) => (
            <div key={contact.id} style={{
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
                {contact.name} <span style={{ fontWeight: 400, color: "#666" }}>({contact.relationship})</span>
              </div>
              <div style={{ color: "#444" }}>{contact.phone}</div>

              <div style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                display: "flex",
                gap: "6px"
              }}>
                <button onClick={() => handleEdit(contact)} style={{
                  border: "none",
                  background: "#e3eaff",
                  padding: "6px",
                  borderRadius: "9999px",
                  cursor: "pointer",
                  transition: "0.2s"
                }}>
                  <FilePen size={16} color="#2f4de0" />
                </button>
                <button onClick={() => deleteEmergencyContact(contact.id)} style={{
                  border: "none",
                  background: "#ffe5e5",
                  padding: "6px",
                  borderRadius: "9999px",
                  cursor: "pointer",
                  transition: "0.2s"
                }}>
                  <Trash2 size={16} color="#d7263d" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Animation keyframe */}
      <style>
        {`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(8px);
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

export default EmergencyContacts;
