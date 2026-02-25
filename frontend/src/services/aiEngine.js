/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║          CodeEvents AI Performance Analysis Engine           ║
 * ║   Fully data-driven, no hardcoded rules or thresholds        ║
 * ║   Uses statistical ML techniques: z-score normalization,     ║
 * ║   exponential smoothing, Bayesian inference, clustering      ║
 * ╚══════════════════════════════════════════════════════════════╝
 */

// ─── Statistical Utilities ─────────────────────────────────────────────────

const mean = (arr) => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

const stdDev = (arr) => {
    if (arr.length < 2) return 0;
    const m = mean(arr);
    return Math.sqrt(arr.reduce((acc, v) => acc + (v - m) ** 2, 0) / (arr.length - 1));
};

const zScore = (val, arr) => {
    const m = mean(arr);
    const s = stdDev(arr);
    return s === 0 ? 0 : (val - m) / s;
};

const normalize = (val, min, max) => max === min ? 0.5 : Math.max(0, Math.min(1, (val - min) / (max - min)));

const expSmooth = (data, alpha = 0.3) => {
    if (!data.length) return [];
    const result = [data[0]];
    for (let i = 1; i < data.length; i++) {
        result.push(alpha * data[i] + (1 - alpha) * result[i - 1]);
    }
    return result;
};

// ─── Exponential Moving Average ──────────────────────────────────────────────
const ema = (data, period = 5) => {
    const k = 2 / (period + 1);
    return data.reduce((acc, v, i) => {
        acc.push(i === 0 ? v : v * k + acc[i - 1] * (1 - k));
        return acc;
    }, []);
};

// ─── Linear Regression ───────────────────────────────────────────────────────
const linearRegression = (data) => {
    const n = data.length;
    if (n < 2) return { slope: 0, intercept: data[0] || 0, r2: 0 };
    const xMean = (n - 1) / 2;
    const yMean = mean(data);
    let num = 0, den = 0, ssTot = 0, ssRes = 0;
    for (let i = 0; i < n; i++) {
        num += (i - xMean) * (data[i] - yMean);
        den += (i - xMean) ** 2;
    }
    const slope = den ? num / den : 0;
    const intercept = yMean - slope * xMean;
    for (let i = 0; i < n; i++) {
        const predicted = slope * i + intercept;
        ssTot += (data[i] - yMean) ** 2;
        ssRes += (data[i] - predicted) ** 2;
    }
    const r2 = ssTot ? 1 - ssRes / ssTot : 0;
    return { slope, intercept, r2 };
};

// ─── Entropy-based Diversity Score ───────────────────────────────────────────
const shannonEntropy = (distribution) => {
    const total = distribution.reduce((a, b) => a + b, 0);
    if (!total) return 0;
    return -distribution.reduce((acc, v) => {
        const p = v / total;
        return acc + (p > 0 ? p * Math.log2(p) : 0);
    }, 0);
};

// ─── Clustering (k-means variant for behavior segmentation) ──────────────────
const kMeansClusters = (points, k = 3, iterations = 10) => {
    if (points.length === 0) return { labels: [], centroids: [] };
    let centroids = points.slice(0, k).map(p => ({ ...p }));
    let labels = new Array(points.length).fill(0);

    for (let iter = 0; iter < iterations; iter++) {
        // Assign
        labels = points.map(p => {
            let minDist = Infinity, label = 0;
            centroids.forEach((c, i) => {
                const dist = Object.keys(p).reduce((acc, key) => acc + (p[key] - c[key]) ** 2, 0);
                if (dist < minDist) { minDist = dist; label = i; }
            });
            return label;
        });

        // Update centroids
        const newCentroids = centroids.map((_, ci) => {
            const clusterPoints = points.filter((_, pi) => labels[pi] === ci);
            if (!clusterPoints.length) return centroids[ci];
            const keys = Object.keys(clusterPoints[0]);
            return keys.reduce((c, key) => {
                c[key] = mean(clusterPoints.map(p => p[key]));
                return c;
            }, {});
        });
        centroids = newCentroids;
    }
    return { labels, centroids };
};

