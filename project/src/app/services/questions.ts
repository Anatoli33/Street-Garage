// services/questions.js
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";
import { app } from "./firebase";
import { Question } from "../interfaces/questions.interface.js";

const db = getFirestore(app);

export async function getQuestions() {
  const questionsCollection = collection(db, "questions");
  const snapshot = await getDocs(questionsCollection);

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}

export async function addQuestion(question: Question) {
  try {
    const questionsCollection = collection(db, "questions");
    const docRef = await addDoc(questionsCollection, question);
    console.log("Question added with ID:", docRef.id);
  } catch (error) {
    console.error("Error adding question:", error);
    throw error;
  }
}