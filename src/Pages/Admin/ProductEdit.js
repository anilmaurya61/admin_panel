import { unwrapResult } from "@reduxjs/toolkit";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { BASE_URL } from "../../Api/api";
import { updateProduct } from "../../App/features/productsSlice";
import Spiner from "../../Components/Spiner";
import useFetch from "../../Hooks/useFetch";
import { collection, addDoc, QuerySnapshot, query, getDocs } from "firebase/firestore";
import { db } from '../../Database/firebase';

const ProductEdit = () => {

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { id } = useParams()

  // const { data: category } = useFetch(`${BASE_URL}/category`)
  // const { data: product, error, loading } = useFetch(`${BASE_URL}/products/${id}`)

  const initialState = { title: '', description: '', brand: '', status: '', category: '', image: '', price: '' }

  const [productData, setProductData] = useState(initialState);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [categoryData, setCategoryData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [filteredSubCategories, setFilteredSubCategories] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "newProduct"));

        // Assuming you want to find the product with a specific ID
        const foundDoc = querySnapshot.docs.find(doc => doc.id === id);

        if (foundDoc) {
          const postData = { ...foundDoc.data(), id: foundDoc.id };
          setProductData(postData);
          setError(null); // Reset error if previous fetch had an error
        } else {
          setError("Product not found");
          setProductData(initialState); // Clear postData if product is not found
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


  const getCategoryData = async () => {
    // Fetch data from Firebase and set it in the state
    try {
      await getDocs(collection(db, "category"))
        .then((QuerySnapshot) => {
          const data = QuerySnapshot.docs
            .map((doc) => ({ ...doc.data(), id: doc.id }));
          setCategoryData(data);
          // console.log(data);
        })
    } catch (error) {
      console.error('Error fetching category data:', error);
      setCategoryData([]);
    }
  };

  const handleCategoryChange = async (event) => {
    const selectedCategoryId = event.target.value;
    setSelectedCategory(selectedCategoryId);

    try {
      // Fetch subcategories based on the selected category
      const subcategorySnapshot = await getDocs(collection(db, 'category', selectedCategoryId, 'subCategory'));
      const subcategoryData = subcategorySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setFilteredSubCategories(subcategoryData);
      console.log(subcategoryData);
    } catch (error) {
      console.error('Error fetching subcategory data:', error);
      setFilteredSubCategories([]);
    }
  };

  useEffect(() => {
    // Call the fetchData function when the component mounts
    getCategoryData();
  }, []);

  const combinedChangeHandler = (event) => {
    handleChange(event);
    handleCategoryChange(event);
  };
  // useEffect(()=> {
  //   setProductData(prev => ({...prev, ...product}))
  // }, [product])

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setProductData(prev => ({ ...prev, [name]: value }))
  }

  // const handleImageChange = (e) => {
  //   const file = e.target.files[0]
  //   const formData = new FormData()
  //   formData.append("file", file)
  //   formData.append("upload_preset", `${process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET}`)

  //   toast.dismiss();
  //   toast.info('uploading image....')

  //   fetch(`https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_UPLOAD_API_KEY}/image/upload`, {
  //     method: 'POST',
  //     body: formData,
  //   })
  //     .then(res => {
  //       if (!res.ok) {
  //         throw new Error(res.statusText)
  //       } else {
  //         toast.dismiss()
  //         toast.success('Image Uploaded')
  //         return res.json()
  //       }
  //     })
  //     .then(data => {
  //       setProductData(prev => ({ ...prev, image: data.url }))
  //     })
  //     .catch(error => {
  //       toast.dismiss();
  //       toast.error('image not uploaded')
  //       console.log(error)
  //     })
  // };

  const handleSubmit = (e) => {
    e.preventDefault();

    const price = Number(productData.price)
    const updateData = { ...productData, price };

    if (!productData.image) {
      dispatch(updateProduct({ id, updateData }))
        .unwrap(unwrapResult)
        .then(res => {
          if (res.status) {
            setProductData(initialState);
            navigate(-1)
          }
        })
    } else {
      toast.dismiss()
      toast.error('no image found')
    }
  }


  if (loading) {
    return <div className="my-5 text-center"><Spiner /></div>
  }

  if (error) {
    return <div className="my-5 text-center h3">{error}</div>;
  }

  return (
    <>
      {productData && (
        <div className="container" style={{ maxWidth: "768px" }}>
          <form
            className="row g-3 my-5 shadow p-2 rounded"
            onSubmit={handleSubmit}
          >
            <div className="h4 text-center mb-3">Edit Product</div>
            <div className="col-12">
              <label htmlFor="title" className="form-label fw-bold">
                Title :
              </label>
              <input
                type="text"
                className="form-control"
                id="title"
                name="title"
                value={productData.productName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-12">
              <label htmlFor="description" className="form-label fw-bold">
                Description :
              </label>
              <textarea
                type="text"
                className="form-control"
                id="description"
                name="description"
                value={productData.productDescription}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="brand" className="form-label fw-bold">
                Discount :
              </label>
              <input
                type="text"
                className="form-control"
                id="brand"
                name="brand"
                value={productData.discount}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="price" className="form-label fw-bold">
                Price :
              </label>
              <input
                type="number"
                className="form-control"
                id="price"
                name="price"
                value={productData.price}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="brand" className="form-label fw-bold">
                Product Quantity :
              </label>
              <input
                type="number"
                className="form-control"
                id="price"
                name="productQuantity"
                value={productData.productQuantity}
                onChange={handleChange}
              // required
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="brand" className="form-label fw-bold">
                Product Unit :
              </label>
              <input
                type="text"
                className="form-control"
                id="price"
                name="productUnit"
                value={productData.productUnit}
                onChange={handleChange}
              // required
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="status" className="form-label fw-bold">
                Status :
              </label>
              <select
                className="form-select"
                id="status"
                value={productData.status}
                name="status"
                onChange={handleChange}
                required
              >
                <option value="">-- Select Status --</option>
                <option value="active">Active</option>
                <option value="hidden">Hidden</option>
              </select>
            </div>
            <div className="col-md-6">
              <label htmlFor="category" className="form-label fw-bold">
                Category :
              </label>
              <select
                className="form-select"
                id="category"
                value={productData.category}
                name="category"
                onChange={combinedChangeHandler}
                required
              >
                <option value="">-- Select Category --</option>
                {categoryData.map(cat => {
                  const { categoryName, id } = cat;
                  return (
                    <option key={id} value={id}>
                      {categoryName}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="col-md-6">
              <label htmlFor="category" className="form-label fw-bold">
                SubCategory :
              </label>
              <select
                className="form-select"
                id="category"
                value={productData.subcategory}
                name="subcategory"
                onChange={handleChange}
                required
              >
                <option value="">-- Select SubCategory --</option>
                {filteredSubCategories.map(subCat => (
                  <option key={subCat.id} value={subCat.sub_name}>
                    {subCat.sub_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-6">
              <label htmlFor="image" className="form-label fw-bold">
                Change Image :
              </label>
              <input
                type="file"
                className="form-control"
                id="image"
                // onChange={handleImageChange}
              />
            </div>
            <div className="col-md-6" style={{ height: "150px", width: "150px" }}>
              <img
                className="mh-100 mw-100"
                src={productData.image}
                alt=""
              />
            </div>
            <div className="col-12">
              <button type="submit" className="btn btn-primary mb-2 me-2">
                Update
              </button>
              <button
                type="button"
                className="btn btn-danger mb-2 ms-2"
                onClick={() => navigate(-1)}
              >
                Back
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default ProductEdit;
