import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Products.css";
import ProductCard from "./ProductCard";
// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 *
 * @property {string} name - The name or title of the product
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */

const Products = () => {
  // TODO: CRIO_TASK_MODULE_PRODUCTS - Fetch products data and store it
  /**
   * Make API call to get the products list and store it to display the products
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on all available products
   *
   * API endpoint - "GET /products"
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "name": "iPhone XR",
   *          "category": "Phones",
   *          "cost": 100,
   *          "rating": 4,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "v4sLtEcMpzabRyfx"
   *      },
   *      {
   *          "name": "Basketball",
   *          "category": "Sports",
   *          "cost": 100,
   *          "rating": 5,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "upLK9JbQ4rMhTwt4"
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 500
   * {
   *      "success": false,
   *      "message": "Something went wrong. Check the backend console for more details"
   * }
  //  */
  let { enqueueSnackbar } = useSnackbar();
  let token = localStorage.getItem("token");
  let username = localStorage.getItem("username");
  let balance = localStorage.getItem("balance");

  //  const [enqueueSnackbar] = useSnackbar();
  const [productDetails, setProductDetails] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [cartLoad, setCartLoad] = useState(false);
  const [timeoutId, setTimeoutID] = useState(null);
  const [load, setLoad] = useState(false);

  const performAPICall = async () => {
    setLoad(true);
    try {
     
      let response = await axios.get(`${config.endpoint}/products`);
      //Success
      setProductDetails(response.data);
      setFilteredProducts(response.data);
      
      setCartLoad(true);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        enqueueSnackbar(error.response.data.message, { variant: "error" });
      }
    }

    setLoad(false);
  };

  useEffect(() => {
    performAPICall();
  }, []);

  // useEffect(() => {
  //   fetchCart(token);
  //   //eslint-disable-next-line
  // }, [cartLoad]);

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Implement search logic
  /**
   * Definition for search handler
   * This is the function that is called on adding new search keys
   *
   * @param {string} text
   *    Text user types in the search bar. To filter the displayed products based on this text.
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on filtered set of products
   *
   * API endpoint - "GET /products/search?value=<search-query>"
   *
   */
  const performSearch = async (text) => {
    setLoad(true);
    try {
      let response = await axios.get(
        `${config.endpoint}/products/search?value=${text}`
      );

      setFilteredProducts(response.data);
      console.log(filteredProducts,"filterProduct");
    } catch (error) {
      if (error.response) {
        if (error.response.status === 404) {
          setFilteredProducts([]);
        }
        if (error.response.status === 500) {
          enqueueSnackbar(error.response.data.message, { variant: "error" });
          setFilteredProducts(productDetails);
        }
      } else {
        enqueueSnackbar(
          "Something went wrong. Check that the backend is running, reachable and returns valid JSON.",
          { variant: "error" }
        );
      }
    }

    setLoad(false);
  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Optimise API calls with debounce search implementation
  /**
   * Definition for debounce handler
   * With debounce, this is the function to be called whenever the user types text in the searchbar field
   *
   * @param {{ target: { value: string } }} event
   *    JS event object emitted from the search input field
   *
   * @param {NodeJS.Timeout} debounceTimeout
   *    Timer id set for the previous debounce call
   *
   */
  const debounceSearch = (event, debounceTimeout) => {
    let text = event.target.value;
    // [IF true] Clear timoutId
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }
    // Set timeout & make the API call
    let timeOut = setTimeout(() => {
      performSearch(text);
    }, 500);
    // Update set timeoutId
    setTimeoutID(timeOut);
  };

  return (
    <div>
      <Header>
        <TextField
          className="search-desktop"
          size="small"
          fullWidth
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Search color="primary" />
              </InputAdornment>
            ),
          }}
          placeholder="Search for items/categories"
          name="search"
          onChange={(e) => debounceSearch(e, timeoutId)}
        />
      </Header>  

      {/* Search view for mobiles */}
      <TextField
        className="search-mobile"
        size="small"
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        placeholder="Search for items/categories"
        name="search"
        onChange={(e) => debounceSearch(e, timeoutId)}
    /> 
         
      <Grid container>
        <Grid
          item
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
          
        >
          <Grid item className="product-grid">
            <Box className="hero">
              <p className="hero-heading">
                India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
                to your door step
              </p>
            </Box>
          </Grid>
          {load ? (
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              py={10}
            >
              <CircularProgress size={40} />
              <h4>Loading Products...</h4>
            </Box>
          ) : (
            <Grid
              container
              item
              spacing={1}
              direction="row"
              justifyContent="center"
              alignItems="center"
              my={3}
            >
              {filteredProducts.length ? (
                filteredProducts.map((product) => (
                  <Grid item key={product["_id"]} xs={6} md={3}>
                    <ProductCard
                      product={product}
                      // handleAddToCart={(event) => handleCart(product["_id"])}
                    />
                  </Grid>
                ))
              ) : (
                <Box
                  display="flex"
                  flexDirection="column"
                  justifyContent="center"
                  alignItems="center"
                  py={10}
                >
                  <SentimentDissatisfied size={40} />
                  <h4>No products found</h4>
                </Box>
              )}
            </Grid>
          )}
        </Grid>
      </Grid>
      <Footer />
    </div>
  );
};

export default Products;
