import '../styles/globals.css';
import { AppProps } from 'next/app';
import ClickEffect from '../src/app/components/ClickEffect';


function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <ClickEffect /> {/* 全局使用 ClickEffect */}
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
