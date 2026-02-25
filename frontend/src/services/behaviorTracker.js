/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║             Real-Time Behavioral Tracking System                 ║
 * ║   Non-invasive event logging for AI performance analysis         ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */

const STORAGE_KEY = 'codeevents_behavior_log';
const MAX_EVENTS = 2000;

// ─── Event Types ──────────────────────────────────────────────────────────────
export const EVENT_TYPES = {
    CONTEST_VIEW: 'contest_view',
    CONTEST_REGISTER: 'contest_register',
    CONTEST_ATTENDED: 'contest_attended',
    CONTEST_MISSED: 'contest_missed',
    SUBMISSION_ATTEMPT: 'submission_attempt',
    SUBMISSION_SUCCESS: 'submission_success',
    SUBMISSION_FAIL: 'submission_fail',
    SESSION_START: 'session_start',
    SESSION_END: 'session_end',
    IDLE_DETECTED: 'idle_detected',
    FOCUS_REGAINED: 'focus_regained',
    PLATFORM_SWITCH: 'platform_switch',
    PAGE_VISIT: 'page_visit',
    RATING_UPDATE: 'rating_update',
    PRACTICE_SESSION: 'practice_session',
};

// ─── Event Logger ─────────────────────────────────────────────────────────────
class BehaviorTracker {
    constructor() {
        this._events = this._loadEvents();
        this._sessionId = this._generateId();
        this._sessionStart = Date.now();
        this._lastActivity = Date.now();
        this._idleThreshold = 5 * 60 * 1000; // 5 minutes
        this._idleTimer = null;
        this._isIdle = false;
        this._focusStartTime = Date.now();
        this._totalFocusTime = 0;
        this._listeners = new Set();

        // Log session start
        this.track(EVENT_TYPES.SESSION_START, { sessionId: this._sessionId });

        // Start idle detection
        if (typeof window !== 'undefined') {
            this._initIdleDetection();
        }
    }

    _generateId() {
        return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    }

