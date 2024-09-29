import { Inject, Injectable } from '@nestjs/common';
import { app } from 'firebase-admin';

@Injectable()
export class FirebaseRepository {
  #db: FirebaseFirestore.Firestore;
  #collection: FirebaseFirestore.CollectionReference;

  constructor(@Inject('FIREBASE_APP') private firebaseApp: app.App) {
    this.#db = this.firebaseApp.firestore();
    this.#collection = this.#db.collection('blog');
  }

  async getFireBase() {
    // console.log('getFireBase firestore start:', this.#db.collection('blog'));

    // // const fireResult = await this.#collection.doc('access_token').get();
    // const fireResult = await this.#db
    //   .collection('blog')
    //   .doc('access_token')
    //   .get();
    // console.log('fireResult', fireResult);
    // const res = fireResult.data();

    // console.log('getFireBase firestore end', res);
    // return fireResult;
    console.log('getFireBase firestore start:', this.#collection);

    try {
      const fireResult = await this.#collection.doc('access_token').get();

      if (!fireResult.exists) {
        console.log('文档不存在');
        return null; // 或者根据需求返回其他信息
      }

      console.log('fireResult', fireResult.data());
      const res = fireResult.data();

      console.log('getFireBase firestore end', res);
      return res; // 返回数据而不是文档快照
    } catch (error) {
      console.error('获取 Firestore 数据时发生错误:', error);
      throw error; // 或者根据需求处理错误
    }
  }
}
