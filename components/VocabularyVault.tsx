
import React, { useState } from 'react';
import { VocabularyCard } from '../types';
import { generateVocabularyStory } from '../services/geminiService';

interface VocabularyVaultProps {
    vocabulary: VocabularyCard[];
    onBack: () => void;
    onUpdateCard: (id: string, newLevel: number) => void;
}

export const VocabularyVault: React.FC<VocabularyVaultProps> = ({ vocabulary, onBack, onUpdateCard }) => {
    const [activeTab, setActiveTab] = useState<'DECK' | 'TRAINING' | 'STORY'>('DECK');
    const [flippedCardId, setFlippedCardId] = useState<string | null>(null);
    const [currentStory, setCurrentStory] = useState<string | null>(null);
    const [isGeneratingStory, setIsGeneratingStory] = useState(false);

    // Filter for review (mock logic: review if mastery < 5)
    const reviewQueue = vocabulary.filter(v => v.masteryLevel < 5);
    const [currentReviewIndex, setCurrentReviewIndex] = useState(0);

    const handleGenerateStory = async () => {
        setIsGeneratingStory(true);
        // Pick 5 random words from the deck
        const shuffled = [...vocabulary].sort(() => 0.5 - Math.random());
        const selectedWords = shuffled.slice(0, 5).map(v => v.term);
        
        if (selectedWords.length === 0) {
            setCurrentStory("Your vault is empty. Add words to generate a story.");
            setIsGeneratingStory(false);
            return;
        }

        const story = await generateVocabularyStory(selectedWords);
        setCurrentStory(story);
        setIsGeneratingStory(false);
    };

    const handleRateCard = (rating: number) => { // 1 = hard, 3 = easy
        const card = reviewQueue[currentReviewIndex];
        // Simple SRS logic: increment mastery if easy, decrement if hard
        const newLevel = Math.min(5, Math.max(0, card.masteryLevel + (rating - 2))); 
        onUpdateCard(card.id, newLevel);
        
        setFlippedCardId(null);
        if (currentReviewIndex < reviewQueue.length - 1) {
            setCurrentReviewIndex(prev => prev + 1);
        } else {
            alert("Review session complete!");
            setActiveTab('DECK');
            setCurrentReviewIndex(0);
        }
    };

    return (
        <div className="min-h-screen pt-24 px-4 max-w-7xl mx-auto pb-20 flex flex-col h-[calc(100vh-20px)]">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <span className="w-3 h-3 bg-cyan-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(6,182,212,0.8)]"></span>
                        SMART VAULT
                    </h1>
                    <p className="text-gray-400 text-sm">Neural Memory Bank • {vocabulary.length} Items Stored</p>
                </div>
                <div className="flex gap-4">
                    <button 
                        onClick={() => setActiveTab('DECK')}
                        className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${activeTab === 'DECK' ? 'bg-cyan-600 text-white' : 'text-gray-400 hover:text-white bg-gray-900'}`}
                    >
                        Database
                    </button>
                    <button 
                        onClick={() => setActiveTab('TRAINING')}
                        className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${activeTab === 'TRAINING' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white bg-gray-900'}`}
                    >
                        Flashcards ({reviewQueue.length})
                    </button>
                    <button 
                        onClick={() => setActiveTab('STORY')}
                        className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${activeTab === 'STORY' ? 'bg-green-600 text-white' : 'text-gray-400 hover:text-white bg-gray-900'}`}
                    >
                        AI Story Mode
                    </button>
                    <button onClick={onBack} className="text-gray-500 hover:text-white flex items-center gap-2 transition-colors ml-4">
                        Exit
                    </button>
                </div>
            </div>

            <div className="flex-1 bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden relative">
                
                {/* DECK VIEW */}
                {activeTab === 'DECK' && (
                    <div className="p-6 overflow-y-auto h-full">
                        {vocabulary.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-gray-500">
                                <p>Vault Empty. Add words from Homework or Classes.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {vocabulary.map(card => (
                                    <div key={card.id} className="bg-gray-900 border border-gray-700 p-4 rounded-xl hover:border-cyan-500/50 transition-all group">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-lg font-bold text-white group-hover:text-cyan-400">{card.term}</h3>
                                            <span className={`text-[10px] px-2 py-0.5 rounded border ${
                                                card.origin === 'HOMEWORK' ? 'border-red-900 text-red-400 bg-red-900/20' :
                                                card.origin === 'SIMULATOR' ? 'border-purple-900 text-purple-400 bg-purple-900/20' :
                                                'border-blue-900 text-blue-400 bg-blue-900/20'
                                            }`}>
                                                {card.origin}
                                            </span>
                                        </div>
                                        <p className="text-gray-400 text-sm mb-3 line-clamp-2">{card.definition}</p>
                                        <div className="flex justify-between items-center text-xs">
                                            <span className="text-gray-500 italic">"{card.example}"</span>
                                            <div className="flex gap-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <div key={i} className={`w-1.5 h-1.5 rounded-full ${i < card.masteryLevel ? 'bg-green-500' : 'bg-gray-700'}`}></div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* TRAINING VIEW */}
                {activeTab === 'TRAINING' && (
                    <div className="flex flex-col items-center justify-center h-full p-8">
                        {reviewQueue.length > 0 ? (
                            <div className="w-full max-w-md perspective-1000">
                                <div 
                                    className={`relative w-full h-80 transition-transform duration-700 preserve-3d cursor-pointer ${flippedCardId === reviewQueue[currentReviewIndex].id ? 'rotate-y-180' : ''}`}
                                    onClick={() => setFlippedCardId(flippedCardId ? null : reviewQueue[currentReviewIndex].id)}
                                >
                                    {/* Front */}
                                    <div className="absolute inset-0 backface-hidden bg-gray-800 border-2 border-cyan-500/30 rounded-3xl flex flex-col items-center justify-center p-8 shadow-[0_0_30px_rgba(8,145,178,0.2)]">
                                        <p className="text-cyan-400 text-xs font-bold uppercase tracking-widest mb-4">Translate / Define</p>
                                        <h2 className="text-4xl font-bold text-white text-center">{reviewQueue[currentReviewIndex].term}</h2>
                                        <p className="text-gray-500 text-sm mt-8 absolute bottom-8">Click to Flip</p>
                                    </div>

                                    {/* Back */}
                                    <div className="absolute inset-0 backface-hidden rotate-y-180 bg-gray-900 border-2 border-purple-500/30 rounded-3xl flex flex-col items-center justify-center p-8 shadow-[0_0_30px_rgba(168,85,247,0.2)]">
                                        <p className="text-gray-300 text-center text-lg mb-4">{reviewQueue[currentReviewIndex].definition}</p>
                                        <p className="text-gray-500 italic text-sm text-center">"{reviewQueue[currentReviewIndex].example}"</p>
                                        
                                        <div className="flex gap-2 mt-8 w-full" onClick={(e) => e.stopPropagation()}>
                                            <button onClick={() => handleRateCard(1)} className="flex-1 bg-red-900/30 hover:bg-red-900/50 text-red-400 border border-red-800 py-2 rounded-lg text-sm font-bold">Hard</button>
                                            <button onClick={() => handleRateCard(2)} className="flex-1 bg-yellow-900/30 hover:bg-yellow-900/50 text-yellow-400 border border-yellow-800 py-2 rounded-lg text-sm font-bold">Good</button>
                                            <button onClick={() => handleRateCard(3)} className="flex-1 bg-green-900/30 hover:bg-green-900/50 text-green-400 border border-green-800 py-2 rounded-lg text-sm font-bold">Easy</button>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-center text-gray-500 mt-8 text-sm">
                                    Card {currentReviewIndex + 1} of {reviewQueue.length}
                                </p>
                            </div>
                        ) : (
                            <div className="text-center">
                                <div className="w-20 h-20 bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/30">
                                    <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">All Caught Up!</h3>
                                <p className="text-gray-400">You've reviewed all pending cards for today.</p>
                            </div>
                        )}
                    </div>
                )}

                {/* STORY MODE */}
                {activeTab === 'STORY' && (
                    <div className="p-8 h-full flex flex-col">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-white">Contextual Generator</h2>
                            <p className="text-gray-400 max-w-lg mx-auto mt-2">
                                Macley will weave 5 random words from your vault into a coherent narrative to help you understand nuance and usage.
                            </p>
                        </div>

                        <div className="flex-1 bg-black/40 border border-gray-700 rounded-xl p-8 overflow-y-auto mb-6 relative">
                            {isGeneratingStory ? (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                                        <p className="text-cyan-400 font-mono animate-pulse">Constructing Narrative...</p>
                                    </div>
                                </div>
                            ) : currentStory ? (
                                <div className="prose prose-invert max-w-none text-lg leading-relaxed text-gray-200">
                                    <div dangerouslySetInnerHTML={{ __html: currentStory.replace(/\*\*(.*?)\*\*/g, '<span class="text-cyan-400 font-bold">$1</span>') }} />
                                </div>
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-600 italic">
                                    Press the button below to generate a story.
                                </div>
                            )}
                        </div>

                        <div className="flex justify-center">
                            <button 
                                onClick={handleGenerateStory}
                                disabled={isGeneratingStory || vocabulary.length === 0}
                                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white px-8 py-4 rounded-xl font-bold shadow-lg transition-all disabled:opacity-50"
                            >
                                {isGeneratingStory ? 'Thinking...' : 'Generate New Story'}
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};
