import '../styles/globals.css'
import type { AppProps } from 'next/app'  //Ex 25.124 Handle Promises
import {Web3Provider} from "@providers"  //Ex 25.124 Handle Promises

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <ToastContainer />  {/*Ex 25.124 Handle Promises*/}
      <Web3Provider>
        <Component {...pageProps} />
      </Web3Provider>
    </>

  )
 }

export default MyApp
