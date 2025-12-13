
import React, { useState, useMemo, useEffect } from 'react';
import { Teacher, Course } from '../types';
import { TeacherCard, CourseCard } from './Cards';

interface MarketplaceProps {
    type: 'teacher' | 'course';
    items: (Teacher | Course)[];
    onNavigate: (id: string) => void;
    favoriteIds: string[];
    onToggleFavorite: (id: string) => void;
    // Props for AI Control
    initialNiche?: string;
    initialMaxPrice?: number;
    initialLevel?: string;
    initialCategory?: string;
    initialQuery?: string;
    language: 'EN' | 'PT';
}

export const Marketplace: React.FC<MarketplaceProps> = ({ 
    type, 
    items, 
    onNavigate, 
    favoriteIds, 
    onToggleFavorite,
    initialNiche,
    initialMaxPrice,
    initialLevel,
    initialCategory,
    initialQuery,
    language
}) => {
    // Search State
    const [searchQuery, setSearchQuery] = useState('');
    
    // Teacher Filters
    const [selectedNiche, setSelectedNiche] = useState('All');
    const [maxHourlyRate, setMaxHourlyRate] = useState(300);
    const [verifiedOnly, setVerifiedOnly] = useState(false);
    
    // Course Filters
    const [selectedLevel, setSelectedLevel] = useState('All');
    const [selectedCategory, setSelectedCategory] = useState('All');

    const isPT = language === 'PT';

    // Effect to update filters when AI props change
    useEffect(() => {
        if (initialQuery) setSearchQuery(initialQuery);
        if (initialNiche) setSelectedNiche(initialNiche);
        if (initialMaxPrice) setMaxHourlyRate(initialMaxPrice);
        if (initialLevel) setSelectedLevel(initialLevel);
        if (initialCategory) setSelectedCategory(initialCategory);
    }, [initialNiche, initialMaxPrice, initialLevel, initialCategory, initialQuery]);

    // Derived Data (Niches/Categories from items)
    const uniqueNiches = useMemo(() => {
        if (type !== 'teacher') return [];
        const allNiches = (items as Teacher[]).flatMap(t => t.niche);
        return ['All', ...Array.from(new Set(allNiches))];
    }, [items, type]);

    const uniqueCategories = useMemo(() => {
        if (type !== 'course') return [];
        const allCats = (items as Course[]).map(c => c.category);
        return ['All', ...Array.from(new Set(allCats))];
    }, [items, type]);

    // Filtering Logic
    const filteredItems = useMemo(() => {
        return items.filter(item => {
            // Text Search (Common)
            const matchesSearch = 
                ('name' in item ? item.name : item.title).toLowerCase().includes(searchQuery.toLowerCase()) ||
                ('bio' in item ? item.bio : item.description).toLowerCase().includes(searchQuery.toLowerCase());

            if (!matchesSearch) return false;

            if (type === 'teacher') {
                const t = item as Teacher;
                if (verifiedOnly && !t.verified) return false;
                if (t.hourlyRate > maxHourlyRate) return false;
                if (selectedNiche !== 'All' && !t.niche.includes(selectedNiche)) return false;
            } else {
                const c = item as Course;
                if (selectedLevel !== 'All' && c.level !== selectedLevel) return false;
                if (selectedCategory !== 'All' && c.category !== selectedCategory) return false;
            }

            return true;
        });
    }, [items, type, searchQuery, selectedNiche, maxHourlyRate, verifiedOnly, selectedLevel, selectedCategory]);

    return (
        <div className="min-h-screen pt-24 px-4 max-w-7xl mx-auto pb-20">
            <div className="mb-10 text-center">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                    {type === 'teacher' 
                        ? (isPT ? 'Encontre seu Mentor Ideal' : 'Find Your Perfect Mentor') 
                        : (isPT ? 'Biblioteca Premium' : 'Premium Knowledge Library')}
                </h2>
                <p className="text-gray-400 max-w-2xl mx-auto">
                    {type === 'teacher' 
                        ? (isPT ? 'Conecte-se com profissionais verificados para sessões personalizadas.' : 'Connect with verified professionals for 1:1 tailored sessions.') 
                        : (isPT ? 'Cursos selecionados para acelerar sua fluência e carreira.' : 'Curated courses designed to accelerate your fluency and career.')}
                </p>
            </div>

            {/* Filter Bar */}
            <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-6 mb-10 backdrop-blur-sm sticky top-24 z-30 shadow-2xl">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
                    
                    {/* Search Input */}
                    <div className="md:col-span-4">
                        <label className="block text-xs text-gray-500 uppercase font-bold mb-2">{isPT ? 'Buscar' : 'Search'}</label>
                        <div className="relative">
                            <input 
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder={type === 'teacher' 
                                    ? (isPT ? "Nome, nicho ou palavra-chave..." : "Name, niche, or keyword...") 
                                    : (isPT ? "Título do curso ou tópico..." : "Course title or topic...")}
                                className="w-full bg-black/50 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white focus:border-cyan-500 focus:outline-none transition-colors"
                            />
                            <svg className="w-5 h-5 text-gray-500 absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </div>
                    </div>

                    {/* Dynamic Filters */}
                    {type === 'teacher' ? (
                        <>
                            <div className="md:col-span-3">
                                <label className="block text-xs text-gray-500 uppercase font-bold mb-2">{isPT ? 'Nicho' : 'Niche'}</label>
                                <select 
                                    value={selectedNiche} 
                                    onChange={(e) => setSelectedNiche(e.target.value)}
                                    className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-cyan-500 focus:outline-none appearance-none"
                                >
                                    {uniqueNiches.map(n => <option key={n} value={n}>{n === 'All' && isPT ? 'Todos' : n}</option>)}
                                </select>
                            </div>
                            <div className="md:col-span-3">
                                <label className="block text-xs text-gray-500 uppercase font-bold mb-2">{isPT ? 'Preço Máx' : 'Max Price'}: R$ {maxHourlyRate}</label>
                                <input 
                                    type="range" 
                                    min="50" 
                                    max="500" 
                                    step="10"
                                    value={maxHourlyRate}
                                    onChange={(e) => setMaxHourlyRate(Number(e.target.value))}
                                    className="w-full accent-cyan-500"
                                />
                            </div>
                            <div className="md:col-span-2 flex items-center h-[50px]">
                                <label className="flex items-center gap-2 cursor-pointer select-none">
                                    <input 
                                        type="checkbox" 
                                        checked={verifiedOnly} 
                                        onChange={(e) => setVerifiedOnly(e.target.checked)}
                                        className="w-5 h-5 bg-black border-gray-700 rounded focus:ring-cyan-500 text-cyan-600"
                                    />
                                    <span className="text-white text-sm font-bold">{isPT ? 'Verificados' : 'Verified Only'}</span>
                                </label>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="md:col-span-3">
                                <label className="block text-xs text-gray-500 uppercase font-bold mb-2">{isPT ? 'Nível' : 'Level'}</label>
                                <select 
                                    value={selectedLevel} 
                                    onChange={(e) => setSelectedLevel(e.target.value)}
                                    className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:outline-none appearance-none"
                                >
                                    <option value="All">{isPT ? 'Todos os Níveis' : 'All Levels'}</option>
                                    <option value="Beginner">Beginner</option>
                                    <option value="Intermediate">Intermediate</option>
                                    <option value="Advanced">Advanced</option>
                                </select>
                            </div>
                            <div className="md:col-span-3">
                                <label className="block text-xs text-gray-500 uppercase font-bold mb-2">{isPT ? 'Categoria' : 'Category'}</label>
                                <select 
                                    value={selectedCategory} 
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:outline-none appearance-none"
                                >
                                    {uniqueCategories.map(c => <option key={c} value={c}>{c === 'All' && isPT ? 'Todas' : c}</option>)}
                                </select>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Results Grid */}
            {filteredItems.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in">
                    {filteredItems.map(item => {
                        const isFav = favoriteIds.includes(item.id);
                        if (type === 'teacher') {
                            return (
                                <TeacherCard 
                                    key={item.id} 
                                    teacher={item as Teacher} 
                                    onClick={() => onNavigate(item.id)}
                                    isFavorite={isFav}
                                    onToggleFavorite={(e) => { e.stopPropagation(); onToggleFavorite(item.id); }}
                                />
                            );
                        } else {
                            return (
                                <CourseCard 
                                    key={item.id} 
                                    course={item as Course} 
                                    onClick={() => onNavigate(item.id)}
                                    isFavorite={isFav}
                                    onToggleFavorite={(e) => { e.stopPropagation(); onToggleFavorite(item.id); }}
                                />
                            );
                        }
                    })}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 border border-gray-800 border-dashed rounded-2xl bg-gray-900/20">
                    <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mb-6">
                        <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">{isPT ? 'Nenhum resultado' : 'No results found'}</h3>
                    <p className="text-gray-500 mb-6">{isPT ? 'Tente ajustar seus filtros ou termos de busca.' : 'Try adjusting your filters or search terms.'}</p>
                    <button className="text-cyan-400 hover:text-white font-bold flex items-center gap-2">
                        {isPT ? 'Pedir sugestão ao Macley' : 'Ask Macley for suggestions'} <span className="text-xl">↘</span>
                    </button>
                </div>
            )}
        </div>
    );
};