    _loadEvents() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            return raw ? JSON.parse(raw) : [];
        } catch {
            return [];
        }
    }

    _saveEvents() {
        try {
            // Keep only latest MAX_EVENTS
            if (this._events.length > MAX_EVENTS) {
                this._events = this._events.slice(-MAX_EVENTS);
            }
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this._events));
        } catch { /* storage quota — silently fail */ }
    }

    // ─── Core Tracking Method ───────────────────────────────────────────────
    track(eventType, payload = {}) {
        const event = {
            id: this._generateId(),
            type: eventType,
            timestamp: Date.now(),
            sessionId: this._sessionId,
            ...payload
        };
        this._events.push(event);
        this._saveEvents();
        this._lastActivity = Date.now();
        this._notifyListeners(event);
        return event;
    }

    // ─── Idle Detection ─────────────────────────────────────────────────────
    _initIdleDetection() {
        const resetIdle = () => {
            if (this._isIdle) {
                this._isIdle = false;
                this._focusStartTime = Date.now();
                this.track(EVENT_TYPES.FOCUS_REGAINED, {});
            }
            this._lastActivity = Date.now();
            clearTimeout(this._idleTimer);
            this._idleTimer = setTimeout(() => {
                if (!this._isIdle) {
                    this._isIdle = true;
                    const focusDuration = Date.now() - this._focusStartTime;
                    this._totalFocusTime += focusDuration;
                    this.track(EVENT_TYPES.IDLE_DETECTED, { focusDuration });
                }
            }, this._idleThreshold);
        };

        ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'].forEach(evt => {
            window.addEventListener(evt, resetIdle, { passive: true });
        });

        // Visibility change
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this._isIdle = true;
                const focusDuration = Date.now() - this._focusStartTime;
                this._totalFocusTime += focusDuration;
                this.track(EVENT_TYPES.IDLE_DETECTED, { reason: 'tab_hidden', focusDuration });
            } else {
                this._isIdle = false;
                this._focusStartTime = Date.now();
                this.track(EVENT_TYPES.FOCUS_REGAINED, { reason: 'tab_visible' });
            }
        });
    }

    // ─── Subscribe to live events ────────────────────────────────────────────
    subscribe(callback) {
        this._listeners.add(callback);
        return () => this._listeners.delete(callback);
    }

    _notifyListeners(event) {
        this._listeners.forEach(cb => {
            try { cb(event); } catch { }
        });
    }

    // ─── Analysis Helpers ────────────────────────────────────────────────────
    getEvents(type = null, sinceMs = null) {
        return this._events.filter(e => {
            const typeMatch = !type || e.type === type;
            const timeMatch = !sinceMs || e.timestamp >= Date.now() - sinceMs;
            return typeMatch && timeMatch;
        });
    }

    getSessionStats() {
        const sessionDuration = Date.now() - this._sessionStart;
        const focusTime = this._totalFocusTime + (
            this._isIdle ? 0 : Date.now() - this._focusStartTime
        );
        const idleTime = sessionDuration - focusTime;

        return {
            sessionId: this._sessionId,
            sessionDurationMs: sessionDuration,
            focusTimeMs: focusTime,
            idleTimeMs: Math.max(0, idleTime),
            focusRatio: sessionDuration > 0 ? focusTime / sessionDuration : 0,
            totalEvents: this._events.length,
        };
    }

    getRecentSubmissions(lastNDays = 30) {
        const cutoff = Date.now() - lastNDays * 24 * 60 * 60 * 1000;
        const attempts = this._events.filter(e =>
            e.type === EVENT_TYPES.SUBMISSION_ATTEMPT && e.timestamp >= cutoff
        );
        const successes = this._events.filter(e =>
            e.type === EVENT_TYPES.SUBMISSION_SUCCESS && e.timestamp >= cutoff
        );
        return {
            total: attempts.length,
            successes: successes.length,
            failRate: attempts.length > 0 ? 1 - successes.length / attempts.length : 0
        };
    }

    getPageEngagement() {
        const pageVisits = this.getEvents(EVENT_TYPES.PAGE_VISIT);
        const pageCounts = {};
        pageVisits.forEach(e => {
            pageCounts[e.page] = (pageCounts[e.page] || 0) + 1;
        });
        return pageCounts;
    }

    computeRealTimeMetrics() {
        const last7d = 7 * 24 * 60 * 60 * 1000;
        const last30d = 30 * 24 * 60 * 60 * 1000;

        const contests7d = this.getEvents(EVENT_TYPES.CONTEST_ATTENDED, last7d).length;
        const contests30d = this.getEvents(EVENT_TYPES.CONTEST_ATTENDED, last30d).length;
        const submissions = this.getRecentSubmissions(30);
        const sessionStats = this.getSessionStats();

        // Inter-submission gaps
        const submissionEvents = this.getEvents(EVENT_TYPES.SUBMISSION_ATTEMPT);
        const gaps = [];
        for (let i = 1; i < submissionEvents.length; i++) {
            gaps.push((submissionEvents[i].timestamp - submissionEvents[i - 1].timestamp) / 60000); // minutes
        }
        const avgGapMinutes = gaps.length > 0 ? gaps.reduce((a, b) => a + b, 0) / gaps.length : 0;

        return {
            weeklyContests: contests7d,
            monthlyContests: contests30d,
            submissionSuccessRate: 1 - submissions.failRate,
            totalSubmissions: submissions.total,
            avgTimeBetweenSubmissions: avgGapMinutes,
            sessionFocusRatio: sessionStats.focusRatio,
            totalFocusMinutes: Math.round(sessionStats.focusTimeMs / 60000),
        };
    }

    // Export behavior data for AI engine
    exportForAnalysis() {
        const allContestEvents = this.getEvents(EVENT_TYPES.CONTEST_ATTENDED);
        const sessions = [];

        // Group by session gaps >2h
        let currentSession = null;
        [...this._events].sort((a, b) => a.timestamp - b.timestamp).forEach(e => {
            if (!currentSession || e.timestamp - currentSession.endTime > 2 * 60 * 60 * 1000) {
                if (currentSession) sessions.push(currentSession);
                currentSession = { start: e.timestamp, endTime: e.timestamp, events: [], attempts: 0, successes: 0, duration: 0 };
            }
            currentSession.endTime = e.timestamp;
            currentSession.events.push(e);
            if (e.type === EVENT_TYPES.SUBMISSION_ATTEMPT) currentSession.attempts++;
            if (e.type === EVENT_TYPES.SUBMISSION_SUCCESS) currentSession.successes++;
        });
        if (currentSession) sessions.push(currentSession);

        sessions.forEach(s => {
            s.duration = Math.round((s.endTime - s.start) / 60000);
        });

        return {
            sessions,
            metrics: this.computeRealTimeMetrics(),
            rawEvents: this._events.slice(-500), // last 500 events
        };
    }

    clearHistory() {
        this._events = [];
        this._saveEvents();
    }
}

// ─── Singleton Instance ───────────────────────────────────────────────────────
let trackerInstance = null;

export const getTracker = () => {
    if (!trackerInstance) {
        trackerInstance = new BehaviorTracker();
    }
    return trackerInstance;
};

export default BehaviorTracker;