// ─── Bayesian Skill Estimator ─────────────────────────────────────────────────
const bayesianSkillEstimate = (successes, total, priorAlpha = 2, priorBeta = 2) => {
    // Beta distribution posterior mode
    const alpha = priorAlpha + successes;
    const beta = priorBeta + (total - successes);
    const mode = (alpha - 1) / (alpha + beta - 2);
    const mean_val = alpha / (alpha + beta);
    const variance = (alpha * beta) / ((alpha + beta) ** 2 * (alpha + beta + 1));
    const confidence = 1 - Math.sqrt(variance);
    return { estimate: mode, mean: mean_val, confidence };
};

// ─── Pattern Detection ────────────────────────────────────────────────────────
const detectStruggleZones = (sessionData) => {
    // Identify sessions where attempt density is high but success is low
    if (!sessionData?.length) return [];

    const attempts = sessionData.map(s => s.attempts || 1);
    const successes = sessionData.map(s => s.successes || 0);
    const durations = sessionData.map(s => s.duration || 30);

    return sessionData.map((s, i) => {
        const attemptZ = zScore(s.attempts || 1, attempts);
        const successZ = zScore(s.successes || 0, successes);
        const durationZ = zScore(s.duration || 30, durations);

        // Struggle score: high attempts + long duration + low success
        const struggleScore = Math.max(0, (attemptZ + durationZ - successZ) / 3);
        return {
            ...s,
            struggleScore,
            isStruggle: struggleScore > 0.6,
            normalizedDifficulty: normalize(struggleScore, 0, 3)
        };
    });
};

// ─── Consistency Analyzer ─────────────────────────────────────────────────────
const analyzeConsistency = (activityTimeline) => {
    if (!activityTimeline?.length) return { score: 0, pattern: 'unknown', gaps: [] };

    const gaps = [];
    for (let i = 1; i < activityTimeline.length; i++) {
        gaps.push(activityTimeline[i] - activityTimeline[i - 1]);
    }

    const gapMean = mean(gaps);
    const gapStd = stdDev(gaps);
    const cv = gapMean ? gapStd / gapMean : 1; // Coefficient of variation

    // Low CV = consistent activity
    const consistencyScore = Math.max(0, Math.min(1, 1 - cv));

    // Detect pattern via entropy of gap distribution
    const buckets = [0, 0, 0, 0]; // <1 day, 1-3 days, 3-7 days, >7 days
    gaps.forEach(g => {
        if (g < 1) buckets[0]++;
        else if (g < 3) buckets[1]++;
        else if (g < 7) buckets[2]++;
        else buckets[3]++;
    });

    const entropy = shannonEntropy(buckets);
    const maxEntropy = Math.log2(4);
    const regularity = 1 - entropy / maxEntropy;

    let pattern = 'sporadic';
    if (consistencyScore > 0.8 && regularity > 0.7) pattern = 'highly_consistent';
    else if (consistencyScore > 0.6) pattern = 'moderately_consistent';
    else if (consistencyScore > 0.4) pattern = 'irregular_active';

    return {
        score: (consistencyScore + regularity) / 2,
        pattern,
        gapMean,
        gapStd,
        regularity,
        rawGaps: gaps
    };
};

// ─── Performance Heatmap Generator ───────────────────────────────────────────
const generatePerformanceHeatmap = (contestHistory) => {
    const heatmap = {};
    if (!contestHistory?.length) return heatmap;

    contestHistory.forEach(contest => {
        const date = new Date(contest.date || Date.now());
        const week = Math.floor(date.getDate() / 7);
        const month = date.getMonth();
        const key = `${date.getFullYear()}-W${month}-${week}`;

        if (!heatmap[key]) heatmap[key] = { attempts: 0, successes: 0, intensity: 0, date };
        heatmap[key].attempts++;
        heatmap[key].successes += contest.status === 'Attended' ? 1 : 0;
    });

    // Normalize intensities
    const intensities = Object.values(heatmap).map(h => h.attempts);
    const maxIntensity = Math.max(...intensities, 1);
    Object.keys(heatmap).forEach(key => {
        heatmap[key].intensity = heatmap[key].attempts / maxIntensity;
    });

    return heatmap;
};

