import { doc, getDoc, setDoc } from 'firebase/firestore'

import { User } from '@/entities/user.entity'
import { db } from '@/lib/firebase'

type UserInput = Omit<User, 'registration'>

export const createUser = async ({
  name,
  email,
  id,
  picture = null,
}: UserInput) => {
  await setDoc(doc(db, 'users', id), {
    name,
    email,
    registration: new Date(),
    picture,
  })
}

export const getUser = async (id: string): Promise<User> => {
  const docRef = doc(db, 'users', id)
  const docSnap = await getDoc(docRef)
  if (docSnap.exists()) {
    return docSnap.data() as User
  } else {
    throw new Error('No such document!')
  }
}
