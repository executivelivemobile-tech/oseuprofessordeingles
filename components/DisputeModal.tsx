
import React, { useState } from 'react';
import { Booking } from '../types';

interface DisputeModalProps {
    booking: Booking;
    onClose: () => void;
    onSubmit: (reason: string, description: string) => void;
}

export const DisputeModal: React.FC<DisputeModalProps> = ({ booking, onClose, onSubmit }) => {
    const [reason, setReason] = useState('NO_SHOW');
    const [description, setDescription] = useState('');

    const handleSubmit = () => {
        onSubmit(reason, description);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
            <div className="w-full max-w-md bg-gray-900 border border-red-500/50 rounded-2xl shadow-[0_0_50px_rgba(239,68,68,0.2)] overflow-hidden">
                <div className="bg-red-900/20 p-6 border-b border-red-500/30">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        Report an Issue
                    </h3>
                    <p className="text-red-300 text-xs mt-1">Disputes freeze payment until resolved by an Admin.</p>
                </div>

                <div className="p-6 space-y-4">
                    <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
                        <p className="text-gray-400 text-xs uppercase font-bold">Booking Reference</p>
                        <p className="text-white text-sm">Class with <span className="font-bold">{booking.teacherName}</span></p>
                        <p className="text-gray-500 text-xs">{new Date(booking.date).toLocaleDateString()} at {booking.timeSlot}</p>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-300 mb-2">Primary Issue</label>
                        <select 
                            value={reason} 
                            onChange={(e) => setReason(e.target.value)}
                            className="w-full bg-black/50 border border-gray-700 rounded-lg p-3 text-white focus:border-red-500 focus:outline-none"
                        >
                            <option value="NO_SHOW">Teacher didn't show up</option>
                            <option value="TECH_ISSUE">Technical/Connection Issues</option>
                            <option value="QUALITY">Quality / Behavior Concern</option>
                            <option value="OTHER">Other</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-300 mb-2">Description</label>
                        <textarea 
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full bg-black/50 border border-gray-700 rounded-lg p-3 text-white focus:border-red-500 focus:outline-none h-24 resize-none text-sm"
                            placeholder="Please describe what happened..."
                        ></textarea>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button 
                            onClick={onClose}
                            className="flex-1 bg-transparent hover:bg-gray-800 text-gray-400 font-bold py-3 rounded-xl border border-gray-700 transition-all"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={handleSubmit}
                            disabled={!description.trim()}
                            className="flex-1 bg-red-600 hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl shadow-lg transition-all"
                        >
                            Submit Report
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
