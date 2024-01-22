import { addDoc, collection } from 'firebase/firestore'

import { Symptoms } from '@/entities/symptoms.entity'
import { db } from '@/lib/firebase'

const reportSymptomsCollection = collection(db, 'reportSymptoms')

type SymptomsInput = Omit<Symptoms, 'id'>

export const createSymptoms = async (symptoms: SymptomsInput) => {
  await addDoc(reportSymptomsCollection, symptoms)
}
