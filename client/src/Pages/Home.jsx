import { useState, useEffect, useContext } from "react";
import API from "../Services/api";
import ProductCard from "../Components/ProductCard";
import SearchSideBar from "../Components/SearchSideBar";
import { SearchContext } from "../context/SearchContext";

const Home = ()=>{
    const [products, setProducts] = useState([]);
    
    const {isOpen, setIsOpen, keyword, setKeyword, brand, setBrand, sort, setSort} = useContext(SearchContext)

    useEffect(()=>{
        const fetchProducts = async ()=>{
            try {
                const {data}= await API.get(`/products?keyword=${keyword}&brand=${brand}&sort=${sort}`);
                setProducts(data);
            } catch (error) {
                console.log(error.message)
            }
        }
        fetchProducts();
    },[keyword, brand,sort]);
    return(
        <>
        <SearchSideBar isOpen={isOpen} setIsOpen={setIsOpen} keyword={keyword} setKeyword={setKeyword} brand={brand} setBrand={setBrand} sort={sort} setSort={setSort}/>
        <div className="max-w-7xl mx-auto px-6 py-8">
            <h1 className="text-2xl font-bold mb-4">Products</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {products.map((item)=>(
                            <ProductCard key={item._id} product={item} />
                        ))}
                    </div>
        </div>
        </>
    )
}

export default Home;