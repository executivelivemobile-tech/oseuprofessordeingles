
import React, { useState } from 'react';
import { BlogPost } from '../types';
import { MOCK_BLOG_POSTS } from '../constants';

interface BlogViewProps {
  onNavigatePost: (id: string) => void;
}

interface BlogPostViewProps {
    post: BlogPost;
    onBack: () => void;
}

export const BlogList: React.FC<BlogViewProps> = ({ onNavigatePost }) => {
  const [filter, setFilter] = useState('ALL');
  
  const filteredPosts = filter === 'ALL' 
    ? MOCK_BLOG_POSTS 
    : MOCK_BLOG_POSTS.filter(p => p.category === filter);

  const featuredPost = MOCK_BLOG_POSTS[0];

  return (
    <div className="min-h-screen pt-24 px-4 max-w-7xl mx-auto pb-20 animate-fade-in">
        <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">
                THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">FEED</span>
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                Insights on fluency, career growth, and the future of learning.
            </p>
        </div>

        {/* Featured Post */}
        <div 
            onClick={() => onNavigatePost(featuredPost.id)}
            className="group relative rounded-3xl overflow-hidden mb-16 border border-gray-800 cursor-pointer shadow-2xl"
        >
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10"></div>
            <img 
                src={featuredPost.imageUrl} 
                alt={featuredPost.title} 
                className="w-full h-[500px] object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute bottom-0 left-0 p-8 md:p-12 z-20 max-w-3xl">
                <span className="bg-cyan-600 text-white text-xs font-bold px-3 py-1 rounded uppercase tracking-wider mb-4 inline-block">
                    Featured • {featuredPost.category}
                </span>
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight group-hover:text-cyan-400 transition-colors">
                    {featuredPost.title}
                </h2>
                <p className="text-gray-300 text-lg mb-6 line-clamp-2">
                    {featuredPost.excerpt}
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                    <img src={`https://ui-avatars.com/api/?name=${featuredPost.author}&background=random`} className="w-8 h-8 rounded-full" alt="author" />
                    <span>{featuredPost.author}</span>
                    <span>•</span>
                    <span>{featuredPost.date}</span>
                    <span>•</span>
                    <span>{featuredPost.readTime}</span>
                </div>
            </div>
        </div>

        {/* Filters */}
        <div className="flex justify-center gap-4 mb-10 overflow-x-auto pb-2">
            {['ALL', 'CAREER', 'TIPS', 'CULTURE', 'PLATFORM'].map(cat => (
                <button 
                    key={cat}
                    onClick={() => setFilter(cat)}
                    className={`px-6 py-2 rounded-full text-sm font-bold transition-all border ${
                        filter === cat 
                        ? 'bg-white text-black border-white' 
                        : 'bg-black text-gray-400 border-gray-700 hover:border-gray-500 hover:text-white'
                    }`}
                >
                    {cat}
                </button>
            ))}
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map(post => (
                <div 
                    key={post.id}
                    onClick={() => onNavigatePost(post.id)}
                    className="group bg-gray-900/30 border border-gray-800 rounded-2xl overflow-hidden hover:border-cyan-500/30 transition-all cursor-pointer flex flex-col"
                >
                    <div className="h-48 overflow-hidden relative">
                        <img 
                            src={post.imageUrl} 
                            alt={post.title} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                         <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-xs text-white font-bold uppercase">
                            {post.category}
                        </div>
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors line-clamp-2">
                            {post.title}
                        </h3>
                        <p className="text-gray-400 text-sm mb-4 line-clamp-3 flex-1">
                            {post.excerpt}
                        </p>
                        <div className="flex justify-between items-center text-xs text-gray-500 border-t border-gray-800 pt-4 mt-auto">
                            <span>{post.date}</span>
                            <span>{post.readTime}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
};

export const BlogPostView: React.FC<BlogPostViewProps> = ({ post, onBack }) => {
    return (
        <div className="min-h-screen pt-24 pb-20 bg-black">
            {/* Reading Progress Bar (Mock) */}
            <div className="fixed top-20 left-0 w-full h-1 z-40 bg-gray-900">
                <div className="h-full bg-cyan-500 w-1/3"></div>
            </div>

            <article className="max-w-3xl mx-auto px-4 animate-slide-up">
                <button onClick={onBack} className="text-gray-500 hover:text-white mb-8 flex items-center gap-2 group">
                    <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Feed
                </button>

                <header className="mb-10 text-center">
                    <span className="text-cyan-400 font-bold tracking-widest text-xs uppercase mb-4 block">
                        {post.category} • {post.readTime}
                    </span>
                    <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                        {post.title}
                    </h1>
                    <div className="flex items-center justify-center gap-4">
                        <img src={`https://ui-avatars.com/api/?name=${post.author}&background=random`} className="w-10 h-10 rounded-full" alt="author" />
                        <div className="text-left">
                            <p className="text-white font-bold text-sm">{post.author}</p>
                            <p className="text-gray-500 text-xs">{post.date}</p>
                        </div>
                    </div>
                </header>

                <div className="rounded-2xl overflow-hidden mb-12 shadow-2xl border border-gray-800">
                    <img src={post.imageUrl} className="w-full h-auto" alt={post.title} />
                </div>

                <div 
                    className="prose prose-invert prose-lg max-w-none text-gray-300 leading-loose"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />

                <div className="mt-12 pt-8 border-t border-gray-800 flex justify-between items-center">
                    <p className="text-gray-500 text-sm">Share this article:</p>
                    <div className="flex gap-4">
                        <button className="text-gray-400 hover:text-cyan-400">Twitter</button>
                        <button className="text-gray-400 hover:text-cyan-400">LinkedIn</button>
                        <button className="text-gray-400 hover:text-cyan-400">Copy Link</button>
                    </div>
                </div>
                
                {/* CTA */}
                <div className="mt-16 bg-gradient-to-r from-cyan-900/20 to-blue-900/20 border border-cyan-500/30 rounded-2xl p-8 text-center">
                    <h3 className="text-2xl font-bold text-white mb-2">Ready to master English?</h3>
                    <p className="text-gray-400 mb-6">Join thousands of students and book a trial lesson today.</p>
                    <button className="bg-cyan-600 hover:bg-cyan-500 text-white px-8 py-3 rounded-xl font-bold shadow-lg transition-all">
                        Find a Teacher
                    </button>
                </div>
            </article>
        </div>
    );
};
