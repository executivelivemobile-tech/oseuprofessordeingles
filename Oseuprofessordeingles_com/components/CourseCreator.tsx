import React, { useState } from 'react';
import { Course, CourseModule } from '../types';

interface CourseCreatorProps {
  instructorId: string;
  instructorName: string;
  onSubmit: (course: Course) => void;
  onCancel: () => void;
}

export const CourseCreator: React.FC<CourseCreatorProps> = ({ instructorId, instructorName, onSubmit, onCancel }) => {
  const [step, setStep] = useState(1);
  const [courseData, setCourseData] = useState<Partial<Course>>({
    title: '',
    description: '',
    price: 197,
    level: 'Beginner',
    category: 'General',
    thumbnailUrl: 'https://picsum.photos/seed/newcourse/400/225',
    features: ['Certificate of Completion', 'Mobile Access'],
    syllabus: []
  });

  const [currentModule, setCurrentModule] = useState<Partial<CourseModule>>({ title: '', lessons: [] });
  const [lessonInput, setLessonInput] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCourseData(prev => ({ ...prev, [name]: value }));
  };

  const addModule = () => {
    if (!currentModule.title) return;
    const newModule: CourseModule = {
        title: currentModule.title,
        duration: '1h 00m', // Mock duration
        lessons: currentModule.lessons || []
    };
    setCourseData(prev => ({
        ...prev,
        syllabus: [...(prev.syllabus || []), newModule]
    }));
    setCurrentModule({ title: '', lessons: [] });
  };

  const addLessonToModule = () => {
      if (!lessonInput) return;
      setCurrentModule(prev => ({
          ...prev,
          lessons: [...(prev.lessons || []), lessonInput]
      }));
      setLessonInput('');
  };

  const handlePublish = () => {
      const newCourse: Course = {
          id: `c${Date.now()}`,
          instructorId,
          instructorName,
          title: courseData.title || 'Untitled Course',
          description: courseData.description || '',
          price: Number(courseData.price),
          level: courseData.level as any,
          category: courseData.category || 'General',
          thumbnailUrl: courseData.thumbnailUrl || '',
          duration: `${(courseData.syllabus?.length || 1) * 2} hours`, // Mock logic
          modules: courseData.syllabus?.length || 0,
          syllabus: courseData.syllabus || [],
          features: courseData.features || []
      };
      onSubmit(newCourse);
  };

  return (
    <div className="min-h-screen pt-24 px-4 max-w-4xl mx-auto pb-20">
        <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-white">Course Studio</h1>
            <button onClick={onCancel} className="text-gray-400 hover:text-white">Exit</button>
        </div>

        <div className="flex gap-4 mb-8">
            <div className={`h-1 flex-1 rounded-full transition-colors ${step >= 1 ? 'bg-purple-600' : 'bg-gray-800'}`}></div>
            <div className={`h-1 flex-1 rounded-full transition-colors ${step >= 2 ? 'bg-purple-600' : 'bg-gray-800'}`}></div>
            <div className={`h-1 flex-1 rounded-full transition-colors ${step >= 3 ? 'bg-purple-600' : 'bg-gray-800'}`}></div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-2xl">
            
            {/* Step 1: Basic Info */}
            {step === 1 && (
                <div className="space-y-6 animate-fade-in">
                    <h2 className="text-xl font-bold text-white">Basic Information</h2>
                    
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Course Title</label>
                        <input 
                            name="title"
                            value={courseData.title}
                            onChange={handleChange}
                            className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:outline-none"
                            placeholder="e.g. Advanced Business English"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Description</label>
                        <textarea 
                            name="description"
                            value={courseData.description}
                            onChange={handleChange}
                            rows={4}
                            className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:outline-none"
                            placeholder="What will students learn?"
                        />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Price (BRL)</label>
                            <input 
                                type="number"
                                name="price"
                                value={courseData.price}
                                onChange={handleChange}
                                className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Level</label>
                            <select 
                                name="level"
                                value={courseData.level}
                                onChange={handleChange}
                                className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:outline-none"
                            >
                                <option value="Beginner">Beginner</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Advanced">Advanced</option>
                            </select>
                        </div>
                         <div>
                            <label className="block text-sm text-gray-400 mb-1">Category</label>
                            <select 
                                name="category"
                                value={courseData.category}
                                onChange={handleChange}
                                className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:outline-none"
                            >
                                <option value="General">General English</option>
                                <option value="Business">Business</option>
                                <option value="Tech">Tech / IT</option>
                                <option value="Travel">Travel</option>
                                <option value="Exam Prep">Exam Prep</option>
                            </select>
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Thumbnail URL</label>
                        <input 
                            name="thumbnailUrl"
                            value={courseData.thumbnailUrl}
                            onChange={handleChange}
                            className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:outline-none text-xs"
                        />
                    </div>

                    <div className="flex justify-end pt-4">
                        <button onClick={() => setStep(2)} className="bg-purple-600 hover:bg-purple-500 text-white px-8 py-3 rounded-xl font-bold transition-all">Next: Curriculum</button>
                    </div>
                </div>
            )}

            {/* Step 2: Curriculum */}
            {step === 2 && (
                <div className="space-y-6 animate-fade-in">
                    <h2 className="text-xl font-bold text-white">Build Curriculum</h2>
                    
                    {/* Existing Modules */}
                    <div className="space-y-4">
                        {courseData.syllabus?.map((mod, idx) => (
                            <div key={idx} className="bg-gray-800 border border-gray-700 rounded-xl p-4">
                                <h3 className="font-bold text-white mb-2">Module {idx + 1}: {mod.title}</h3>
                                <ul className="list-disc list-inside text-sm text-gray-400 pl-2">
                                    {mod.lessons.map((lesson, lIdx) => (
                                        <li key={lIdx}>{lesson}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    {/* Add New Module */}
                    <div className="bg-black/30 border border-gray-700 border-dashed rounded-xl p-6">
                        <h3 className="text-sm font-bold text-gray-300 mb-4">Add New Module</h3>
                        <div className="mb-4">
                            <input 
                                value={currentModule.title}
                                onChange={(e) => setCurrentModule(prev => ({ ...prev, title: e.target.value }))}
                                className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white text-sm"
                                placeholder="Module Title (e.g. Introduction)"
                            />
                        </div>
                        
                        {currentModule.title && (
                            <div className="ml-4 border-l-2 border-gray-700 pl-4">
                                <ul className="mb-2 space-y-1">
                                    {currentModule.lessons?.map((l, i) => (
                                        <li key={i} className="text-xs text-purple-400 flex items-center gap-2">
                                            <span>▶</span> {l}
                                        </li>
                                    ))}
                                </ul>
                                <div className="flex gap-2">
                                    <input 
                                        value={lessonInput}
                                        onChange={(e) => setLessonInput(e.target.value)}
                                        className="flex-1 bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white text-xs"
                                        placeholder="Lesson Title"
                                        onKeyDown={(e) => e.key === 'Enter' && addLessonToModule()}
                                    />
                                    <button onClick={addLessonToModule} className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded text-xs">Add Lesson</button>
                                </div>
                            </div>
                        )}

                        <button 
                            onClick={addModule}
                            disabled={!currentModule.title || (currentModule.lessons?.length || 0) === 0}
                            className="mt-4 w-full bg-purple-900/50 hover:bg-purple-800 text-purple-300 border border-purple-800 px-4 py-2 rounded text-sm disabled:opacity-50"
                        >
                            Save Module
                        </button>
                    </div>

                    <div className="flex justify-between pt-4">
                        <button onClick={() => setStep(1)} className="text-gray-400 hover:text-white">Back</button>
                        <button 
                            onClick={() => setStep(3)} 
                            className="bg-purple-600 hover:bg-purple-500 text-white px-8 py-3 rounded-xl font-bold transition-all"
                            disabled={!courseData.syllabus || courseData.syllabus.length === 0}
                        >
                            Next: Review
                        </button>
                    </div>
                </div>
            )}

            {/* Step 3: Review */}
            {step === 3 && (
                <div className="space-y-6 animate-fade-in">
                    <h2 className="text-xl font-bold text-white">Review & Publish</h2>
                    
                    <div className="flex gap-6 items-start bg-black/40 p-6 rounded-xl border border-gray-700">
                        <img src={courseData.thumbnailUrl} className="w-40 h-24 object-cover rounded-lg" alt="Thumbnail" />
                        <div>
                            <h3 className="text-2xl font-bold text-white">{courseData.title}</h3>
                            <p className="text-purple-400 font-bold text-lg">R$ {courseData.price}</p>
                            <p className="text-gray-400 text-sm mt-1">{courseData.description}</p>
                            <div className="flex gap-2 mt-2">
                                <span className="bg-gray-800 text-xs px-2 py-1 rounded text-gray-300">{courseData.level}</span>
                                <span className="bg-gray-800 text-xs px-2 py-1 rounded text-gray-300">{courseData.category}</span>
                                <span className="bg-gray-800 text-xs px-2 py-1 rounded text-gray-300">{courseData.syllabus?.length} Modules</span>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 bg-yellow-900/20 border border-yellow-800 rounded-xl text-sm text-yellow-200">
                        <p><strong>Warning:</strong> Once published, the course will be immediately available in the marketplace. Platform commission is 30% per sale.</p>
                    </div>

                    <div className="flex justify-between pt-4">
                        <button onClick={() => setStep(2)} className="text-gray-400 hover:text-white">Back</button>
                        <button 
                            onClick={handlePublish} 
                            className="bg-green-600 hover:bg-green-500 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(22,163,74,0.4)]"
                        >
                            Publish Course
                        </button>
                    </div>
                </div>
            )}

        </div>
    </div>
  );
};