import { useEffect, useState } from 'react'
import { getProducts, getProductsByCategory, getProductsByNameOrCategory} from '../external_api/products/index'
import Layout from '../components/layout/layout'
import styles from './../styles/Index.module.scss'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ProductCard from '../components/product_card/product_card'
import { getCategories } from '../external_api/categories/index'
import Category from '../components/category/category'
import Pagination from '../components/pagination/pagination'
import ProgressIndicator from '../components/progress_indicator/progress_indicator'
import NoProductsFound from '../components/no_products_found/no_products_found'

export default function Home({data,categories,fetchProductError,fetchCategoryError}) {

  const [apiData, setApiData] = useState({
    products: [],
    categories: [],
    currentPage:'',
    pages:'',
    fetchProductError: '',
    fetchCategoryError: '',
  });

  const [ currentCategoryIndex , setCurrentCategoryIndex] = useState(0)

  const [ currentPageIndex , setcurrentPageIndex] = useState(1)

  const [ isLoadingProducts, setIsLoadingProducts] = useState(true)

  useEffect(()=>{
    setCurrentCategoryIndex(0)
    setApiData({
     products: data.products,
     categories: categories.categories,
     currentPage: data.currentPage,
     pages: data.pages,
     fetchProductError,
     fetchCategoryError
   }); 
    setIsLoadingProducts(false) 
  },[])


  const productList = apiData.products.map(product=>

    <ProductCard
      key={product._id}
      imageUrl={product.imageUrl}
      name={product.name}
      price={product.price}
    />

  );

  const onCategoryClickedHandler = async(index,event) =>{

    event.preventDefault();

    setCurrentCategoryIndex(index)

    setIsLoadingProducts(true)

    let products, error;

    if(index == 0){
      const {data, errorMessage} = await getProducts();
      products = data.products;
      error = errorMessage;
    }else{
      const {data, errorMessage} = await getProductsByCategory(apiData.categories[index].category);
      products = data.result;
      error = errorMessage;
    }
    
    if(!error){
       setApiData({...apiData,products})
    }else{
      //TODO set error
    }

    setIsLoadingProducts(false)

  }  
  
  const catergoryList = apiData.categories.map((element,index)=>
      <Category
       key={element._id}
       category={element.category}
       elementIndex={index}
       currentIndex={currentCategoryIndex}
       click={(event) =>onCategoryClickedHandler(index,event)}
      />
  );

  const onPageIndicatorClickedHandler = (index,event)=>{
    
    event.preventDefault();

    setcurrentPageIndex(index);
  }

  let paginationIndicatorList = [];
  
  for(let i = 0; i<apiData.pages;i++){
    
    const pageIndicator = <Pagination 
     key={i+1}
     pageNumber={i + 1}
     currentIndex={currentPageIndex}
     pageIndex={i + 1}
     click={(event)=>onPageIndicatorClickedHandler(i+1,event)}/>

    paginationIndicatorList.push( pageIndicator)
  }

  const searchInputController = async (event) =>{

    event.preventDefault();

    setIsLoadingProducts(true);

    const searchKey = event.target.value.trim();

    let products, error;

    if(searchKey){
      const { data, errorMessage} = await getProductsByNameOrCategory(searchKey);
      products = data;
      error = errorMessage;      
    }else{
      const {data, errorMessage} = await getProducts();
      products = data.products;
      error = errorMessage;
    }

    if(!error){
      setApiData({...apiData,products})
   }else{
     //TODO set error
   }

    setIsLoadingProducts(false);
  }
 
  return (
    <Layout title='Product list'>
      
      <section className={styles.main}>

        <section className={styles.search_field}>
          <FontAwesomeIcon icon={faSearch}/>
          <input 
            type='text' 
            name='search' 
            id='search' 
            placeholder='Search by product name or category'
            onChange={searchInputController}
          />
        </section>

        <section className={styles.title}>
          <h1>Get the best products</h1>
        </section>

        <section className={styles.category_list}>
          {catergoryList}
        </section>
        
        { isLoadingProducts ?
          <ProgressIndicator/>:
          <>
            <section className={styles.product_list}>
              { apiData.products.length === 0 ? 
                <NoProductsFound/> : productList
              }
            </section>

            <section className={styles.pagination_section}>
  
              { apiData.products.length === 0  || apiData.pages === 1 ?
                '' : paginationIndicatorList
              }
            </section>
          </>

        }
        
      </section>

    </Layout>
      
  )
}

export async  function getServerSideProps (context){
  let fetchProductError, fetchCategoryError;
  
  const [firstResult, secondResult]= await Promise.all([
     getProducts(1,20),
     getCategories()
  ]);

  const {data,errorMessage} = firstResult;

  const {categories,errorMsg} = secondResult;

  fetchProductError = errorMessage? errorMessage :null;

  fetchCategoryError = errorMsg? errorMsg: null;

  return{
    props:{data,fetchProductError,fetchCategoryError,categories}
  }
}
