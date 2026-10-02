import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where,
  type DocumentData,
  type Unsubscribe,
} from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

// Every document belongs to a workspace. For now there is a single owner per
// account, but all access goes through here so switching to real multi-tenant
// support later is a one-file change.
export function requireUid(): string {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error('You must be signed in to access data.');
  return uid;
}

export function subscribeOwned<T>(
  collectionName: string,
  onChange: (items: T[]) => void,
  onError?: (error: Error) => void,
): Unsubscribe {
  const owned = query(
    collection(db, collectionName),
    where('ownerId', '==', requireUid()),
  );
  return onSnapshot(
    owned,
    (snap) => {
      onChange(snap.docs.map((d) => ({ id: d.id, ...d.data() })) as T[]);
    },
    (error) => onError?.(error),
  );
}

export async function createOwned(
  collectionName: string,
  data: DocumentData,
): Promise<string> {
  const ref = await addDoc(collection(db, collectionName), {
    ...data,
    ownerId: requireUid(),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateOwned(
  collectionName: string,
  id: string,
  data: DocumentData,
): Promise<void> {
  await updateDoc(doc(db, collectionName, id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function removeOwned(
  collectionName: string,
  id: string,
): Promise<void> {
  await deleteDoc(doc(db, collectionName, id));
}
