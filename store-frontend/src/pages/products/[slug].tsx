import { Button, Card, CardActions, CardContent, CardHeader, CardMedia, Typography } from '@material-ui/core'
import { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import { useRouter } from 'next/dist/client/router'
import Head from 'next/head'
import http from '../../http'
import { Product } from '../../model'

interface ProductDetailPageProps {
   product: Product
}

const ProductDetailPage: NextPage<ProductDetailPageProps> = ({ product }) => {
   const router = useRouter()

   if (router.isFallback) {
      return (<div>Carregando...</div>)
   }

   return (
      <div>
         <Head>
            <title>{product.name} - Detalhes do produto</title>
         </Head>
         <Card>
            <CardHeader title={product.name.
               toLocaleUpperCase()}
               subheader={`R$ ${product.price}`}
            />
            <CardActions>
               <Button size="small" color="primary" component="a">Comprar</Button>
            </CardActions>
            <CardMedia
               style={{ paddingTop: "56%" }}
               image={product.image_url}
            />
            <CardContent>
               <Typography component="p" variant="body2" color="textSecondary">
                  {product.description}
               </Typography>
            </CardContent>
         </Card>
      </div>
   );
}

export default ProductDetailPage;

export const getStaticProps: GetStaticProps<ProductDetailPageProps, { slug: string }> = async context => {
   const { slug } = context.params!
   const { data: product } = await http.get(`products/${slug}`)

   return {
      props: {
         product
      },
      revalidate: (1 * 60) * 2
   }
}

export const getStaticPaths: GetStaticPaths = async context => {
   const { data: products } = await http.get('products')

   const paths = products.map((p: Product) => ({
      params: { slug: p.slug }
   }))

   return { paths, fallback: 'blocking' }
}