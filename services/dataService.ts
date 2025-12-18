
import { supabase } from './supabaseClient';
import { MOCK_TEACHERS, MOCK_COURSES, MOCK_BLOG_POSTS } from '../constants';
import { Teacher, Course, BlogPost, Transaction } from '../types';

// In-memory store for generated content & transactions (Simulating live DB updates)
let dynamicBlogPosts: BlogPost[] = [...MOCK_BLOG_POSTS];
let dynamicTransactions: Transaction[] = [
    { id: 'tx_p1', date: '2023-10-25', description: 'Payout: Sarah Connor', type: 'PAYOUT', grossAmount: 0, platformFee: 0, netAmount: -1200, status: 'PROCESSING' },
    { id: 'tx_p2', date: '2023-10-24', description: 'Payout: James Bond', type: 'PAYOUT', grossAmount: 0, platformFee: 0, netAmount: -850, status: 'PROCESSING' },
];

export const dataService = {
    async checkConnection() {
        if (!supabase) return false;
        try {
            const { error } = await supabase.from('profiles').select('count', { count: 'exact', head: true });
            return !error;
        } catch (e) {
            return false;
        }
    },

    async seedDatabase() {
        if (!supabase) throw new Error("Supabase not initialized");
        
        console.log("Starting production seed...");
        
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
        
        return { success: !teacherError && !courseError, error: teacherError || courseError };
    },

    async getTeachers(): Promise<Teacher[]> {
        if (!supabase) return MOCK_TEACHERS;
        const { data, error } = await supabase.from('teachers').select('*');
        if (error || !data || data.length === 0) return MOCK_TEACHERS;
        return data.map((t: any) => ({
            id: t.id, name: t.name, niche: t.niche || [], hourlyRate: t.hourly_rate,
            rating: t.rating, bio: t.bio, photoUrl: t.photo_url, verified: t.verified,
            location: t.location, accent: t.accent, reviewCount: 0, available: true
        }));
    },

    async getCourses(): Promise<Course[]> {
        if (!supabase) return MOCK_COURSES;
        const { data, error } = await supabase.from('courses').select('*');
        if (error || !data || data.length === 0) return MOCK_COURSES;
        return data.map((c: any) => ({
            id: c.id, title: c.title, instructorId: c.instructor_id, instructorName: 'Instructor',
            price: c.price, level: c.level, category: c.category, thumbnailUrl: c.thumbnail_url,
            description: c.description, duration: '10h', modules: 5
        }));
    },

    // --- BLOG PERSISTENCE (AI ENGINE LINK) ---
    async getBlogPosts(): Promise<BlogPost[]> {
        return dynamicBlogPosts;
    },

    async publishGeneratedPost(post: BlogPost) {
        dynamicBlogPosts = [post, ...dynamicBlogPosts];
        return { success: true };
    },

    // --- FINANCIAL OPERATIONS ---
    async getPendingPayouts() {
        return dynamicTransactions.filter(t => t.type === 'PAYOUT' && t.status === 'PROCESSING');
    },

    async processPayout(txId: string) {
        dynamicTransactions = dynamicTransactions.map(t => 
            t.id === txId ? { ...t, status: 'PAID' } : t
        );
        return { success: true };
    },

    async getAdminMetrics() {
        return {
            monthlyRevenue: 45230,
            takeRate: 9046,
            activeTeachers: MOCK_TEACHERS.filter(t => t.verified).length,
            pendingTeachers: MOCK_TEACHERS.filter(t => !t.verified).length,
            conversionRate: 3.2,
            cac: 45.00,
            activeStudents: 1240
        };
    }
};
