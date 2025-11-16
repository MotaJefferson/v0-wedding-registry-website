'use client'

import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface GiftFiltersProps {
  filter: 'all' | 'available' | 'purchased'
  onFilterChange: (filter: 'all' | 'available' | 'purchased') => void
  search: string
  onSearchChange: (search: string) => void
}

export default function GiftFilters({
  filter,
  onFilterChange,
  search,
  onSearchChange,
}: GiftFiltersProps) {
  return (
    <div className="mb-8 space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
        <Input
          placeholder="Buscar presentes..."
          className="pl-10"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          onClick={() => onFilterChange('all')}
        >
          Todos
        </Button>
        <Button
          variant={filter === 'available' ? 'default' : 'outline'}
          onClick={() => onFilterChange('available')}
        >
          Disponíveis
        </Button>
        <Button
          variant={filter === 'purchased' ? 'default' : 'outline'}
          onClick={() => onFilterChange('purchased')}
        >
          Já Presenteados
        </Button>
      </div>
    </div>
  )
}
