import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 

export default function App({ Component, pageProps }: AppProps) {
  return <>
  <ToastContainer position="top-right" autoClose={2500} />
  <Component {...pageProps} />;</>
}
