// // import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
// import { API_USER, GetOne } from '@sm/common';

// // Type definitions
// export interface BookDetail {
//   id: number;
//   title: string;
//   price: number;
//   image: string;
//   author?: string;
//   isbn?: string;
//   description?: string;
//   category?: string;
//   stock?: number;
//   // Add other book properties as needed
// }

// export interface CartItem {
//   bookId: string;
//   quantity: number;
//   bookDetails: BookDetail;
//   addedAt: number;
//   updatedAt: number;
// }

// export interface CartSummary {
//   totalItems: number;
//   subtotal: number;
//   itemCount: number;
// }

// export interface CartState {
//   items: { [bookId: string]: CartItem };
//   summary: CartSummary;
//   loading: boolean;
//   error: string | null;
//   lastUpdated: number;
// }

// // Initial state
// const initialState: CartState = {
//   items: {},
//   summary: {
//     totalItems: 0,
//     subtotal: 0,
//     itemCount: 0,
//   },
//   loading: false,
//   error: null,
//   lastUpdated: Date.now(),
// };

// // Helper function to calculate cart summary
// const calculateSummary = (items: { [bookId: string]: CartItem }): CartSummary => {
//   const itemsArray = Object.values(items);
  
//   return {
//     totalItems: itemsArray.reduce((sum, item) => sum + item.quantity, 0),
//     subtotal: itemsArray.reduce((sum, item) => sum + (item.bookDetails.price * item.quantity), 0),
//     itemCount: itemsArray.length,
//   };
// };

// // Async thunk for fetching book details
// export const fetchBookDetails = createAsyncThunk<
//   BookDetail,
//   number,
//   { rejectValue: string }
// >(
//   'cart/fetchBookDetails',
//   async (bookId: number, { rejectWithValue }) => {
//     try {
//       const response = await GetOne(API_USER.get_books, bookId);
//       const bookDetails = response?.data?.data as BookDetail;
      
//       if (!bookDetails) {
//         return rejectWithValue(`Book with ID ${bookId} not found`);
//       }
      
//       return bookDetails;
//     } catch (error) {
//       return rejectWithValue(`Failed to fetch book details: ${error}`);
//     }
//   }
// );

// // Async thunk for adding to cart (when book details need to be fetched)
// export const addToCartAsync = createAsyncThunk<
//   { bookId: string; bookDetails: BookDetail; quantity: number },
//   { bookId: string; quantity?: number },
//   { rejectValue: string }
// >(
//   'cart/addToCartAsync',
//   async ({ bookId, quantity = 1 }, { rejectWithValue }) => {
//     try {
//       const response = await GetOne(API_USER.get_books, Number(bookId));
//       const bookDetails = response?.data?.data as BookDetail;
      
//       if (!bookDetails) {
//         return rejectWithValue(`Book with ID ${bookId} not found`);
//       }
      
//       return { bookId, bookDetails, quantity };
//     } catch (error) {
//       return rejectWithValue(`Failed to add item to cart: ${error}`);
//     }
//   }
// );

// // Cart slice
// const cartSlice = createSlice({
//   name: 'cart',
//   initialState,
//   reducers: {
//     // Add item to cart (when book details are already available)
//     addToCart: (state, action: PayloadAction<{ bookId: string; bookDetails: BookDetail; quantity?: number }>) => {
//       const { bookId, bookDetails, quantity = 1 } = action.payload;
//       const now = Date.now();

//       if (state.items[bookId]) {
//         // Item already exists, update quantity
//         state.items[bookId].quantity += quantity;
//         state.items[bookId].updatedAt = now;
//       } else {
//         // Add new item
//         state.items[bookId] = {
//           bookId,
//           quantity,
//           bookDetails,
//           addedAt: now,
//           updatedAt: now,
//         };
//       }

//       state.summary = calculateSummary(state.items);
//       state.lastUpdated = now;
//       state.error = null;
//     },

//     // Update item quantity
//     updateCartItem: (state, action: PayloadAction<{ bookId: string; quantity: number }>) => {
//       const { bookId, quantity } = action.payload;

//       if (quantity <= 0) {
//         delete state.items[bookId];
//       } else if (state.items[bookId]) {
//         state.items[bookId].quantity = quantity;
//         state.items[bookId].updatedAt = Date.now();
//       }

//       state.summary = calculateSummary(state.items);
//       state.lastUpdated = Date.now();
//       state.error = null;
//     },

//     // Increment item quantity
//     incrementCartItem: (state, action: PayloadAction<string>) => {
//       const bookId = action.payload;

//       if (state.items[bookId]) {
//         state.items[bookId].quantity += 1;
//         state.items[bookId].updatedAt = Date.now();
//         state.summary = calculateSummary(state.items);
//         state.lastUpdated = Date.now();
//       }
//     },

