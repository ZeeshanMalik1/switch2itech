import React, { useState, useEffect } from "react"
import userService from "../../api/userService"
import projectService from "../../api/projectService"
import { Search, Star, StarHalf, Users, Briefcase, Loader2 } from "lucide-react"
import { Input } from "../../components/ui/input"

const Top = ({ onSearch }) => {
  const [counts, setCounts] = useState({ clients: 0, projects: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [userRes, projectRes] = await Promise.all([
          userService.getUsers(),
          projectService.getAllProjects()
        ])
        if (userRes.data.status === "success" && projectRes.data.status === "success") {
          setCounts({
            clients: userRes.data.data.filter(u => u.role === "client").length,
            projects: projectRes.data.data.filter(p => p.status === "active").length,
          })
        }
      } catch (err) {
        console.error("Error fetching client stats:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  const stats = [
    { label: "Total Clients", value: loading ? "···" : counts.clients, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Active Projects", value: loading ? "···" : counts.projects, icon: Briefcase, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Client Satisfaction", value: "4.8", icon: Star, color: "text-amber-500", bg: "bg-amber-500/10", isRating: true },
  ]

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {stats.map((s, i) => (
          <div key={i} className="stat-card flex items-center gap-4">
            <div className={`p-3 rounded-xl ${s.bg} shrink-0`}>
              <s.icon size={19} className={s.color} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{s.label}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <h3 className="text-2xl font-extrabold tracking-tight">{s.value}</h3>
                {s.isRating && (
                  <div className="flex text-amber-400 gap-0.5 mb-0.5">
                    {[...Array(4)].map((_, k) => <Star key={k} size={11} fill="currentColor" />)}
                    <StarHalf size={11} fill="currentColor" />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-2xl">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={15} />
        <Input
          type="text"
          placeholder="Search by name, company or email…"
          onChange={(e) => onSearch && onSearch(e.target.value)}
          className="pl-11 rounded-2xl h-12"
        />
      </div>
    </div>
  )
}

export default Top
