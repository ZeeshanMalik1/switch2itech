import React from 'react'
import { Plus } from 'lucide-react'
import { Button } from '../../components/ui/button'

const Header = () => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">
          Client Testimonials
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage and curate customer social proof across your platform.
        </p>
      </div>

      <Button className="rounded-xl px-6 py-6 font-bold shadow-lg shadow-primary/20 shrink-0">
        <Plus size={18} className="mr-2" />
        Add Testimonial
      </Button>
    </div>
  )
}

export default Header