//     // Decrement item quantity
//     decrementCartItem: (state, action: PayloadAction<string>) => {
//       const bookId = action.payload;

//       if (state.items[bookId]) {
//         if (state.items[bookId].quantity <= 1) {
//           delete state.items[bookId];
//         } else {
//           state.items[bookId].quantity -= 1;
//           state.items[bookId].updatedAt = Date.now();
//         }
        
//         state.summary = calculateSummary(state.items);
//         state.lastUpdated = Date.now();
//       }
//     },

//     // Remove item from cart
//     removeFromCart: (state, action: PayloadAction<string>) => {
//       const bookId = action.payload;
//       delete state.items[bookId];
      
//       state.summary = calculateSummary(state.items);
//       state.lastUpdated = Date.now();
//       state.error = null;
//     },

//     // Clear entire cart
//     clearCart: (state) => {
//       state.items = {};
//       state.summary = {
//         totalItems: 0,
//         subtotal: 0,
//         itemCount: 0,
//       };
//       state.lastUpdated = Date.now();
//       state.error = null;
//     },

//     // Update book details for existing cart item
//     updateBookDetails: (state, action: PayloadAction<{ bookId: string; bookDetails: BookDetail }>) => {
//       const { bookId, bookDetails } = action.payload;
      
//       if (state.items[bookId]) {
//         state.items[bookId].bookDetails = bookDetails;
//         state.items[bookId].updatedAt = Date.now();
//         state.summary = calculateSummary(state.items);
//         state.lastUpdated = Date.now();
//       }
//     },

//     // Clear error
//     clearError: (state) => {
//       state.error = null;
//     },

//     // Set loading state manually if needed
//     setLoading: (state, action: PayloadAction<boolean>) => {
//       state.loading = action.payload;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       // Fetch book details cases
//       .addCase(fetchBookDetails.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchBookDetails.fulfilled, (state) => {
//         state.loading = false;
//         state.error = null;
//       })
//       .addCase(fetchBookDetails.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload || 'Failed to fetch book details';
//       })
      
//       // Add to cart async cases
//       .addCase(addToCartAsync.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(addToCartAsync.fulfilled, (state, action) => {
//         const { bookId, bookDetails, quantity } = action.payload;
//         const now = Date.now();

//         if (state.items[bookId]) {
//           state.items[bookId].quantity += quantity;
//           state.items[bookId].updatedAt = now;
//         } else {
//           state.items[bookId] = {
//             bookId,
//             quantity,
//             bookDetails,
//             addedAt: now,
//             updatedAt: now,
//           };
//         }

//         state.summary = calculateSummary(state.items);
//         state.lastUpdated = now;
//         state.loading = false;
//         state.error = null;
//       })
//       .addCase(addToCartAsync.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload || 'Failed to add item to cart';
//       });
//   },
// });

// // Export actions
// export const {
//   addToCart,
//   updateCartItem,
//   incrementCartItem,
//   decrementCartItem,
//   removeFromCart,
//   clearCart,
//   updateBookDetails,
//   clearError,
//   setLoading,
// } = cartSlice.actions;

// // Export reducer
// export default cartSlice.reducer;

// // Selectors
// export const selectCartItems = (state: { cart: CartState }) => state.cart.items;
// export const selectCartItemsArray = (state: { cart: CartState }) => 
//   Object.values(state.cart.items).sort((a, b) => b.addedAt - a.addedAt);
// export const selectCartSummary = (state: { cart: CartState }) => state.cart.summary;
// export const selectCartLoading = (state: { cart: CartState }) => state.cart.loading;
// export const selectCartError = (state: { cart: CartState }) => state.cart.error;
// export const selectCartLastUpdated = (state: { cart: CartState }) => state.cart.lastUpdated;

// // Item-specific selectors
// export const selectCartItem = (state: { cart: CartState }, bookId: string) => 
//   state.cart.items[bookId] || null;
// export const selectItemQuantity = (state: { cart: CartState }, bookId: string) => 
//   state.cart.items[bookId]?.quantity || 0;
// export const selectIsInCart = (state: { cart: CartState }, bookId: string) => 
//   bookId in state.cart.items;

// // Cart summary selectors
// export const selectTotalItems = (state: { cart: CartState }) => state.cart.summary.totalItems;
// export const selectSubtotal = (state: { cart: CartState }) => state.cart.summary.subtotal;
// export const selectItemCount = (state: { cart: CartState }) => state.cart.summary.itemCount;
// export const selectIsCartEmpty = (state: { cart: CartState }) => state.cart.summary.totalItems === 0;