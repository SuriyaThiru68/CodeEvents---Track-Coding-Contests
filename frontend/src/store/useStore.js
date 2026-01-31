
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { fetchContests, fetchCFUser, fetchLCUser, fetchCodeChefUser, fetchAtCoderUser } from '../services/api';

export const useStore = create(
    persist(
        (set, get) => ({
            user: null,
            setUser: (user) => set({ user }),

            contests: [],
            lastFetch: null,
            isLoading: false,

            refreshContests: async () => {
                set({ isLoading: true });
                const liveContests = await fetchContests();
                set({
                    contests: liveContests.length > 0 ? liveContests : get().contests,
                    lastFetch: new Date().toISOString(),
                    isLoading: false
                });
            },

            attendedContests: [],
            missedContests: [],

            notes: [],
            setNotes: (notes) => set({ notes }),
            addNote: (note) => set((state) => ({ notes: [note, ...state.notes] })),
            updateNoteInStore: (id, updatedNote) => set((state) => ({
                notes: state.notes.map(n => n.id === id ? { ...n, ...updatedNote } : n)
            })),
            deleteNote: (id) => set((state) => ({ notes: state.notes.filter(n => n.id !== id) })),

            snippets: [
                { id: '1', title: 'Hello World JS', code: 'console.log("Hello World");', category: 'Basic', language: 'javascript' },
                { id: '2', title: 'Quick Sort C++', code: '#include <iostream>\nusing namespace std;\n\nint main() {\n  cout << "Sorting..." << endl;\n  return 0;\n}', category: 'Algorithms', language: 'cpp' },
            ],
            userProfiles: {
                codeforces: { username: '', rating: 0, rank: 'Unrated', contests: 0, solved: 0 },
                leetcode: { username: '', rating: 0, rank: 'Unrated', contests: 0, solved: 0 },
                atcoder: { username: '', rating: 0, rank: 'Unrated', contests: 0, solved: 0 },
                codechef: { username: '', rating: 0, rank: 'Unrated', contests: 0, solved: 0 },
            },

            syncPlatform: async (platform) => {
                const username = get().userProfiles[platform].username;
                if (!username) return;

                let data = null;
                if (platform === 'codeforces') {
                    data = await fetchCFUser(username);
                    if (data) {
                        set((state) => ({
                            userProfiles: {
                                ...state.userProfiles,
                                codeforces: { ...state.userProfiles.codeforces, rating: data.rating, rank: data.rank, solved: data.solved }
                            }
                        }));
                    }
                } else if (platform === 'leetcode') {
                    data = await fetchLCUser(username);
                    if (data) {
                        set((state) => ({
                            userProfiles: {
                                ...state.userProfiles,
                                leetcode: { ...state.userProfiles.leetcode, solved: data.solved, rank: `Rank: ${data.ranking}` }
                            }
                        }));
                    }
                } else if (platform === 'codechef') {
                    data = await fetchCodeChefUser(username);
                    if (data) {
                        set((state) => ({
                            userProfiles: {
                                ...state.userProfiles,
                                codechef: { ...state.userProfiles.codechef, rating: data.rating, solved: data.solved, rank: data.rank }
                            }
                        }));
                    }
                } else if (platform === 'atcoder') {
                    data = await fetchAtCoderUser(username);
                    if (data) {
                        set((state) => ({
                            userProfiles: {
                                ...state.userProfiles,
                                atcoder: { ...state.userProfiles.atcoder, rating: data.rating, solved: data.solved, rank: data.rank }
                            }
                        }));
                    }
                }
            },
            getTotalSolved: () => {
                const profiles = get().userProfiles;
                return Object.values(profiles).reduce((acc, curr) => acc + (curr.solved || 0), 0);
            },

            stats: {
                currentStreak: 14,
                maxStreak: 45,
                activityData: Array.from({ length: 365 }, (_, i) => Math.floor(Math.random() * 5)),
            },
            profileImage: null,
            setProfileImage: (img) => set({ profileImage: img }),
            updateProfile: (platform, data) => set((state) => ({
                userProfiles: { ...state.userProfiles, [platform]: { ...state.userProfiles[platform], ...data } }
            })),

            // Email digest preference
            emailDigest: true,
            toggleEmailDigest: () => set((state) => ({ emailDigest: !state.emailDigest })),
            setEmailDigest: (v) => set({ emailDigest: v }),
            addSnippet: (snippet) => set((state) => ({ snippets: [snippet, ...state.snippets] })),
            deleteSnippet: (id) => set((state) => ({ snippets: state.snippets.filter(s => s.id !== id) })),

            registerContest: (id) => set((state) => ({
                contests: state.contests.map(c => c.id === id ? { ...c, registered: true } : c)
            })),

            markAttended: (id, result) => set((state) => {
                const contest = state.contests.find(c => c.id === id);
                return {
                    contests: state.contests.filter(c => c.id !== id),
                    attendedContests: [{ ...contest, ...result, status: 'Attended' }, ...state.attendedContests]
                };
            }),

            markMissed: (id) => set((state) => {
                const contest = state.contests.find(c => c.id === id);
                return {
                    contests: state.contests.filter(c => c.id !== id),
                    missedContests: [{ ...contest, status: 'Missed' }, ...state.missedContests]
                };
            }),
        }),
        {
            name: 'codeevents-storage',
        }
    )
);
