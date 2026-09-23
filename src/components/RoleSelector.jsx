import React from "react";
import { ShieldCheck, UserCheck, GraduationCap } from "lucide-react";

export default function RoleSelector({ activeRole, onSelectRole }) {
  const roles = [
    {
      id: "admin",
      label: "Admin Portal",
      icon: ShieldCheck,
      badge: "Preset System Login"
    },
    {
      id: "coordinator",
      label: "Coordinator",
      icon: UserCheck,
      badge: "Preset System Login"
    },
    {
      id: "student",
      label: "Student Portal",
      icon: GraduationCap,
      badge: "Team Code Login"
    }
  ];

  return (
    <div className="role-tabs-wrapper">
      <div className="role-tabs">
        {roles.map((r) => {
          const Icon = r.icon;
          const isActive = activeRole === r.id;
          return (
            <button
              key={r.id}
              type="button"
              className={`role-tab-btn ${isActive ? "active" : ""}`}
              onClick={() => onSelectRole(r.id)}
            >
              <Icon size={18} />
              <span>{r.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
