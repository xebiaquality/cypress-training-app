import { client } from '@/client'
import { Button } from '../ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { FormEvent, useCallback, useRef } from 'react'
import queryClient from '@/query-client'

function EditPlaylistDialog({
  open,
  onOpenChange,
  playlistId,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  playlistId?: number
}) {
  const playlistNameRef = useRef<HTMLInputElement>(null)
  const { data: playlist, isLoading } = client.playlists.getPlaylist.useQuery(
    [`playlist-${playlistId}`],
    { params: { id: playlistId?.toString() || '' } },
    { enabled: open && playlistId !== 0 }
  )
  const { mutate: updatePlaylist, isLoading: isUpdating } =
    client.playlists.updatePlaylist.useMutation({
      onSuccess: () => {
        onOpenChange(false)
        queryClient.invalidateQueries(['playlists'])
        queryClient.invalidateQueries([`playlist-${playlistId}`])
      },
    })
  const onSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      if (!playlistNameRef.current?.value || !playlistId) return

      updatePlaylist({
        body: { name: playlistNameRef.current.value },
        params: { id: playlistId.toString() },
      })
    },
    [updatePlaylist, playlistId]
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Playlist</DialogTitle>
            <DialogDescription>Rename your playlist</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Playlist name</Label>
              {isLoading ? (
                <Input id="name" disabled placeholder="Loading..." />
              ) : (
                <Input
                  ref={playlistNameRef}
                  id="name"
                  defaultValue={playlist?.body.name}
                  placeholder="Name of your playlist"
                />
              )}
            </div>
          </div>
          <DialogFooter>
            <Button disabled={isUpdating} type="submit">
              {isUpdating ? 'Loading...' : 'Rename'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default EditPlaylistDialog
