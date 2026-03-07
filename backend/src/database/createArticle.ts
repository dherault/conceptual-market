import type { Article } from 'conceptual-market-core'
import firebase from 'firebase-admin'

async function createArticle(article: Article) {
  await firebase.firestore()
    .doc(`articles/${article.id}`)
    .set(article)
}

export default createArticle
