import { collection, addDoc } from "firebase/firestore";
import {db} from '../Database/firebase';

 
const handleAddProduct = async (productDetails) => {
    try {
        const docRef = await addDoc(collection(db, "newProduct"), {
          // productId:docRef.id,
          price: productDetails.price,
          discount: productDetails.discount,
          productImage: "productDetails.image",
          productName: productDetails.title,
          productDescription: productDetails.description,
          status: productDetails.status,
          category: productDetails.category,
          subcategory: productDetails.subcategory,
          productQuantity: productDetails.productQuantity,
          productUnit: productDetails.productUnit
        });
        console.log("Document written with ID: ", docRef.id);
      } catch (e) {
        console.error("Error adding document: ", e);
      }
}

export default handleAddProduct