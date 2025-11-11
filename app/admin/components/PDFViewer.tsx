'use client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

type PDFViewerProps = {
  urlPDF: string
  openDialog: boolean
  setOpenDialog: (open: boolean) => void
}

const PDFViewer = ({ urlPDF, openDialog, setOpenDialog }: PDFViewerProps) => {
  console.log('PDF URL:', urlPDF);
  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>PDF Viewer</DialogTitle>
        </DialogHeader>

      </DialogContent>
    </Dialog>
  )
}

export default PDFViewer