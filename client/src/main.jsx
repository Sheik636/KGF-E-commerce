import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SearchProvider from './context/SearchContext';
import { Provider } from "react-redux";
import { store } from './Redux/store';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Provider store={store}>
    
    
    <SearchProvider>
    <App />
    </SearchProvider>
    
    
    <ToastContainer
      position="top-right"
      autoClose={2000}
      theme="dark"
      toastStyle={{ background: "#1c1c1c", border: "1px solid #2a2a2a" }}
    />
    </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
