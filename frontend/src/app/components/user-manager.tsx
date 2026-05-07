import { useState, useEffect } from "react";
import { Trash2, User, ShieldCheck } from "lucide-react";
import apiClient from "../../api/client";

export function UserManager() {
  const [users, setUsers] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  const fetchUsers = async () => {
    setFetchError("");
    try {
      const response = await apiClient.get("/users/", { params: { page_size: 100 } });
      const results = response.data?.results ?? response.data;
      const list = Array.isArray(results) ? results : [];
      setUsers(list);
      setTotalCount(response.data?.count ?? list.length);
    } catch (error: any) {
      const status = error.response?.status;
      setFetchError(
        status === 403 ? "Access denied. Admin privileges required." :
        status === 401 ? "Session expired. Please log in again." :
        "Failed to load users. Is the backend running?"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this user? This cannot be undone.")) return;
    try {
      await apiClient.delete(`/users/${id}/`);
      setUsers((prev) => prev.filter((u) => u.id !== id));
      setTotalCount((c) => c - 1);
    } catch {
      alert("Failed to delete user.");
    }
  };

  return (
    <div className="bg-card rounded-xl shadow-sm border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">User Management</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {loading ? "Loading..." : `${totalCount} registered users`}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Loading users...</div>
      ) : fetchError ? (
        <div className="text-center py-12 text-red-600 bg-red-50 rounded-lg px-4">{fetchError}</div>
      ) : users.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">No users found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">User</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground hidden sm:table-cell">Role</th>
                <th className="py-3 px-4 font-medium text-muted-foreground text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-muted/40 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{user.username}</p>
                        <p className="text-xs text-muted-foreground">ID: {user.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 hidden sm:table-cell">
                    {user.is_staff ? (
                      <span className="flex items-center gap-1 text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full w-fit">
                        <ShieldCheck className="w-3 h-3" /> Admin
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">User</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="p-1.5 rounded-lg text-muted-foreground hover:bg-red-50 hover:text-red-600 transition-colors"
                      title="Delete user"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
