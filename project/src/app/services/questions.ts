import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  getDoc, 
  updateDoc, 
  deleteDoc, 
  arrayRemove, 
  arrayUnion,
  serverTimestamp 
} from "firebase/firestore";
import { app } from "./firebase";
import { Question } from "../interfaces/questions.interface.js";

const db = getFirestore(app);
export async function getQuestions(): Promise<Question[]> {
  const questionsCollection = collection(db, "questions");
  const snapshot = await getDocs(questionsCollection);

  return snapshot.docs.map(doc => {
    const data = doc.data() as Question;

    return {
      id: doc.id,
      title: data.title,
      description: data.description,
      tags: data.tags,
      ownerId: data.ownerId,
      createdAt: data.createdAt?.toDate?.() ?? new Date(),
      likes: data.likes ?? 0,
    };
  });
}

export async function addQuestion(question: Question) {
  try {
    const questionsCollection = collection(db, "questions");

    const docRef = await addDoc(questionsCollection, {
      ...question,
      createdAt: serverTimestamp(), 
    });

    console.log("Question added with ID:", docRef.id);
  } catch (error) {
    console.error("Error adding question:", error);
    throw error;
  }
}
export async function deleteQuestion(id: string) {
  const questionRef = doc(db, "questions", id);
  await deleteDoc(questionRef);
}

export async function likeQuestion(questionId: string, userId: string) {
  const questionRef = doc(db, "questions", questionId);
  const questionSnap = await getDoc(questionRef);

  if (!questionSnap.exists()) return;

  const data = questionSnap.data() as Question; 
  const likes = data.likes || [];

  if (likes.includes(userId)) {
    await updateDoc(questionRef, {
      likes: arrayRemove(userId)
    });
  } else {
    await updateDoc(questionRef, {
      likes: arrayUnion(userId)
    });
  }
}

export async function getQuestionById(id: string): Promise<Question | null> {
  const ref = doc(db, 'questions', id);
  const snap = await getDoc(ref);

  if (snap.exists()) {
    return { 
      id: snap.id, 
      ...snap.data() 
    } as Question;
  }

  return null;
}
export const updateQuestion = async (id: string, data: Partial<Question>) => {
  const docRef = doc(db, 'questions', id);
  return await updateDoc(docRef, data);
};