
const KONTESTS_API = 'https://kontests.net/api/v1/all';
const CF_USER_API = 'https://codeforces.com/api/user.info?handles=';
const CF_STATUS_API = 'https://codeforces.com/api/user.status?handle=';
const LC_USER_API = 'https://leetcode-stats-api.herokuapp.com/';
const CODECHEF_API = 'https://codechef-api.vercel.app/'; // Unofficial but popular
const ATCODER_API = 'https://kenkoooo.com/atcoder/atcoder-api/v3/user/info?user=';

const CLIST_API_URL = 'https://clist.by/api/v4/contest/';
const CLIST_KEY = 'ApiKey alighter:11de134ba4e27ba11733cbefc077f4183eaf08f8';

// Resource IDs or substrings for filtering
const ALLOWED_RESOURCES = [
    'leetcode.com',
    'codechef.com',
    'codeforces.com',
    'atcoder.jp',
    'basecamp.com',
    'naukri.com'
];

export const fetchContests = async () => {
    try {
        const resourceFilter = ALLOWED_RESOURCES.join(',');
        const response = await fetch(`${CLIST_API_URL}?upcoming=true&order_by=start&limit=200&resource__name__in=${resourceFilter}`, {
            headers: {
                'Authorization': CLIST_KEY
            }
        });

        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();

        return data.objects
            .filter(c => isEnglish(c.event))
            .map((c, index) => ({
                id: c.id || index,
                name: c.event,
                platform: normalizePlatform(c.resource),
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
    // Regex to detect non-Latin/non-standard characters
    // This allows common ASCII, numbers, and basic punctuation but filters out 
    // Cyrillic, Kanji/Kana, etc.
    return !/[^\u0000-\u007F]+/.test(text);
};


const normalizePlatform = (resource) => {
    const r = resource.toLowerCase();
    if (r.includes('codeforces')) return 'Codeforces';
    if (r.includes('leetcode')) return 'LeetCode';
    if (r.includes('atcoder')) return 'AtCoder';
    if (r.includes('codechef')) return 'CodeChef';
    if (r.includes('basecamp')) return 'Basecamp';
    if (r.includes('naukri')) return 'Naukri';
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


export const saveNote = (note) =>
    fetch("http://localhost:4000/api/notes", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(note)
    });
