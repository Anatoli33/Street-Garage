import { getFirestore, collection, addDoc } from "firebase/firestore";
import { app } from "./firebase";
import { Car } from "../interfaces/car.interface.js";
import { getDocs } from "firebase/firestore";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { deleteDoc } from "firebase/firestore";
import { increment } from "firebase/firestore";

const db = getFirestore(app);

export async function getCars() {
  const carsCollection = collection(db, "cars");
  const snapshot = await getDocs(carsCollection);

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}

export async function addCar(car: Car) {
  try {
    const carsCollection = collection(db, "cars"); 
    const docRef = await addDoc(carsCollection, car);
    console.log("Car added with ID:", docRef.id);
  } catch (error) {
    console.error("Error adding car:", error);
    throw error; 
  }
}

export async function getCarById(id: string): Promise<Car | null> {
  const docRef = doc(db, "cars", id);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return null;
  }

  const data = docSnap.data();

  return {
    id: docSnap.id,
    ...data,
    createdAt: data['createdAt']?.toDate?.() ?? new Date()
  } as Car;
}

export async function updateCar(id: string, data: Partial<Car>) {
  const docRef = doc(db, "cars", id);

  await updateDoc(docRef, {
    brand: data.brand,
    model: data.model,
    year: data.year,
    description: data.description,
    image: data.image,
    tags: data.tags
  });
}
export async function deleteCar(id: string) {
  const carRef = doc(db, "cars", id);
  await deleteDoc(carRef);
}
export async function likeCar(carId: string) {
  const carRef = doc(db, "cars", carId);

  await updateDoc(carRef, {
    likes: increment(1)
  });
}