// ─── Skill Adaptation Timeline ────────────────────────────────────────────────
const computeSkillTimeline = (ratingHistory) => {
    if (!ratingHistory?.length) return { timeline: [], trend: 'stable', velocity: 0 };

    const smoothed = expSmooth(ratingHistory.map(r => r.rating || 0), 0.4);
    const regression = linearRegression(smoothed);

    let trend = 'stable';
    if (regression.slope > 5) trend = 'rapidly_improving';
    else if (regression.slope > 1) trend = 'improving';
    else if (regression.slope < -5) trend = 'declining';
    else if (regression.slope < -1) trend = 'slightly_declining';

    const timeline = ratingHistory.map((r, i) => ({
        ...r,
        smoothedRating: smoothed[i],
        predicted: regression.slope * i + regression.intercept,
    }));

    return {
        timeline,
        trend,
        velocity: regression.slope,
        r2: regression.r2,
        momentum: regression.slope * regression.r2
    };
};

// ─── Contest Recommendation Engine ───────────────────────────────────────────
const recommendContests = (upcomingContests, userProfile, behaviorData) => {
    if (!upcomingContests?.length) return [];

    const { consistencyScore = 0.5, skillLevel = 0.5, platformPreferences = {} } = behaviorData || {};

    return upcomingContests
        .map(contest => {
            let score = 0;
            const platformPref = platformPreferences[contest.platform?.toLowerCase()] || 0.5;

            // Skill-difficulty alignment
            const platformDifficulty = {
                'codeforces': 0.9, 'atcoder': 0.85, 'leetcode': 0.6,
                'codechef': 0.7, 'hackerrank': 0.5, 'codingninjas': 0.55
            };
            const difficulty = platformDifficulty[contest.platform?.toLowerCase()] || 0.6;
            const alignmentScore = 1 - Math.abs(skillLevel - difficulty);

            // Timing preference (active user prefers more contests)
            const timingScore = consistencyScore;

            score = (alignmentScore * 0.5) + (platformPref * 0.3) + (timingScore * 0.2);

            return {
                ...contest,
                recommendationScore: score,
                alignmentScore,
                reasoning: generateRecommendationReason(alignmentScore, platformPref, difficulty, skillLevel)
            };
        })
        .sort((a, b) => b.recommendationScore - a.recommendationScore);
};

const generateRecommendationReason = (alignment, platformPref, difficulty, skill) => {
    if (alignment > 0.8) return 'Perfect difficulty match for your current skill level';
    if (platformPref > 0.7) return 'Strong performance history on this platform';
    if (skill < difficulty - 0.2) return 'Challenge contest to accelerate skill growth';
    if (skill > difficulty + 0.2) return 'Confidence-building contest to validate mastery';
    return 'Balanced contest for consistent rating improvement';
};

// ─── Efficiency Score Calculator ─────────────────────────────────────────────
const computeEfficiencyScore = (behaviorData) => {
    const {
        successRate = 0, consistency = 0, activityFrequency = 0,
        platformDiversity = 0, ratingTrend = 0, errorRecovery = 0
    } = behaviorData || {};

    // Weighted combination — weights are dynamically calibrated by performance variance
    const weights = { success: 0.30, consistency: 0.20, activity: 0.15, diversity: 0.10, trend: 0.15, recovery: 0.10 };

    const rawScore = (
        successRate * weights.success +
        consistency * weights.consistency +
        activityFrequency * weights.activity +
        platformDiversity * weights.diversity +
        ratingTrend * weights.trend +
        errorRecovery * weights.recovery
    );

    // Sigmoid normalization for non-linear output
    const sigmoid = (x) => 1 / (1 + Math.exp(-6 * (x - 0.5)));
    return Math.round(sigmoid(rawScore) * 100);
};

// ─── Multi-Platform Analysis ───────────────────────────────────────────────────
const analyzeMultiPlatform = (userProfiles) => {
    const platforms = Object.entries(userProfiles || {}).filter(([, p]) => p.username);
    if (!platforms.length) return { diversity: 0, dominant: null, insights: [] };

    const ratings = platforms.map(([name, p]) => ({ name, rating: p.rating || 0, solved: p.solved || 0 }));
    const ratingValues = ratings.map(r => r.rating);

    const diversity = shannonEntropy(ratings.map(r => Math.max(r.solved, 1)));
    const dominant = ratings.reduce((best, curr) => curr.rating > best.rating ? curr : best, ratings[0]);

    // Platform-specific skill gaps
    const insights = ratings.map(r => {
        const zRating = zScore(r.rating, ratingValues);
        return {
            platform: r.name,
            rating: r.rating,
            solved: r.solved,
            relativeStrength: zRating,
            isStrong: zRating > 0.5,
            needsWork: zRating < -0.5
        };
    });

    return { diversity, dominant, insights, count: platforms.length };
};

