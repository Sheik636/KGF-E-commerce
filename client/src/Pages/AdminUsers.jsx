import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import API from "../Services/api";
import AdminLayout from "../Components/AdminLayout";
import FireLoader from "../Components/FireLoader";
import { Users, Mail, Calendar } from "lucide-react";

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
    <AdminLayout title="USERS" subtitle={`Registered customer accounts (${users.length})`}>
      {loading ? (
        <FireLoader fullScreen size="lg" text="Loading users..." />
      ) : users.length === 0 ? (
        <div className="text-center py-20 card-dark">
          <div className="w-16 h-16 rounded-full bg-brand-red/10 text-brand-red flex items-center justify-center mx-auto mb-4">
            <Users size={32} />
          </div>
          <p className="font-display text-3xl text-brand-muted">NO USERS FOUND</p>
        </div>
      ) : (
        <div className="overflow-x-auto card-dark p-4">
          <table className="w-full">
            <thead>
              <tr className="border-b border-brand-border">
                <th className="text-left py-3 px-4 text-brand-muted text-xs uppercase tracking-widest font-medium">
                  User
                </th>
                <th className="text-left py-3 px-4 text-brand-muted text-xs uppercase tracking-widest font-medium">
                  Email
                </th>
                <th className="text-left py-3 px-4 text-brand-muted text-xs uppercase tracking-widest font-medium hidden sm:table-cell">
                  Joined Date
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr
                  key={user._id}
                  className="border-b border-brand-border/50 hover:bg-brand-dark/50 transition-colors animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.04}s` }}
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-brand-red/20 border border-brand-red/30 flex items-center justify-center text-brand-red font-bold text-sm shrink-0">
                        {user.name?.charAt(0)?.toUpperCase() || "?"}
                      </div>
                      <span className="text-white font-medium">{user.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-brand-muted text-sm">
                    <div className="flex items-center gap-2">
                      <Mail size={14} className="text-brand-muted shrink-0" />
                      <span>{user.email}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-brand-muted text-sm hidden sm:table-cell">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-brand-muted shrink-0" />
                      <span>
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString("en-IN", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })
                          : "—"}
                      </span>
                    </div>
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
