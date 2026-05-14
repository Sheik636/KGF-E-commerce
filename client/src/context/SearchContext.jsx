import { useState, createContext } from "react";

export const SearchContext = createContext();

const SearchProvider = ({children})=>{
    const [keyword, setKeyword] = useState('');
    const [brand, setBrand] = useState("");
    const [sort, setSort] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    return(
        <SearchContext.Provider value={{ isOpen, setIsOpen, keyword, setKeyword, brand, setBrand, sort, setSort}}>{children}</SearchContext.Provider>
    );
}

export default SearchProvider;