'use client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useEffect } from 'react';
import packageJson from '../../../package.json'
const pdfjsVersion = packageJson.dependencies['pdfjs-dist']
import '@react-pdf-viewer/zoom/lib/styles/index.css';
import { Viewer, Worker, SpecialZoomLevel, type LoadError } from '@react-pdf-viewer/core'
import '@react-pdf-viewer/core/lib/styles/index.css'
import '@react-pdf-viewer/default-layout/lib/styles/index.css'
import es_ES from '@react-pdf-viewer/locales/lib/es_ES.json'
import { selectionModePlugin, SelectionMode } from '@react-pdf-viewer/selection-mode'
import { zoomPlugin } from '@react-pdf-viewer/zoom'
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout'
import { FaBookOpen } from 'react-icons/fa6';
import { AspectRatio } from '@/components/ui/aspect-ratio';

type PDFViewerProps = {
  urlPDF: any
  openDialog: boolean
  setOpenDialog: (open: boolean) => void
}

const PDFViewer = ({ urlPDF, openDialog, setOpenDialog }: PDFViewerProps) => {
  const urlBackend = "http://192.168.100.8:8000"
  const selectionModePluginInstance = selectionModePlugin()
  const { SwitchSelectionModeButton } = selectionModePluginInstance
  const zoomPluginInstance = zoomPlugin()

  const customToolbar = (Toolbar: any) => (
    <div
      style={{
        alignItems: 'center',
        backgroundColor: '#eeeeee',
        borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
        display: 'flex',
      }}
    >
      <Toolbar>
        {(props: any) => {
          const {
            CurrentPageInput,
            Download,
            EnterFullScreen,
            GoToNextPage,
            GoToPreviousPage,
            NumberOfPages,
            Print,
            ShowSearchPopover,
            Zoom,
            ZoomIn,
            ZoomOut,
            Rotate
          } = props
          return (
            <>
              <div style={{ padding: '0px 2px' }}>
                <ShowSearchPopover />
              </div>
              <div style={{ padding: '0px 2px' }}>
                <ZoomOut />
              </div>
              <div style={{ padding: '0px 2px' }}>
                <Zoom />
              </div>
              <div style={{ padding: '0px 2px' }}>
                <ZoomIn />
              </div>
              <div style={{ padding: '0px 2px', marginLeft: 'auto' }}>
                <GoToPreviousPage />
              </div>
              <div style={{ padding: '0px 2px', width: '4rem' }}>
                <CurrentPageInput />
              </div>
              <div className='text-black' style={{ padding: '0px 2px' }}>
                / <NumberOfPages />
              </div>
              <div style={{ padding: '0px 2px' }}>
                <GoToNextPage />
              </div>
              <div style={{ padding: '0px 2px', marginLeft: 'auto' }}>
                <EnterFullScreen />
              </div>
              <div style={{ padding: '0px 2px' }}>
                <Download />
              </div>
              <div style={{ padding: '0px 2px' }}>
                <Print />
              </div>
              <div style={{ padding: '0px 2px' }}>
                <Rotate />
              </div>
              <div style={{ padding: '0px 2px' }}>
                <SwitchSelectionModeButton mode={SelectionMode.Hand} />
              </div>
              <div style={{ padding: '0px 2px' }}>
                <SwitchSelectionModeButton mode={SelectionMode.Text} />
              </div>
            </>
          )
        }}
      </Toolbar>
    </div>
  )

  const defaultLayoutPluginInstance = defaultLayoutPlugin({
    renderToolbar: customToolbar,
    sidebarTabs: defaultTabs => [
      // Remove the attachments tab (\`defaultTabs[2]\`)
      // defaultTabs[0], // Bookmarks tab
      defaultTabs[0], // Thumbnails tab
      defaultTabs[1]
    ]
  })
  const renderError = (error: LoadError) => {
    let message = ''
    switch (error.name) {
      case 'InvalidPDFException':
        message = 'El documento no es válido o está dañado'
        break
      case 'MissingPDFException':
        message = 'El documento no se encuentra disponible'
        break
      case 'UnexpectedResponseException':
        message = 'Respuesta inesperada del servidor'
        break
      default:
        message = 'No se puede cargar el documento'
        break
    }
    return (
      <div
        style={{
          alignItems: 'center',
          display: 'flex',
          height: '100%',
          justifyContent: 'center'
        }}
      >
        <div
          style={{
            backgroundColor: '#e53e3e',
            borderRadius: '0.25rem',
            color: '#fff',
            padding: '0.5rem'
          }}
        >
          {message}
        </div>
      </div>
    )
  }

  const { zoomTo } = zoomPluginInstance
zoomTo(SpecialZoomLevel.PageWidth)

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] min-w-[92vw] overflow-hidden">
        <DialogHeader className='-my-3'>
          <DialogTitle className={'flex flex-row justify-start items-center gap-3'}>
            <FaBookOpen size={18} />
            PDF Viewer
          </DialogTitle>
        </DialogHeader>
        <AspectRatio ratio={16 / 9} className='h-[91vh] w-full overflow-auto z-50 flex justify-center items-center'>
          <Worker workerUrl={`https://unpkg.com/pdfjs-dist@${pdfjsVersion}/build/pdf.worker.min.js`}>

            <div className='h-full w-full'>
              <Viewer
                localization={es_ES}
                fileUrl={urlBackend + urlPDF.attachment}
                defaultScale={1}
                renderError={renderError}
                plugins={[
                  defaultLayoutPluginInstance,
                  selectionModePluginInstance,
                  zoomPluginInstance
                ]}
              />
            </div>
          </Worker>
        </AspectRatio>
      </DialogContent>
    </Dialog>
  )
}

export default PDFViewer