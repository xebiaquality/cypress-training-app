import { columns } from '@/components/tracklist/columns'
import { Tracklist } from '@/components/tracklist/tracklist'
import { playlistRoute } from '@/router'

type PlaylistPageComponent = (typeof playlistRoute)['options']['component']

export const Playlist: PlaylistPageComponent = ({ useLoader }) => {
  const data = useLoader()

  return (
    <div className="space-y-6">
      <Tracklist columns={columns} data={data} />
    </div>
  )
}
