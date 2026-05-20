import React, {createContext,useState,useEffect} from "react";

export const WishlistContext = createContext();

export const WishlistProvider = ({children}) => {

const [wishlist,setWishlist] = useState(() => {
const saved = localStorage.getItem("wishlist");
return saved ? JSON.parse(saved) : [];
});

useEffect(()=>{
localStorage.setItem("wishlist",JSON.stringify(wishlist));
},[wishlist]);

const toggleWishlist = (service) => {

const exists = wishlist.find(item => item.id === service.id);

if(exists){
setWishlist(wishlist.filter(item => item.id !== service.id));
}
else{
setWishlist([...wishlist,service]);
}

};

return(
<WishlistContext.Provider value={{wishlist,toggleWishlist}}>
{children}
</WishlistContext.Provider>
);

};