import { ColumnDef } from '@tanstack/react-table'
import { TrackSchema } from '../../../contracts/tracks'
import { z } from 'zod'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { MoreHorizontal } from 'lucide-react'
import { Button } from '../ui/button'
import { client } from '@/client'
const dateFormatter = new Intl.DateTimeFormat('en', {
  dateStyle: 'medium',
  timeStyle: 'short',
  timeZone: 'Europe/Amsterdam',
})

export const columns: ColumnDef<z.infer<typeof TrackSchema>>[] = [
  {
    id: 'coverUrl',
    accessorKey: 'coverUrl',
    header: undefined,
    cell: ({ row }) => {
      const coverUrl = row.getValue<string>('coverUrl')
      return (
        <img
          src={coverUrl}
          alt={`cover image of ${row.getValue('title')}`}
          className="w-12"
        />
      )
    },
  },
  {
    accessorKey: 'title',
    header: 'Title',
  },
  {
    accessorKey: 'artist',
    header: 'Artist',
  },
  {
    accessorKey: 'createdAt',
    header: 'Date added',
    cell: ({ row }) => {
      const date = new Date(row.getValue('createdAt') + 'Z')
      return <span>{dateFormatter.format(date)}</span>
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const track = row.original
      const { isLoading, data: playlists } =
        client.playlists.getPlaylists.useQuery(['playlists'])
      const { mutate: addTrackToPlaylist } =
        client.playlists.addTrackToPlaylist.useMutation()

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger
                disabled={!isLoading && !playlists?.body.length}
              >
                Add to Playlist
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="w-48">
                {!isLoading &&
                  playlists?.body?.map((playlist) => (
                    <DropdownMenuItem
                      key={playlist?.id}
                      onClick={() =>
                        addTrackToPlaylist({
                          params: {
                            id: `${playlist?.id}`,
                          },
                          body: { id: track.id },
                        })
                      }
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        className="mr-2 h-4 w-4"
                        viewBox="0 0 24 24"
                      >
                        <path d="M21 15V6M18.5 18a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM12 12H3M16 6H3M12 18H3" />
                      </svg>
                      {playlist?.name}
                    </DropdownMenuItem>
                  ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(track.url)}
            >
              Copy track URL
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
