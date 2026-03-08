import React, { useState } from 'react'
import {
  Search, Pencil, Trash2, Mail,
  Filter, UserCheck, Shield, Code2, Briefcase
} from 'lucide-react'
import { Card, CardHeader, CardContent } from '../../components/ui/card'
import { Input } from '../../components/ui/input'
import { Button } from '../../components/ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '../../components/ui/avatar'
import { Badge } from '../../components/ui/badge'

const ROLE_ICON = { Developer: Code2, Manager: Briefcase, Director: Shield, Lead: UserCheck }
const ROLE_COLOR = {
  Developer: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  Manager: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
  Director: 'bg-red-500/10 text-red-600 border-red-500/20',
  Lead: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  Intern: 'bg-secondary text-muted-foreground border-border',
  default: 'bg-secondary text-muted-foreground border-border',
}

const MEMBERS = [
  { name: 'Alex Rivera', email: 'alex@company.com', role: 'Developer', team: 'Tech Ops', status: 'Active', img: 'https://i.pravatar.cc/150?u=1' },
  { name: 'Sarah Chen', email: 'sarah@company.com', role: 'Designer', team: 'Creative', status: 'Active', img: 'https://i.pravatar.cc/150?u=2' },
  { name: 'James Wilson', email: 'james@company.com', role: 'Manager', team: 'Marketing', status: 'Active', img: 'https://i.pravatar.cc/150?u=3' },
  { name: 'Elena Frost', email: 'elena@company.com', role: 'Intern', team: 'Tech Ops', status: 'Active', img: 'https://i.pravatar.cc/150?u=4' },
  { name: 'Mike Ross', email: 'mike@company.com', role: 'Developer', team: 'Product', status: 'Active', img: 'https://i.pravatar.cc/150?u=5' },
  { name: 'Lisa Kim', email: 'lisa@company.com', role: 'Developer', team: 'Tech Ops', status: 'Active', img: 'https://i.pravatar.cc/150?u=6' },
  { name: 'David Vane', email: 'david@company.com', role: 'Lead', team: 'Creative', status: 'Active', img: 'https://i.pravatar.cc/150?u=7' },
  { name: 'Sonia Geller', email: 'sonia@company.com', role: 'Intern', team: 'Marketing', status: 'Active', img: 'https://i.pravatar.cc/150?u=8' },
  { name: 'Peter Parker', email: 'peter@company.com', role: 'Developer', team: 'Tech Ops', status: 'Active', img: 'https://i.pravatar.cc/150?u=9' },
  { name: 'Bruce Wayne', email: 'bruce@company.com', role: 'Director', team: 'Product', status: 'Active', img: 'https://i.pravatar.cc/150?u=10' },
]

const Main = () => {
  const [search, setSearch] = useState('')

  const filtered = MEMBERS.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.role.toLowerCase().includes(search.toLowerCase()) ||
    m.team.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <Card className="overflow-hidden border-border/50">
      {/* Header */}
      <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-6 pt-6 pb-5 border-b border-border/40">
        <div>
          <h2 className="text-base font-extrabold tracking-tight">All Members</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Manage team members and their access levels</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative w-64">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
            <Input
              placeholder="Search name, role, team…"
              className="pl-10 h-9 rounded-xl text-sm"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon" className="h-9 w-9 rounded-xl shrink-0">
            <Filter size={14} />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-secondary/30 border-b border-border/40 text-[10px] font-black uppercase tracking-[0.14em] text-muted-foreground/60">
                <th className="px-6 py-4">Member</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Team</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {filtered.map((member, i) => {
                const RoleIcon = ROLE_ICON[member.role] || Briefcase
                const roleStyle = ROLE_COLOR[member.role] || ROLE_COLOR.default
                return (
                  <tr key={i} className="group hover:bg-secondary/15 transition-colors">
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3.5">
                        <Avatar className="h-9 w-9 rounded-xl border border-border shadow-sm">
                          <AvatarImage src={member.img} alt={member.name} className="object-cover" />
                          <AvatarFallback className="rounded-xl bg-primary/10 text-primary font-bold text-xs">
                            {member.name.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-bold leading-tight">{member.name}</p>
                          <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                            <Mail size={9} /> {member.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3.5">
                      <Badge className={`border rounded-lg text-[10px] font-black uppercase px-2.5 py-1 flex items-center gap-1.5 w-fit ${roleStyle}`}>
                        <RoleIcon size={9} /> {member.role}
                      </Badge>
                    </td>
                    <td className="px-6 py-3.5">
                      <span className="text-sm font-medium text-foreground/80">{member.team}</span>
                    </td>
                    <td className="px-6 py-3.5">
                      <Badge className="border rounded-lg bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px] font-black uppercase px-2.5 py-1 flex items-center gap-1.5 w-fit">
                        <div className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse" />
                        {member.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-primary/10 hover:text-primary">
                          <Pencil size={13} />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-red-500/10 hover:text-red-500">
                          <Trash2 size={13} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination footer */}
        <div className="px-6 py-4 border-t border-border/40 bg-secondary/10 flex items-center justify-between">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Showing {filtered.length} of {MEMBERS.length} members
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8 text-xs rounded-lg">Previous</Button>
            <Button variant="outline" size="sm" className="h-8 text-xs rounded-lg">Next</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default Main