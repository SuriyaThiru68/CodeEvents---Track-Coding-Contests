
const KONTESTS_API = 'https://kontests.net/api/v1/all';
const CF_USER_API = 'https://codeforces.com/api/user.info?handles=';
const CF_STATUS_API = 'https://codeforces.com/api/user.status?handle=';
const LC_USER_API = 'https://leetcode-stats-api.herokuapp.com/';
const CODECHEF_API = 'https://codechef-api.vercel.app/'; // Unofficial but popular
const ATCODER_API = 'https://kenkoooo.com/atcoder/atcoder-api/v3/user/info?user=';

const CLIST_API_URL = 'https://clist.by/api/v4/contest/';
const CLIST_KEY = 'ApiKey alighter:11de134ba4e27ba11733cbefc077f4183eaf08f8';

const BACKEND_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:4000'
    : 'https://codeevents-tracking.onrender.com';

const ALLOWED_RESOURCES = [
    'leetcode.com',
    'codechef.com',
    'codeforces.com',
    'atcoder.jp',
    'codingninjas.com',
    'hackerrank.com',
    'basecamp.com'
];

export const fetchContests = async () => {
    try {
        const resourceFilter = ALLOWED_RESOURCES.join(',');
        console.log('Fetching contests with filter:', resourceFilter);
        let response = await fetch(`${CLIST_API_URL}?upcoming=true&order_by=start&limit=200&resource__in=${resourceFilter}`, {
            headers: { 'Authorization': CLIST_KEY }
        });

        // Fallback if host filter causes 400
        if (!response.ok && response.status === 400) {
            console.warn('Host filter failed, falling back to all upcoming contests');
            response = await fetch(`${CLIST_API_URL}?upcoming=true&order_by=start&limit=200`, {
                headers: { 'Authorization': CLIST_KEY }
            });
        }

        if (!response.ok) {
            console.error('Clist API error:', response.status, response.statusText);
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log('Clist data received:', data.objects?.length || 0, 'items');
        if (data.objects?.length > 0) {
            console.log('First contest structure sample:', JSON.stringify(data.objects[0], null, 2));
        }

        return data.objects
            .map((c, index) => ({
                id: c.id || index,
                name: c.event,
                platform: normalizePlatform(c.host || c.resource?.name || c.resource || 'Unknown'),
                url: c.href,
                date: c.start,
                end: c.end,
                duration: formatDuration(c.duration),
                status: 'upcoming',
                difficulty: 'Mixed'
            }));
    } catch (error) {
        console.error('Error fetching contests:', error);
        return [];
    }
};

const isEnglish = (text) => {
    // Permissive check to allow special characters and non-ASCII dashes used in contest names
    return true;
};


const normalizePlatform = (resource) => {
    const r = resource.toLowerCase();
    if (r.includes('codeforces')) return 'Codeforces';
    if (r.includes('leetcode')) return 'LeetCode';
    if (r.includes('atcoder')) return 'AtCoder';
    if (r.includes('codechef')) return 'CodeChef';
    if (r.includes('codingninjas')) return 'CodingNinjas';
    if (r.includes('hackerrank')) return 'HackerRank';
    return resource.split('.')[0];
};



export const fetchCFUser = async (handle) => {
    if (!handle) return null;
    try {
        // Fetch User Info (Rating, Rank)
        const infoRes = await fetch(`${CF_USER_API}${handle}`);
        const infoData = await infoRes.json();

        // Fetch User Submissions (Solved Count)
        const statusRes = await fetch(`${CF_STATUS_API}${handle}`);
        const statusData = await statusRes.json();

        if (infoData.status === 'OK' && statusData.status === 'OK') {
            const user = infoData.result[0];
            const submissions = statusData.result;

            // Filter distinct solved problems
            const solved = new Set(
                submissions
                    .filter(sub => sub.verdict === 'OK')
                    .map(sub => `${sub.problem.contestId}-${sub.problem.index}`)
            ).size;

            return {
                rating: user.rating || 0,
                rank: user.rank || 'Unrated',
                handle: user.handle,
                solved: solved
            };
        }
    } catch (error) {
        console.error('Error fetching CF user:', error);
    }
    return null;
};

export const fetchLCUser = async (username) => {
    if (!username) return null;
    try {
        const response = await fetch(`${LC_USER_API}${username}`);
        const data = await response.json();
        if (data.status === 'success') {
            return {
                solved: data.totalSolved,
                easySolved: data.easySolved,
                mediumSolved: data.mediumSolved,
                hardSolved: data.hardSolved,
                ranking: data.ranking
            };
        }
    } catch (error) {
        console.error('Error fetching LC user:', error);
    }
    return null;
};

export const fetchCodeChefUser = async (username) => {
    if (!username) return null;
    try {
        const response = await fetch(`${CODECHEF_API}${username}`);
        const data = await response.json();
        if (data.success) {
            return {
                rating: data.currentRating,
                solved: data.totalSolved,
                rank: data.stars
            };
        }
    } catch (error) {
        console.error('Error fetching CodeChef user:', error);
    }
    return null;
};

export const fetchAtCoderUser = async (username) => {
    if (!username) return null;
    try {
        const response = await fetch(`${ATCODER_API}${username}`);
        const data = await response.json();
        if (data) {
            return {
                rating: data.rating,
                solved: data.accepted_count,
                rank: getAtCoderRank(data.rating)
            };
        }
    } catch (error) {
        console.error('Error fetching AtCoder user:', error);
    }
    return null;
};

const getAtCoderRank = (rating) => {
    if (rating < 400) return 'Gray';
    if (rating < 800) return 'Brown';
    if (rating < 1200) return 'Green';
    if (rating < 1600) return 'Cyan';
    if (rating < 2000) return 'Blue';
    if (rating < 2400) return 'Yellow';
    if (rating < 2800) return 'Orange';
    return 'Red';
};

const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hours > 24) return `${Math.floor(hours / 24)}d`;
    return `${hours}h ${mins}m`.replace(' 0m', '');
};


export const saveNote = (note) => {
    const token = localStorage.getItem("token");
    console.log("Saving note with token:", token);
    return fetch(`${BACKEND_URL}/api/notes`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(note)
    });
};

export const fetchNotes = () =>
    fetch(`${BACKEND_URL}/api/notes`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`
        }
    }).then(res => res.json());

export const deleteNoteFromDb = (id) =>
    fetch(`${BACKEND_URL}/api/notes/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
        }
    });

export const updateNote = (id, note) =>
    fetch(`${BACKEND_URL}/api/notes/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(note)
    });

export const sendReminder = (contest, emailOverride = null) => {
    const token = localStorage.getItem('token');
    const userEmail = JSON.parse(localStorage.getItem('user') || 'null')?.email;
    const email = emailOverride || userEmail;
    return fetch(`${BACKEND_URL}/api/reminders/send`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ email, contest })
    }).then(res => res.json());
};

export const scheduleReminder = (contest, minutesBefore = 10, emailOverride = null) => {
    const token = localStorage.getItem('token');
    const userEmail = JSON.parse(localStorage.getItem('user') || 'null')?.email;
    const email = emailOverride || userEmail;
    return fetch(`${BACKEND_URL}/api/reminders/schedule`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ email, contest, minutesBefore })
    }).then(res => res.json());
};
