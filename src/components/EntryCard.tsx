import { Entry } from '@/types/database.types'
import { EditIcon } from './icons/Edit';
import Link from 'next/link';

interface EntryCardProps {
  entry: Entry
}

export default function EntryCard({ entry }: EntryCardProps) {
  const formattedDate = new Date(entry.created_at).toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	});

  return (
    <div className="card" style={{ minWidth: '600px' }}>
      <div className="flex items-start justify-between">
        <div className="mb-4">
          <div className="text-xs text-warm-gray mb-2 tracking-wide uppercase">
            {formattedDate}
          </div>
          <h2 className="text-2xl font-serif text-dark-brown mb-3">{entry.title}</h2>
        </div>
        <Link href={`/edit-entry/${entry.id}`} title="Edit entry">
          <button className="btn-icon">
            <EditIcon className="w-6 h-6" />
          </button>
        </Link>
      </div>
      
      <p className="text-dark-brown/80 leading-relaxed whitespace-pre-wrap" style={{ width: '550px' }}>
        {entry.content}
      </p>
    </div>
  )
}
