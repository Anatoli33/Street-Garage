import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  getDoc, 
  updateDoc, 
  deleteDoc, 
  increment, 
  arrayRemove, 
  arrayUnion,
  serverTimestamp 
} from "firebase/firestore";
import { app } from "./firebase";
import { Car } from "../interfaces/car.interface.js";

const db = getFirestore(app);


export async function getCars(): Promise<Car[]> {
  const carsCollection = collection(db, "cars");
  const snapshot = await getDocs(carsCollection);

  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,

      likedBy: data['likedBy'] || [],
      likes: data['likes'] || 0,
      createdAt: data['createdAt']?.toDate?.() ?? new Date()
    } as Car;
  });
}


export async function addCar(car: Car) {
  try {
    const carsCollection = collection(db, "cars"); 

    const docRef = await addDoc(carsCollection, {
      ...car,
      createdAt: serverTimestamp()
    });
    console.log("Car added with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error adding car:", error);
    throw error; 
  }
}


export async function getCarById(id: string): Promise<Car | null> {
  const docRef = doc(db, "cars", id);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) return null;

  const data = docSnap.data();
  return {
    id: docSnap.id,
    ...data,
    likedBy: data['likedBy'] || [],
    createdAt: data['createdAt']?.toDate?.() ?? new Date()
  } as Car;
}

export async function updateCar(id: string, data: Partial<Car>) {
  const docRef = doc(db, "cars", id);
  return await updateDoc(docRef, { ...data });
}


export async function deleteCar(id: string) {
  const carRef = doc(db, "cars", id);
  await deleteDoc(carRef);
}


export async function toggleLikeCar(carId: string, userId: string, isLiked: boolean) {
  const carRef = doc(db, 'cars', carId);

  if (isLiked) {

    await updateDoc(carRef, {
      likedBy: arrayRemove(userId),
      likes: increment(-1)
    });
  } else {

    await updateDoc(carRef, {
      likedBy: arrayUnion(userId),
      likes: increment(1)
    });
  }
}