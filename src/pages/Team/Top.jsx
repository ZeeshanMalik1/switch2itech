import React from 'react'
import { PlusCircle, UserPlus, Users } from 'lucide-react'
import { Button } from '../../components/ui/button'

const Top = () => {
  return (
    <div className="page-header">
      <div>
        <h1 className="page-title flex items-center gap-2.5">
          <Users size={26} className="text-primary" /> Team Management
        </h1>
        <p className="page-subtitle">Create teams and assign members to manage projects effectively</p>
      </div>
      <div className="flex items-center gap-3">
        <Button variant="outline" className="rounded-xl gap-2">
          <UserPlus size={15} /> Add Member
        </Button>
        <Button className="rounded-xl gap-2 shadow-sm shadow-primary/20">
          <PlusCircle size={15} /> Create Team
        </Button>
      </div>
    </div>
  )
}

export default Top