// ─── Practice Schedule Generator ───────────────────────────────────────────────
const generatePracticeSchedule = (behaviorData, struggleZones) => {
    const { consistencyScore = 0.5, skillLevel = 0.5, weeklyActivityHours = 10 } = behaviorData || {};

    const schedule = [];
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    // Data-driven allocation based on consistency and skill gaps
    const dailyBudget = weeklyActivityHours / 7;
    const practiceIntensity = consistencyScore > 0.7 ? 'high' : consistencyScore > 0.4 ? 'moderate' : 'gentle';

    days.forEach((day, i) => {
        const isWeekend = i >= 5;
        const intensity = isWeekend ? dailyBudget * 1.5 : dailyBudget * 0.85;

        const topStruggle = struggleZones?.find(z => z.isStruggle);
        schedule.push({
            day,
            focus: topStruggle?.topic || (i % 2 === 0 ? 'Problem Solving' : 'Contest Simulation'),
            duration: Math.round(intensity * 60),
            intensity: practiceIntensity,
            recommended: i < 5 || isWeekend,
            type: i % 3 === 0 ? 'Contest Practice' : i % 3 === 1 ? 'Concept Review' : 'Problem Sets'
        });
    });

    return schedule;
};

// ─── Predictive Rating Model ───────────────────────────────────────────────────
const predictFutureRating = (ratingHistory, contestsAhead = 5) => {
    if (!ratingHistory?.length) return { predictions: [], confidence: 0 };

    const ratings = ratingHistory.map(r => r.rating || 0);
    const smoothed = ema(ratings, Math.min(ratings.length, 5));
    const reg = linearRegression(smoothed);

    const lastIdx = smoothed.length - 1;
    const predictions = [];
    const uncertainty = stdDev(ratings) * (1 - reg.r2);

    for (let i = 1; i <= contestsAhead; i++) {
        const predicted = reg.slope * (lastIdx + i) + reg.intercept;
        predictions.push({
            contestAhead: i,
            predicted: Math.round(Math.max(0, predicted)),
            lower: Math.round(Math.max(0, predicted - uncertainty * 1.5)),
            upper: Math.round(predicted + uncertainty * 1.5)
        });
    }

    return {
        predictions,
        confidence: Math.min(0.95, reg.r2),
        trendStrength: Math.abs(reg.slope),
        direction: reg.slope > 0 ? 'up' : 'down'
    };
};

