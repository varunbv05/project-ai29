import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import type { Revision } from "@/components/RevisionResult";

// ── Revisions ──────────────────────────────────────────────────────────────

export async function saveRevision(uid: string, revision: Omit<Revision, "id" | "created_at">) {
  const ref = await addDoc(collection(db, "revisions"), {
    uid,
    ...revision,
    created_at: serverTimestamp(),
  });
  return ref.id;
}

export async function getRevisions(uid: string): Promise<Revision[]> {
  const q = query(
    collection(db, "revisions"),
    where("uid", "==", uid),
    orderBy("created_at", "desc"),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      ...data,
      id: d.id,
      created_at: (data.created_at as Timestamp)?.toDate?.()?.toISOString() ?? new Date().toISOString(),
    } as Revision;
  });
}

export async function getRecentRevisions(uid: string, n = 5): Promise<Revision[]> {
  const q = query(
    collection(db, "revisions"),
    where("uid", "==", uid),
    orderBy("created_at", "desc"),
    limit(n),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      ...data,
      id: d.id,
      created_at: (data.created_at as Timestamp)?.toDate?.()?.toISOString() ?? new Date().toISOString(),
    } as Revision;
  });
}

// ── Streak ─────────────────────────────────────────────────────────────────

export interface StreakData {
  current_streak: number;
  total_revisions: number;
  last_date: string;
}

export async function getStreak(uid: string): Promise<StreakData | null> {
  const ref = doc(db, "streaks", uid);
  const snap = await getDoc(ref);
  return snap.exists() ? (snap.data() as StreakData) : null;
}

export async function updateStreak(uid: string) {
  const ref = doc(db, "streaks", uid);
  const snap = await getDoc(ref);
  const today = new Date().toDateString();

  if (!snap.exists()) {
    await setDoc(ref, { current_streak: 1, total_revisions: 1, last_date: today });
  } else {
    const data = snap.data() as StreakData;
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    const isToday = data.last_date === today;
    const isYesterday = data.last_date === yesterday;
    await updateDoc(ref, {
      total_revisions: (data.total_revisions ?? 0) + 1,
      current_streak: isToday ? data.current_streak : isYesterday ? data.current_streak + 1 : 1,
      last_date: today,
    });
  }
}

// ── Weak Topics ────────────────────────────────────────────────────────────

export interface WeakTopic {
  id: string;
  topic: string;
  mastery: number;
}

export async function getWeakTopics(uid: string): Promise<WeakTopic[]> {
  const q = query(
    collection(db, "weak_topics"),
    where("uid", "==", uid),
    orderBy("mastery", "asc"),
    limit(5),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as WeakTopic));
}
