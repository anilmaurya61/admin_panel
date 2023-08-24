import { unwrapResult } from "@reduxjs/toolkit";
import React from "react";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { BASE_URL } from "../../Api/api";
import { addProduct } from "../../App/features/productsSlice";
import useFetch from "../../Hooks/useFetch";
import handleAddProduct from "../../Database/addProduct";
import { db } from '../../Database/firebase';
import { collection, addDoc, QuerySnapshot, query, getDocs } from "firebase/firestore";
import firebase from "firebase/app";


const ProductAdd = () => {

  const navigate = useNavigate()
  const dispatch = useDispatch()

  // const { data: category } = useFetch(`${BASE_URL}/category`)
  // Assuming you have already initialized Firebase


  const [categoryData, setCategoryData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [filteredSubCategories, setFilteredSubCategories] = useState([]);

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
    // handlecategoryChange(event);
  };

  const initialState = { title: '', description: '', status: '', category: '', subcategory: '', productQuantity: '', productUnit:''};

  const [productData, setProductData] = useState(initialState);
  const [price, setPrice] = useState([])
  const [discount, setdiscount] = useState([])
  const [image, setImage] = useState('')

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setProductData(prev => ({ ...prev, [name]: value }))
  }

  const handlePriceChange = (e) => {
    const priceValue = e.target.value;
    const priceInteger = parseInt(priceValue, 10);
    const priceArray = [priceInteger];
    setPrice(priceArray)
  }

  const handlediscountChange = (e) => {
    const discountValue = e.target.value;
    const discountInteger = parseInt(discountValue, 10);
    const discountArray = [discountInteger];
    setdiscount(discountArray);
  }
  // const handleImageChange = (e) => {
  //     const file = e.target.files[0]
  //     const formData = new FormData()
  //     formData.append("file", file)
  //     formData.append("upload_preset", `${process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET}`)

  //     toast.dismiss();
  //     toast.info('uploading image....')

  //     fetch( `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_UPLOAD_API_KEY}/image/upload`, {
  //         method: 'POST',
  //         body: formData,
  //     })
  //     .then(res => {
  //         if(!res.ok){
  //             throw new Error(res.statusText)
  //         } else {
  //             toast.dismiss()
  //             toast.success('Image Uploaded')
  //             return res.json()
  //         }
  //     })
  //     .then(data => {
  //         setImage(data.url)
  //     })
  //     .catch(error => {
  //         toast.dismiss();
  //         toast.error('image not uploaded')
  //         console.log(error)
  //     })
  //   };

 

  const handleSubmit = (e) => {
    e.preventDefault();

    const productDetails = { ...productData, price: Array.from(price, Number),discount, image};
    handleAddProduct(productDetails);
    if (1 || image) {
      dispatch(addProduct({ productDetails }))
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


  return (
    <>
      <div className="container" style={{ maxWidth: "768px" }}>
        <form
          className="row g-3 my-5 shadow p-2 rounded"
          onSubmit={handleSubmit}
        >
          <div className="h4 text-center mb-3">Add Product</div>
          <div className="col-12">
            <label htmlFor="title" className="form-label fw-bold">
              Title :
            </label>
            <input
              type="text"
              className="form-control"
              id="title"
              name="title"
              value={productData.title}
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
              value={productData.description}
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
              value={price}
              onChange={handlePriceChange}
              required
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="brand" className="form-label fw-bold">
              Discount :
            </label>
            <input
              type="number"
              className="form-control"
              id="price"
              name="price"
              value={productData.discount}
              onChange={handlediscountChange}
              // required
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
              Image :
            </label>
            <input
              type="file"
              className="form-control"
              id="image"
              // onChange={handleImageChange}
              required
            />
          </div>
          <div className="col-md-6" style={{ height: "100px", width: "100px" }}>
            <img
              className="mh-100 mw-100"
              src={image}
              alt=""
            />
          </div>
          <div className="col-12">
            <button type="submit" className="btn btn-primary mb-2 me-2">
              Add Product
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
    </>
  );
};

export default ProductAdd;