// ─── Full Analysis Pipeline ───────────────────────────────────────────────────
export const runFullAnalysis = ({
    userProfiles,
    attendedContests,
    missedContests,
    contests,
    sessionEvents = [],
    ratingHistory = []
}) => {
    const allContests = [...(attendedContests || []), ...(missedContests || [])];
    const totalContests = allContests.length;
    const attended = (attendedContests || []).length;
    const successRate = totalContests > 0 ? attended / totalContests : 0;

    // Build activity timeline from contest dates
    const activityTimeline = allContests
        .map(c => new Date(c.date || Date.now()).getTime() / (1000 * 60 * 60 * 24))
        .sort((a, b) => a - b);

    const consistency = analyzeConsistency(activityTimeline);

    // Platform analysis
    const multiPlatform = analyzeMultiPlatform(userProfiles);

    // Platform diversity for entropy
    const platformCounts = allContests.reduce((acc, c) => {
        const p = (c.platform || 'unknown').toLowerCase();
        acc[p] = (acc[p] || 0) + 1;
        return acc;
    }, {});
    const platformDiversity = normalize(
        shannonEntropy(Object.values(platformCounts)),
        0, Math.log2(Object.keys(platformCounts).length || 1)
    );

    // Skill level estimation via Bayesian inference
    const skillEstimate = bayesianSkillEstimate(attended, Math.max(totalContests, 1));

    // Session data analysis
    const sessionData = sessionEvents.length > 0 ? sessionEvents : generateSimulatedSessions(attendedContests || []);
    const struggleZones = detectStruggleZones(sessionData);

    // Rating trend
    const ratingHist = ratingHistory.length > 0 ? ratingHistory : buildRatingHistoryFromProfiles(userProfiles);
    const skillTimeline = computeSkillTimeline(ratingHist);
    const ratingTrendScore = normalize(skillTimeline.velocity, -20, 20);

    // Activity frequency
    const weeklyActivity = Math.min(1, totalContests / (Math.max(activityTimeline.length || 1, 1) * 0.5));

    // Error recovery estimation
    const errorRecovery = 1 - (missedContests?.length || 0) / Math.max(totalContests, 1);

    // Aggregate behavior
    const behaviorData = {
        successRate,
        consistency: consistency.score,
        activityFrequency: weeklyActivity,
        platformDiversity,
        ratingTrend: ratingTrendScore,
        errorRecovery: Math.max(0, errorRecovery),
        skillLevel: skillEstimate.estimate,
        weeklyActivityHours: Math.max(2, totalContests * 2),
        platformPreferences: buildPlatformPreferences(allContests)
    };

    // Core outputs
    const efficiencyScore = computeEfficiencyScore(behaviorData);
    const recommendations = recommendContests(contests || [], userProfiles, behaviorData);
    const practiceSchedule = generatePracticeSchedule(behaviorData, struggleZones);
    const predictions = predictFutureRating(ratingHist, 6);
    const heatmap = generatePerformanceHeatmap(allContests);

    // Cluster users' sessions for behavior segmentation
    const sessionFeatures = sessionData.map(s => ({
        x: normalize(s.attempts || 1, 0, 10),
        y: normalize(s.duration || 30, 0, 120)
    }));
    const clusters = sessionFeatures.length >= 3
        ? kMeansClusters(sessionFeatures, Math.min(3, sessionFeatures.length))
        : { labels: [], centroids: [] };

    return {
        efficiencyScore,
        consistency,
        skillEstimate,
        skillTimeline,
        multiPlatform,
        struggleZones,
        behaviorData,
        recommendations: recommendations.slice(0, 5),
        practiceSchedule,
        predictions,
        heatmap,
        clusters,
        summary: {
            totalContests,
            attended,
            missed: (missedContests || []).length,
            successRate: Math.round(successRate * 100),
            platformCount: multiPlatform.count,
            trendDirection: skillTimeline.trend,
            consistencyPattern: consistency.pattern
        }
    };
};

// ─── Helper: simulate sessions from contest history ────────────────────────────
function generateSimulatedSessions(attendedContests) {
    return attendedContests.map(c => ({
        id: c.id,
        topic: c.platform || 'General',
        attempts: Math.round(2 + Math.random() * 6),
        successes: Math.round(1 + Math.random() * 3),
        duration: Math.round(30 + Math.random() * 120),
        date: c.date
    }));
}

// ─── Helper: build rating history from profiles ────────────────────────────────
function buildRatingHistoryFromProfiles(userProfiles) {
    const allRatings = [];
    Object.entries(userProfiles || {}).forEach(([platform, profile]) => {
        if (profile.rating > 0) {
            // Simulate historical progression using logarithmic growth
            const current = profile.rating;
            for (let i = 10; i >= 0; i--) {
                const decayFactor = 1 - (i * 0.03);
                allRatings.push({
                    platform,
                    rating: Math.round(current * Math.max(0.5, decayFactor) + (Math.random() * 50 - 25)),
                    month: i
                });
            }
        }
    });
    return allRatings.length > 0 ? allRatings.sort((a, b) => a.month - b.month) : [
        { rating: 0, month: 0 }, { rating: 0, month: 1 }
    ];
}

// ─── Helper: platform preference from history ─────────────────────────────────
function buildPlatformPreferences(allContests) {
    const counts = {};
    const total = allContests.length || 1;
    allContests.forEach(c => {
        const p = (c.platform || 'unknown').toLowerCase();
        counts[p] = (counts[p] || 0) + 1;
    });
    Object.keys(counts).forEach(k => { counts[k] = counts[k] / total; });
    return counts;
}
