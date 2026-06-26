import {
  addDoc,
  collection,
  getDocs,
} from 'firebase/firestore';
import {
  deleteDoc,
  doc,
} from 'firebase/firestore';
import {
  updateDoc,
} from 'firebase/firestore';

import { Penerima } from '../types/penerima';
import { getDoc } from 'firebase/firestore';
import {
  serverTimestamp
} from 'firebase/firestore';

import {
  query,
  where
} from 'firebase/firestore';

import { db } from './firebase';

const COLLECTION = 'penerima_bantuan';

export const tambahPenerima = async (
  data: Penerima
) => {
  await addDoc(
    collection(db, COLLECTION),
    {
      ...data,
      createdAt: serverTimestamp(),
    }
  );
};

// Tambahkan ini di penerimaService.ts jika belum ada fungsi getPenerima
export const getPenerima = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTION));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Gagal mengambil data dari Firebase:", error);
    return [];
  }
};
export const hapusPenerima = async (
  id: string
) => {
  await deleteDoc(
    doc(db, COLLECTION, id)
  );
};

export const updatePenerima = async (
  id: string,
  data: Partial<Penerima>
) => {
  await updateDoc(
    doc(db, COLLECTION, id),
    data
  );
};

export const cariPenerimaByNik =
  async (nik: string) => {

  const q = query(
    collection(db, COLLECTION),
    where('nik', '==', nik)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
};