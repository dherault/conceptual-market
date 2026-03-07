import type { User } from 'conceptual-market-core'
import firebase from 'firebase-admin'
import type { DocumentSnapshot } from 'firebase-admin/firestore'

async function readUser(userId: string) {
  const snapshot = await firebase.firestore()
    .collection('users')
    .doc(userId)
    .get() as DocumentSnapshot<User>

  return snapshot.data() ?? null
}

export default readUser
