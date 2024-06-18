import { createContext, useContext, useEffect, useState } from 'react';
import { endPoints } from '../services/endPoints/endPoints';
import { useFetch } from '../hooks/useFetch';

const UserContext = createContext();

export default function UserContextProvider({ children }) {
    const [cart, setCart] = useState(
        JSON.parse(localStorage.getItem('shoppingRadCars')) || []
    );
    const [total, setTotal] = useState(
        JSON.parse(localStorage.getItem('totalRadcars')) || 0
    );
    const [countProducts, setCountProducts] = useState(
        JSON.parse(localStorage.getItem('countRadcars')) || 0
    );

    // search
    const [search, setSearch] = useState('');
    const [urlProduct, setUrlProduct] = useState(
        endPoints.products.getProducts
    );

    //--user--//
    const [user, setUser] = useState(false);
    const [token, setToken] = useState(false);

    //--- Load Data Product---//
    const {
        data: dataProduct,
        loadingData: loadDataProduct,
        error,
        loading,
    } = useFetch(urlProduct);

    const saveToken = (token) => {
        const expiration = new Date();
        expiration.setTime(expiration.getTime() + 2 * 60 * 60 * 1000);
        localStorage.setItem('tokenRadcars', token);
        localStorage.setItem('tokenExpirationRadcars', expiration.getTime());
    };

    useEffect(() => {
        const storedToken = localStorage.getItem('tokenRadcars');
        const expiration = localStorage.getItem('tokenExpirationRadcars');
        const currentTime = new Date().getTime();

        if (storedToken && expiration && currentTime < parseInt(expiration)) {
            setUser(JSON.parse(localStorage.getItem('userRadcars')));
            setToken(storedToken);
        } else {
            // Token expirado, limpiar el localStorage
            localStorage.removeItem('tokenRadcars');
            localStorage.removeItem('tokenExpirationRadcars');
            localStorage.removeItem('userRadcars');
        }
        loadDataProduct();
    }, [urlProduct, token]);

    // Save localStorage
    const saveLocal = () => {
        localStorage.setItem('shoppingRadCars', JSON.stringify(cart));
    };

    const countLocal = () => {
        localStorage.setItem('countRadcars', JSON.stringify(countProducts));
    };

    const totaltLocal = () => {
        localStorage.setItem('totalRadcars', JSON.stringify(total));
    };

    saveLocal();
    countLocal();
    totaltLocal();

    // add Porduct shopping cart
    const onAddProduct = (product) => {
        const priceProduct = parseInt(product.price);

        setTotal(total + priceProduct);
        setCountProducts(countProducts + 1);

        const itemInCart = cart.find((element) => element.id === product.id);

        if (itemInCart) {
            setCart(
                cart.map((item) =>
                    item.id === product.id
                        ? { ...product, quantity: itemInCart.quantity + 1 }
                        : item
                )
            );
            setCountProducts(countProducts + 1);
            setTotal(total + priceProduct);
        } else {
            setCart((prevState) => [
                ...prevState,
                {
                    ...product,
                    quantity: 1,
                },
            ]);
        }
    };

    // Reduce products from cart
    const decrase = (product) => {
        const productrepeat = cart.find((element) => element.id === product.id);
        const priceProduct = parseInt(product.price);

        setCountProducts(countProducts - 1);
        setTotal(total - priceProduct);
        setCart(
            cart.map((item) =>
                item.id === product.id
                    ? { ...product, quantity: productrepeat.quantity - 1 }
                    : item
            )
        );
    };

    // Remove products from cart
    const deleteProduct = (product) => {
        const foundId = cart.find((element) => element.id === product.id);

        const newCart = cart.filter((element) => {
            return element !== foundId;
        });

        const priceProduct = parseInt(product.price);
        setCountProducts(countProducts - product.quantity);
        setTotal(total - priceProduct * product.quantity);
        setCart(newCart);
    };

    return (
        <UserContext.Provider
            value={{
                cart,
                setCart,
                onAddProduct,
                decrase,
                deleteProduct,
                countProducts,
                total,
                setCountProducts,
                setTotal,
                user,
                setUser,
                saveToken,
                token,
                setToken,
                dataProduct,
                setUrlProduct,
                urlProduct,
                search,
                setSearch,
                loadDataProduct,
                error,
                loading,
            }}
        >
            {children}
        </UserContext.Provider>
    );
}

export const useUserContext = () => useContext(UserContext);
