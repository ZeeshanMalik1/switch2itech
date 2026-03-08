import React from 'react'

const Header = () => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
          Clients Management
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage your customer relations and project statuses.
        </p>
      </div>
    </div>
  )
}

export default Header