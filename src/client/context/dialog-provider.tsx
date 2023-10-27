import { PropsWithChildren, useState } from 'react'
import {
  DialogContext,
  DialogState,
  Dialogs,
  defaultDialogState,
} from './dialog-context'
import CreatePlaylistDialog from '@/components/dialogs/create-playlist-dialog'
import EditPlaylistDialog from '@/components/dialogs/edit-playlist-dialog'
import AddMusicDialog from '@/components/dialogs/add-music-dialog'

export const DialogProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [dialogs, setDialogs] =
    useState<Record<Dialogs, DialogState>>(defaultDialogState)
  const isDialogOpen = (dialog: Dialogs): boolean => dialogs[dialog].open
  const openDialog = (dialog: Dialogs, id?: number) =>
    setDialogs((dialogs) => ({
      ...dialogs,
      [dialog]: { open: true, id },
    }))
  const closeDialog = (dialog: Dialogs) =>
    setDialogs((dialogs) => ({
      ...dialogs,
      [dialog]: { ...dialogs[dialog], open: false },
    }))

  return (
    <>
      <DialogContext.Provider value={{ openDialog, closeDialog, isDialogOpen }}>
        {children}
      </DialogContext.Provider>
      <CreatePlaylistDialog
        onOpenChange={() => closeDialog(Dialogs.CreatePlaylistDialog)}
        open={isDialogOpen(Dialogs.CreatePlaylistDialog)}
      />
      <EditPlaylistDialog
        playlistId={dialogs[Dialogs.EditPlaylistDialog]?.id || 0}
        onOpenChange={() => closeDialog(Dialogs.EditPlaylistDialog)}
        open={isDialogOpen(Dialogs.EditPlaylistDialog)}
      />
      <AddMusicDialog
        onOpenChange={() => closeDialog(Dialogs.AddTrackDialog)}
        open={isDialogOpen(Dialogs.AddTrackDialog)}
      />
    </>
  )
}
