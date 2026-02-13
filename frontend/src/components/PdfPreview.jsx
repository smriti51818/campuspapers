import { useState } from 'react'
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Download } from 'lucide-react'
import { Document, Page, pdfjs } from 'react-pdf'
import { downloadFile } from '../utils/download'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

export default function PdfPreview({ file, title, subtitle, onClose, paperId, onDownload }) {
    const [numPages, setNumPages] = useState(null)
    const [pageNumber, setPageNumber] = useState(1)
    const [scale, setScale] = useState(1.2)

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages)
    }

    const handleDownload = async () => {
        await downloadFile(file, `${title}.pdf`, paperId)
        if (onDownload) onDownload()
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in" style={{ background: 'rgba(9, 99, 126, 0.5)', backdropFilter: 'blur(8px)' }}>
            {/* Glass Modal */}
            <div className="glass-card-dark rounded-3xl w-full max-w-5xl max-h-[90vh] flex flex-col border-2 shadow-2xl overflow-hidden" style={{ borderColor: 'rgba(122, 178, 178, 0.3)' }}>
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: 'rgba(122, 178, 178, 0.2)' }}>
                    <div className="flex-1 min-w-0">
                        <h2 className="text-2xl font-bold text-white truncate">{title}</h2>
                        {subtitle && <p className="text-sm mt-1" style={{ color: '#F8FAFC' }}>{subtitle}</p>}
                    </div>
                    <button
                        onClick={onClose}
                        className="ml-4 w-10 h-10 rounded-xl glass-button text-white flex items-center justify-center transition-all border"
                        style={{ borderColor: 'rgba(122, 178, 178, 0.3)' }}
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* PDF Viewer */}
                <div className="flex-1 overflow-auto p-6 flex items-center justify-center" style={{ background: 'rgba(9, 99, 126, 0.3)' }}>
                    <Document
                        file={file}
                        onLoadSuccess={onDocumentLoadSuccess}
                        loading={
                            <div className="flex flex-col items-center gap-4 p-12">
                                <div className="w-16 h-16 border-4 rounded-full animate-spin" style={{ borderColor: 'rgba(235, 244, 246, 0.3)', borderTopColor: '#F8FAFC' }}></div>
                                <p className="text-white font-medium">Loading PDF...</p>
                            </div>
                        }
                        error={
                            <div className="glass-card rounded-2xl p-8 text-center border" style={{ borderColor: 'rgba(220, 53, 69, 0.5)' }}>
                                <div className="text-5xl mb-4">⚠️</div>
                                <p className="font-medium" style={{ color: '#dc3545' }}>Failed to load PDF</p>
                            </div>
                        }
                    >
                        <Page
                            pageNumber={pageNumber}
                            scale={scale}
                            className="shadow-2xl rounded-xl overflow-hidden"
                            renderTextLayer={true}
                            renderAnnotationLayer={true}
                        />
                    </Document>
                </div>

                {/* Controls */}
                <div className="p-6 border-t" style={{ borderColor: 'rgba(122, 178, 178, 0.2)', background: 'rgba(235, 244, 246, 0.1)' }}>
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                        {/* Navigation */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setPageNumber(p => Math.max(1, p - 1))}
                                disabled={pageNumber <= 1}
                                className="px-4 py-2 rounded-xl glass-button text-white font-semibold disabled:opacity-30 disabled:cursor-not-allowed transition-all border flex items-center gap-2"
                                style={{ borderColor: 'rgba(122, 178, 178, 0.3)' }}
                            >
                                <ChevronLeft className="w-4 h-4" />
                                Prev
                            </button>
                            <span className="px-4 py-2 rounded-xl glass-button text-white font-medium border" style={{ borderColor: 'rgba(122, 178, 178, 0.3)' }}>
                                {pageNumber} / {numPages || '?'}
                            </span>
                            <button
                                onClick={() => setPageNumber(p => Math.min(numPages, p + 1))}
                                disabled={pageNumber >= numPages}
                                className="px-4 py-2 rounded-xl glass-button text-white font-semibold disabled:opacity-30 disabled:cursor-not-allowed transition-all border flex items-center gap-2"
                                style={{ borderColor: 'rgba(122, 178, 178, 0.3)' }}
                            >
                                Next
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Zoom */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setScale(s => Math.max(0.5, s - 0.2))}
                                className="px-4 py-2 rounded-xl glass-button text-white font-semibold transition-all border flex items-center gap-2"
                                style={{ borderColor: 'rgba(122, 178, 178, 0.3)' }}
                            >
                                <ZoomOut className="w-4 h-4" />
                            </button>
                            <span className="px-4 py-2 rounded-xl glass-button text-white font-medium border" style={{ borderColor: 'rgba(122, 178, 178, 0.3)' }}>
                                {Math.round(scale * 100)}%
                            </span>
                            <button
                                onClick={() => setScale(s => Math.min(3, s + 0.2))}
                                className="px-4 py-2 rounded-xl glass-button text-white font-semibold transition-all border flex items-center gap-2"
                                style={{ borderColor: 'rgba(122, 178, 178, 0.3)' }}
                            >
                                <ZoomIn className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Download */}
                        <button
                            onClick={handleDownload}
                            className="px-6 py-2 rounded-xl text-white font-bold transition-all shadow-lg transform hover:scale-105 flex items-center gap-2"
                            style={{ background: '#6366F1' }}
                        >
                            <Download className="w-4 h-4" />
                            Download
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
