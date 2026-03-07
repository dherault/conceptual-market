import type { Firestore } from 'firebase-admin/firestore'

export async function up(db: Firestore) {
  const batch = db.batch()

  return await batch.commit()
}

export async function down(db: Firestore) {
  const batch = db.batch()

  return await batch.commit()
}
