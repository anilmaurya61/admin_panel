import { React, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { BASE_URL } from "../../Api/api";
import Spiner from "../../Components/Spiner";
import useFetch from "../../Hooks/useFetch";
import { collection, addDoc, QuerySnapshot, query, getDocs } from "firebase/firestore";
import { db } from '../../Database/firebase';

const ProductView = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "newProduct"));
        
        // Assuming you want to find the product with a specific ID
        const foundDoc = querySnapshot.docs.find(doc => doc.id === id);
        
        if (foundDoc) {
          const postData = { ...foundDoc.data(), id: foundDoc.id };
          setProduct(postData);
          setError(null); // Reset error if previous fetch had an error
        } else {
          setError("Product not found");
          setProduct(null); // Clear postData if product is not found
        }
      } catch (error) {
        setError("Error fetching product");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <div className="my-5 text-center"><Spiner /></div>;

  if (error) return <div className="my-5 text-center h3">{error}</div>;

  return (
    <>
      {product && (
        <div className="container px-4 px-md-5 my-5">
          <div className="row gx-4 gx-lg-5 align-items-center">
            <div className="col-md-6 py-5 text-center" style={{ height: "450px" }}>
              <img
                className=" mh-100 mw-100 mb-5 mb-md-0"
                src={product.image}
                alt="..."
              />
            </div>
            <div className="col-md-6">
              <h1 className=" mb-3 pt-0 pt-md-5 fw-bolder">{product.productName}</h1>
              <div className="fs-5">Product id: {product.id}</div>
              <div className="fs-5">Status: {product.status}</div>
              <div className="fs-5">Price : {product.price}$</div>
              <div className="fs-5">Discount : {product.discount}$</div>
              <div className="fs-5">SubCategory : {product.subcategory}</div>
              <div className="fs-5">Product Unit : {product.productUnit}</div>
              <div className="fs-5 mb-3">Product Quantity : {product.productQuantity}</div>
              <p className="lead mb-2">{product.productDescription}</p>
              <Link
                className="btn btn-outline-dark flex-shrink-0"
                to={`/admin/products/${id}/edit`}
              >
                Edit Product
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductView;
