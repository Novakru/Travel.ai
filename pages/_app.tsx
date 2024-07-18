import '../styles/globals.css';
import { AppProps } from 'next/app';
import ClickEffect from '../src/app/components/ClickEffect'; // 从 components 文件夹中导入

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <ClickEffect /> {/* 全局使用 ClickEffect */}
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
