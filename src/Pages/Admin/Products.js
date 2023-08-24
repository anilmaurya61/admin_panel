import React, { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../App/features/productsSlice";
import AddLinkButton from "../../Components/Admin/AddLinkButton";
import Search from "../../Components/Admin/Search";
import Pagination from "../../Components/Pagination";
import ProductsTable from "../../Components/Admin/Products/ProductsTable";
import { db } from '../../Database/firebase';
import { collection, addDoc, QuerySnapshot, query, getDocs } from "firebase/firestore";

const Products = () => {
  const dispatch = useDispatch();

  const { products, error } = useSelector((state) => state.products);
  const [productData, setproductData] = useState([]);

  useEffect(() => {
    const controler = new AbortController();
    const signal = controler.signal;

    dispatch(fetchProducts({ signal }));

    return () => {
      controler.abort();
    };
  }, [dispatch]);

  const getproductData = async () => {
    // Fetch data from Firebase and set it in the state
    try {
      await getDocs(collection(db, "newProduct"))
        .then((QuerySnapshot) => {
          const data = QuerySnapshot.docs
            .map((doc) => ({ ...doc.data(), id: doc.id }));
          setproductData(data);
          console.log(data);
        })
    } catch (error) {
      console.error('Error fetching category data:', error);
      setproductData([]);
    }
  };

  useEffect(() => {
    // Call the fetchData function when the component mounts
    getproductData();
  }, []);

  const [productsData, setProductsData] = useState([]);

  //  Pagination
  const [ page, setPage ] = useState(1)
  const dataLimit = 10;
  const lastIndex = page*dataLimit;
  const firstIndex = lastIndex - dataLimit;
  const totalData = productsData.length;
  const currentProducts = productsData.slice(firstIndex, lastIndex)

  useEffect(() => {
    setProductsData(products);
    // setPage(1)
  }, [products]);
  


  // search function
  const handleSearch = (e) => {
    const searchText = e.target.value;
    const filteredProducts = products.filter(product => product.title.toLowerCase().includes(searchText.toLowerCase()) )
    setProductsData(filteredProducts)
    setPage(1)
  }

  

  if (error) {
    return <div className="my-5 text-center h3">{error}</div>
  }

  return (
    <>
      { products && (
          <div className="container">
            <div className="card  bg-light my-5">
              <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                
                <AddLinkButton
                  btntext={"Add Product"}
                  link={"/admin/products/add"}
                />

                <Search 
                  handleSearch={handleSearch}
                />

              </div>
              <div className="card-body">
                {products.length ?(
                  <>
                    <ProductsTable currentProducts={productData} />
                    <Pagination page={page} setPage={setPage} total={totalData} limit={dataLimit} />
                  </>
                ) : null}
              </div>
            </div>
          </div>
        )
      }
    </>
  );
};

export default Products;
