
import React, { useRef, useState, useEffect } from 'react';

export const Whiteboard: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [color, setColor] = useState('#22d3ee'); // Default Cyan
    const [tool, setTool] = useState<'PEN' | 'ERASER'>('PEN');
    
    // Resize handler
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        // Initial setup
        const parent = canvas.parentElement;
        if (parent) {
            canvas.width = parent.clientWidth;
            canvas.height = parent.clientHeight;
        }

        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.lineWidth = 3;
        }
    }, []);

    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        setIsDrawing(true);
        const rect = canvas.getBoundingClientRect();
        ctx.beginPath();
        ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    };

    const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const rect = canvas.getBoundingClientRect();
        
        ctx.strokeStyle = tool === 'ERASER' ? '#111827' : color; // Eraser matches bg
        ctx.lineWidth = tool === 'ERASER' ? 20 : 3;
        
        ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
        ctx.stroke();
    };

    const stopDrawing = () => {
        setIsDrawing(false);
        // In a real app, we would emit the drawing data to the websocket here
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    };

    return (
        <div className="absolute inset-0 z-10 w-full h-full bg-gray-900/80 backdrop-blur-sm">
            <canvas
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                className="w-full h-full cursor-crosshair"
            />
            
            {/* Toolbar */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-gray-800 border border-gray-700 rounded-full px-4 py-2 flex items-center gap-4 shadow-xl">
                <button 
                    onClick={() => setTool('PEN')}
                    className={`p-2 rounded-full transition-colors ${tool === 'PEN' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'}`}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                </button>
                
                {/* Color Picker */}
                <div className="flex gap-1 border-l border-r border-gray-700 px-3">
                    {['#22d3ee', '#f472b6', '#a3e635', '#ffffff'].map(c => (
                        <button 
                            key={c}
                            onClick={() => { setColor(c); setTool('PEN'); }}
                            className={`w-5 h-5 rounded-full border-2 transition-transform hover:scale-110 ${color === c && tool === 'PEN' ? 'border-white scale-110' : 'border-transparent'}`}
                            style={{ backgroundColor: c }}
                        />
                    ))}
                </div>

                <button 
                    onClick={() => setTool('ERASER')}
                    className={`p-2 rounded-full transition-colors ${tool === 'ERASER' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'}`}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>

                <button 
                    onClick={clearCanvas}
                    className="text-xs font-bold text-red-400 hover:text-red-300 ml-2"
                >
                    CLEAR
                </button>
            </div>
        </div>
    );
};
