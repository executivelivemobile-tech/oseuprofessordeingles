
import React, { useState, useEffect } from 'react';
import { BlogPost } from '../types';
import { dataService } from '../services/dataService';

interface BlogViewProps {
  onNavigatePost: (id: string) => void;
}

interface BlogPostViewProps {
    post: BlogPost;
    onBack: () => void;
}

export const BlogList: React.FC<BlogViewProps> = ({ onNavigatePost }) => {
  const [filter, setFilter] = useState('ALL');
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
      dataService.getBlogPosts().then(res => {
          setPosts(res);
          setIsLoading(false);
      });
  }, []);

  const filteredPosts = filter === 'ALL' 
    ? posts 
    : posts.filter(p => p.category === filter);

  const featuredPost = posts[0];

  if (isLoading) {
      return (
          <div className="min-h-screen pt-24 px-4 flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
      );
  }

  return (
    <div className="min-h-screen pt-24 px-4 max-w-7xl mx-auto pb-20 animate-fade-in">
        <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight uppercase font-orbitron">
                THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">KNOWLEDGE_FEED</span>
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                Insights sobre fluência, carreira e o futuro do aprendizado gerados por IA e editados por especialistas.
            </p>
        </div>

        {/* Featured Post */}
        {featuredPost && (
            <div 
                onClick={() => onNavigatePost(featuredPost.id)}
                className="group relative rounded-3xl overflow-hidden mb-16 border border-gray-800 cursor-pointer shadow-2xl transition-all hover:border-cyan-500/30"
            >
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10"></div>
                <img 
                    src={featuredPost.imageUrl} 
                    alt={featuredPost.title} 
                    className="w-full h-[500px] object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute bottom-0 left-0 p-8 md:p-12 z-20 max-w-3xl">
                    <span className="bg-cyan-600 text-white text-[10px] font-bold px-3 py-1 rounded uppercase tracking-wider mb-4 inline-block">
                        Featured • {featuredPost.category}
                    </span>
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight group-hover:text-cyan-400 transition-colors">
                        {featuredPost.title}
                    </h2>
                    <p className="text-gray-300 text-lg mb-6 line-clamp-2 italic">
                        "{featuredPost.excerpt}"
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                        <img src={`https://ui-avatars.com/api/?name=${featuredPost.author}&background=random`} className="w-8 h-8 rounded-full" alt="author" />
                        <span className="font-bold text-white">{featuredPost.author}</span>
                        <span>•</span>
                        <span>{featuredPost.date}</span>
                        <span>•</span>
                        <span className="font-mono">{featuredPost.readTime}</span>
                    </div>
                </div>
            </div>
        )}

        {/* Filters */}
        <div className="flex justify-center gap-4 mb-10 overflow-x-auto pb-2 no-scrollbar">
            {['ALL', 'CAREER', 'TIPS', 'CULTURE', 'PLATFORM'].map(cat => (
                <button 
                    key={cat}
                    onClick={() => setFilter(cat)}
                    className={`px-6 py-2 rounded-full text-[10px] font-black tracking-widest transition-all border ${
                        filter === cat 
                        ? 'bg-cyan-600 text-white border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.4)]' 
                        : 'bg-black text-gray-500 border-gray-800 hover:border-gray-600 hover:text-white'
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
                         <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[10px] text-white font-bold uppercase border border-white/10">
                            {post.category}
                        </div>
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors line-clamp-2">
                            {post.title}
                        </h3>
                        <p className="text-gray-400 text-sm mb-4 line-clamp-3 flex-1 leading-relaxed">
                            {post.excerpt}
                        </p>
                        <div className="flex justify-between items-center text-[10px] text-gray-500 border-t border-gray-800 pt-4 mt-auto font-mono">
                            <span>{post.date}</span>
                            <span>{post.readTime} READ</span>
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
            <div className="fixed top-20 left-0 w-full h-0.5 z-40 bg-gray-900">
                <div className="h-full bg-cyan-500 animate-[progress_2s_ease-out]"></div>
            </div>

            <article className="max-w-3xl mx-auto px-4 animate-slide-up">
                <button onClick={onBack} className="text-gray-500 hover:text-white mb-8 flex items-center gap-2 group text-xs font-bold uppercase tracking-widest">
                    <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Feed
                </button>

                <header className="mb-10 text-center">
                    <span className="text-cyan-400 font-black tracking-[0.2em] text-[10px] uppercase mb-4 block">
                        {post.category} • {post.readTime}
                    </span>
                    <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight font-orbitron">
                        {post.title}
                    </h1>
                    <div className="flex items-center justify-center gap-4">
                        <img src={`https://ui-avatars.com/api/?name=${post.author}&background=random`} className="w-10 h-10 rounded-full border border-gray-700" alt="author" />
                        <div className="text-left">
                            <p className="text-white font-bold text-sm">{post.author}</p>
                            <p className="text-gray-500 text-xs font-mono">{post.date}</p>
                        </div>
                    </div>
                </header>

                <div className="rounded-3xl overflow-hidden mb-12 shadow-2xl border border-gray-800">
                    <img src={post.imageUrl} className="w-full h-auto" alt={post.title} />
                </div>

                <div 
                    className="prose prose-invert prose-lg max-w-none text-gray-300 leading-loose font-medium"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />

                {/* Shared Footer */}
                <div className="mt-16 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Transmit this knowledge:</p>
                    <div className="flex gap-4">
                        <button className="bg-gray-900 border border-gray-800 p-3 rounded-xl hover:text-cyan-400 transition-colors"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg></button>
                        <button className="bg-gray-900 border border-gray-800 p-3 rounded-xl hover:text-cyan-400 transition-colors"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg></button>
                    </div>
                </div>
                
                {/* CTA */}
                <div className="mt-16 bg-gradient-to-r from-gray-900 to-black border border-gray-800 rounded-3xl p-10 text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-600/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                    <h3 className="text-3xl font-bold text-white mb-4 relative z-10 font-orbitron">ESTÁ PRONTO PARA A FLUÊNCIA?</h3>
                    <p className="text-gray-400 mb-8 max-w-md mx-auto relative z-10 leading-relaxed">
                        Junte-se a centenas de profissionais de tecnologia e acelere sua carreira com nossos mentores de elite.
                    </p>
                    <button className="bg-cyan-600 hover:bg-cyan-500 text-white px-10 py-4 rounded-2xl font-black shadow-lg transition-all transform hover:scale-105 uppercase tracking-widest text-xs">
                        Agendar Aula Experimental
                    </button>
                </div>
            </article>
        </div>
    );
};
