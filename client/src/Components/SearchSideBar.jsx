import {useContext} from 'react';
import { SearchContext } from '../context/SearchContext';

const SearchSideBar = () => {

    const { isOpen, setIsOpen, keyword, setKeyword, brand, setBrand, sort, setSort} = useContext(SearchContext)

  return (
    <>
    {isOpen &&(
        <div onClick={()=>setIsOpen(false)} className='fixed inset-0 bg-black/50 z-40'> </div>)}
            <div className={`fixed top-0 left-0 h-full w-80 bg-white shadow-2xl z-50 p-6 transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
                <div className='flex justify-between items-center mb-8'>
                    <h2 className='text-2xl font-bold'>Search & Filters</h2>
                    <button className='text-2xl font-bold' onClick={()=>setIsOpen(false)}>
                        ✕
                    </button>
                </div>
                <div className='mb-6'>
                    <label className='block font-semibold mb-2'>Search</label>
                    <input type="text" value={keyword} onChange={(e)=> setKeyword(e.target.value)} placeholder="Search Products..." className="border p-3 rounded-lg w-full mb-4"/>
                </div>
                <div className='mb-6'>
                    <label className='block font-semibold mb-2'>Brand</label>
                    <select value={brand} onChange={(e)=>setBrand(e.target.value)} className="border p-3 rounded-lg mb-4 w-full">
                        <option value="">All Brands</option>;
                        <option value="Polo">Polo T-Shirts</option>;
                        <option value="Trackpant">Track Pant</option>;
                    </select>                  
                </div>
                <div className='mb-6'>
                    <label className='block font-semibold mb-2'>Sort by</label>
                    <select value={sort} onChange={(e)=>setSort(e.target.value)} className="border p-3 rounded-lg mb-4 w-full">
                    <option value="lowToHigh">Price: Low to High</option>;
                    <option value="highToLow">Price: High to Low</option>;

                </select>
                <button onClick={()=>{setKeyword(""); setBrand(""); setSort(""); }} className='bg-red-500 text-white py-3 rounded-lg mt-6 hover:bg-red-600 transition w-full'>Clear</button>
                </div>
            </div>
    
    
    </>
  )
}

export default SearchSideBar