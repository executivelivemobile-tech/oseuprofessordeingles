
import React, { useState, useEffect } from 'react';
import { RoadmapNode } from '../types';
import { generateLearningPath } from '../services/geminiService';

interface LearningRoadmapProps {
    level: string;
    goal: string;
    onAction: (type: string) => void;
}

export const LearningRoadmap: React.FC<LearningRoadmapProps> = ({ level, goal, onAction }) => {
    const [nodes, setNodes] = useState<RoadmapNode[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadPath = async () => {
            const data = await generateLearningPath(level, goal);
            setNodes(data);
            setLoading(false);
        };
        loadPath();
    }, [level, goal]);

    if (loading) {
        return (
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 h-full flex flex-col items-center justify-center min-h-[300px]">
                <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-gray-400 text-sm animate-pulse">Macley is designing your custom path...</p>
            </div>
        );
    }

    return (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 h-full">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
                My Mission Roadmap
            </h3>
            
            <div className="relative pl-4 space-y-8">
                {/* Connector Line */}
                <div className="absolute top-2 left-[27px] bottom-10 w-0.5 bg-gray-800"></div>

                {nodes.map((node, idx) => (
                    <div key={idx} className={`relative flex items-start gap-4 group ${node.status === 'LOCKED' ? 'opacity-50 grayscale' : ''}`}>
                        {/* Icon Node */}
                        <div className={`relative z-10 flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center bg-gray-900 ${
                            node.status === 'COMPLETED' ? 'border-green-500 text-green-500' :
                            node.status === 'ACTIVE' ? 'border-cyan-500 text-cyan-500 shadow-[0_0_10px_rgba(34,211,238,0.5)]' :
                            'border-gray-700 text-gray-700'
                        }`}>
                            {node.status === 'COMPLETED' ? (
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                            ) : node.status === 'LOCKED' ? (
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
                            ) : (
                                <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></div>
                            )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 bg-gray-800/30 p-4 rounded-xl border border-gray-700/50 hover:border-gray-600 transition-all">
                            <h4 className={`font-bold text-sm ${node.status === 'ACTIVE' ? 'text-white' : 'text-gray-400'}`}>{node.title}</h4>
                            <p className="text-xs text-gray-500 mt-1 mb-3">{node.description}</p>
                            
                            {node.status !== 'LOCKED' && node.status !== 'COMPLETED' && (
                                <button 
                                    onClick={() => onAction(node.actionType)}
                                    className="text-xs bg-cyan-900/30 text-cyan-400 border border-cyan-800 px-3 py-1.5 rounded hover:bg-cyan-900/50 transition-colors font-bold"
                                >
                                    {node.actionLabel} →
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
