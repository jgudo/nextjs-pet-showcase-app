import { Layout } from '@/components/common';
import FilterProvider from '@/provider/FilterProvider';
import '@/styles/app.css';
import { AppProps } from 'next/dist/next-server/lib/router/router';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <FilterProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </FilterProvider>
  )
}

export default MyApp
