import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { downloadFile } from '../utils/download';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Using a reliable worker source
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const PdfPreview = ({ file, title, onClose, subtitle, paperId, onDownload }) => {
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [scale, setScale] = useState(1.0);
    const [loading, setLoading] = useState(true);

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
        setLoading(false);
    }

    // Handle keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowRight') setPageNumber(p => Math.min(numPages || p, p + 1));
            if (e.key === 'ArrowLeft') setPageNumber(p => Math.max(1, p - 1));
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose, numPages]);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
            <div className="flex flex-col w-full h-full max-w-[1400px] lg:h-[95vh] lg:w-[95vw] bg-[#1a1a1a] lg:rounded-2xl shadow-2xl overflow-hidden border border-white/10">

                {/* Header - ChatGPT Style */}
                <div className="flex items-center justify-between px-6 py-4 bg-[#262626] border-b border-white/5">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-xl shadow-lg shadow-indigo-500/20">
                            📄
                        </div>
                        <div className="flex flex-col">
                            <h3 className="font-semibold text-gray-100 text-lg leading-tight truncate max-w-[300px] md:max-w-md">
                                {title || 'Document Preview'}
                            </h3>
                            {subtitle && <p className="text-xs text-gray-400 font-medium">{subtitle}</p>}
                        </div>
                    </div>

                    {/* Controls - Center Desktop */}
                    <div className="hidden md:flex items-center gap-4 bg-[#1a1a1a]/50 px-4 py-2 rounded-xl border border-white/5">
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setPageNumber(p => Math.max(1, p - 1))}
                                disabled={pageNumber <= 1}
                                className="p-1.5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white disabled:opacity-20 transition-all"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                            </button>
                            <span className="text-sm font-medium text-gray-300 min-w-[60px] text-center">
                                {pageNumber} / {numPages || '--'}
                            </span>
                            <button
                                onClick={() => setPageNumber(p => Math.min(numPages || p, p + 1))}
                                disabled={pageNumber >= (numPages || 1)}
                                className="p-1.5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white disabled:opacity-20 transition-all"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                            </button>
                        </div>

                        <div className="w-px h-4 bg-white/10 mx-2" />

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setScale(s => Math.max(0.5, s - 0.1))}
                                className="p-1.5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-all"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" /></svg>
                            </button>
                            <span className="text-sm font-medium text-gray-300 min-w-[45px] text-center">
                                {Math.round(scale * 100)}%
                            </span>
                            <button
                                onClick={() => setScale(s => Math.min(2, s + 0.1))}
                                className="p-1.5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-all"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={async () => {
                                await downloadFile(file, title ? `${title}.pdf` : 'paper.pdf', paperId);
                                if (onDownload) onDownload();
                            }}
                            className="hidden sm:flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition-all shadow-lg shadow-indigo-500/20"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                            Download
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/10 rounded-xl text-gray-400 hover:text-white transition-all"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                </div>

                {/* PDF Container */}
                <div className="flex-1 overflow-auto bg-[#121212] flex flex-col items-center p-4 md:p-8 scroll-smooth scrollbar-thin scrollbar-thumb-white/10 hover:scrollbar-thumb-white/20">
                    <div className="relative group">
                        <Document
                            file={file}
                            onLoadSuccess={onDocumentLoadSuccess}
                            loading={
                                <div className="flex flex-col items-center justify-center min-h-[500px] text-gray-400 gap-4">
                                    <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
                                    <p className="font-medium animate-pulse">Initializing Secure Preview...</p>
                                </div>
                            }
                            error={
                                <div className="flex flex-col items-center justify-center min-h-[400px] bg-[#1a1a1a] border border-white/5 rounded-2xl p-12 text-center max-w-md mx-4">
                                    <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 text-4xl mb-6">⚠️</div>
                                    <h3 className="text-xl font-bold text-white mb-2">Display Unavailable</h3>
                                    <p className="text-gray-400 mb-8 leading-relaxed">This PDF cannot be previewed directly. You can try opening it in a new window or downloading it.</p>
                                    <div className="flex flex-col w-full gap-3">
                                        <a
                                            href={file}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="w-full py-3 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-xl transition-all border border-white/10"
                                        >
                                            Open in New Tab
                                        </a>
                                        <button
                                            onClick={onClose}
                                            className="w-full py-3 text-gray-500 hover:text-gray-300 font-medium transition-all"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            }
                        >
                            <Page
                                pageNumber={pageNumber}
                                scale={scale * (window.innerWidth < 768 ? 0.8 : 1.2)}
                                renderTextLayer={true}
                                renderAnnotationLayer={true}
                                className="shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-transform duration-300 ease-out rounded-sm"
                            />
                        </Document>

                        {/* Quick Actions Hover Overlay (Mobile/Brief) */}
                        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 md:hidden flex items-center gap-4 bg-black/60 backdrop-blur-xl border border-white/10 px-6 py-3 rounded-2xl shadow-2xl z-[110]">
                            <button onClick={() => setPageNumber(p => Math.max(1, p - 1))} className="text-white">◀</button>
                            <span className="text-white text-sm font-bold">{pageNumber} / {numPages || '?'}</span>
                            <button onClick={() => setPageNumber(p => Math.min(numPages || p, p + 1))} className="text-white">▶</button>
                        </div>
                    </div>
                </div>

                {/* Footer info */}
                <div className="hidden md:flex items-center justify-center gap-3 py-3 bg-[#1a1a1a] border-t border-white/5 text-[11px] font-medium text-gray-500 uppercase tracking-widest">
                    <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" /> Encrypted Content</span>
                    <span className="text-white/10">|</span>
                    <span>CampusPapers Secure Preview v2.0</span>
                </div>
            </div>
        </div>
    );
};

export default PdfPreview;
