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

function CreatePlaylistDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const playlistNameRef = useRef<HTMLInputElement>(null)
  const { mutate: createPlaylist, isLoading } =
    client.createPlaylist.useMutation({
      onSuccess: () => {
        onOpenChange(false)
        queryClient.invalidateQueries(['playlists'])
      },
    })
  const onSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      if (!playlistNameRef.current?.value) return

      createPlaylist({ body: { name: playlistNameRef.current.value } })
    },
    [createPlaylist, playlistNameRef]
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>New Playlist</DialogTitle>
            <DialogDescription>
              Create a new playlist for your music collection.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Playlist name</Label>
              <Input
                ref={playlistNameRef}
                id="name"
                placeholder="Name of your playlist"
              />
            </div>
          </div>
          <DialogFooter>
            <Button disabled={isLoading} type="submit">
              {isLoading ? 'Creating...' : 'Create Playlist'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default CreatePlaylistDialog
