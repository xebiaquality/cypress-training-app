import { client } from '@/client'
import { columns } from '@/components/tracklist/columns'
import { Tracklist } from '@/components/tracklist/tracklist'
import { Spinner } from '@/components/ui/spinner'

export function Browse() {
  const { data, isLoading } = client.tracks.getAllMusicTracks.useQuery([
    'tracks',
  ])

  return (
    <div className="space-y-6">
      <Tracklist columns={columns} data={data?.body ?? []} />
      {isLoading && <Spinner />}
    </div>
  )
}
