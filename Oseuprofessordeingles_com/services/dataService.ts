
import { supabase } from './supabaseClient';
import { MOCK_TEACHERS, MOCK_COURSES } from '../constants';
import { Teacher, Course } from '../types';

export const dataService = {
    // Check if we are connected to Supabase
    async checkConnection() {
        if (!supabase) return false;
        try {
            const { error } = await supabase.from('profiles').select('count', { count: 'exact', head: true });
            return !error;
        } catch (e) {
            return false;
        }
    },

    // Seed the database with our Mock Data (so the app isn't empty)
    async seedDatabase() {
        if (!supabase) throw new Error("Supabase not initialized");

        // 1. Seed Teachers
        const dbTeachers = MOCK_TEACHERS.map(t => ({
            id: t.id,
            name: t.name,
            niche: t.niche,
            hourly_rate: t.hourlyRate,
            rating: t.rating,
            bio: t.bio,
            photo_url: t.photoUrl,
            verified: t.verified,
            location: t.location,
            accent: t.accent
        }));

        const { error: teacherError } = await supabase.from('teachers').upsert(dbTeachers);
        if (teacherError) console.error("Teacher Seed Error:", teacherError);

        // 2. Seed Courses
        const dbCourses = MOCK_COURSES.map(c => ({
            id: c.id,
            title: c.title,
            instructor_id: c.instructorId,
            price: c.price,
            level: c.level,
            category: c.category,
            thumbnail_url: c.thumbnailUrl,
            description: c.description
        }));

        const { error: courseError } = await supabase.from('courses').upsert(dbCourses);
        if (courseError) console.error("Course Seed Error:", courseError);

        return { success: !teacherError && !courseError };
    },

    // Fetch Teachers (Real Data)
    async getTeachers(): Promise<Teacher[]> {
        if (!supabase) return MOCK_TEACHERS;
        
        const { data, error } = await supabase.from('teachers').select('*');
        if (error || !data || data.length === 0) return MOCK_TEACHERS;

        return data.map((t: any) => ({
            id: t.id,
            name: t.name,
            niche: t.niche || [],
            hourlyRate: t.hourly_rate,
            rating: t.rating,
            bio: t.bio,
            photoUrl: t.photo_url,
            verified: t.verified,
            location: t.location,
            accent: t.accent,
            reviewCount: 0, // Placeholder
            available: true
        }));
    },

    // Fetch Courses (Real Data)
    async getCourses(): Promise<Course[]> {
        if (!supabase) return MOCK_COURSES;

        const { data, error } = await supabase.from('courses').select('*');
        if (error || !data || data.length === 0) return MOCK_COURSES;

        return data.map((c: any) => ({
            id: c.id,
            title: c.title,
            instructorId: c.instructor_id,
            instructorName: 'Instructor', // simplified for list view
            price: c.price,
            level: c.level,
            category: c.category,
            thumbnailUrl: c.thumbnail_url,
            description: c.description,
            duration: '10h', // placeholder
            modules: 5 // placeholder
        }));
    }
};
