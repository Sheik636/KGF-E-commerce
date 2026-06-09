import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import API from "../Services/api";
import AdminLayout from "../Components/AdminLayout";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await API.get("/admin/users");
        setUsers(data);
      } catch {
        toast.error("Failed to load users");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return (
    <AdminLayout title="USERS" subtitle="Registered customer accounts">
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-2 border-brand-red border-t-transparent rounded-full animate-spin" />
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-20 card-dark">
          <p className="font-display text-3xl text-brand-muted">NO USERS</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-brand-border">
                <th className="text-left py-3 px-4 text-brand-muted text-xs uppercase tracking-widest font-medium">
                  Name
                </th>
                <th className="text-left py-3 px-4 text-brand-muted text-xs uppercase tracking-widest font-medium">
                  Email
                </th>
                <th className="text-left py-3 px-4 text-brand-muted text-xs uppercase tracking-widest font-medium hidden sm:table-cell">
                  Joined
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr
                  key={user._id}
                  className="border-b border-brand-border/50 hover:bg-brand-card/50 transition-colors animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.05}s`, opacity: 0 }}
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-brand-red/20 border border-brand-red/30 flex items-center justify-center text-brand-red font-bold text-sm shrink-0">
                        {user.name?.charAt(0)?.toUpperCase() || "?"}
                      </div>
                      <span className="text-white font-medium">{user.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-brand-muted">{user.email}</td>
                  <td className="py-4 px-4 text-brand-muted text-sm hidden sm:table-cell">
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminUsers;
