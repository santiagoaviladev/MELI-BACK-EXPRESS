const express = require('express')
const axios = require('axios')

let realCategories = []

/*TYPINGS*/
class Author{

  name;
  lastname;

  constructor(name,lastname)
  {
      this.name=name;
      this.lastname=lastname;
  }
}

 class Price {

  currency;
  amount;
  decimals;

  constructor(
    currency,
    amount,
    decimals,)
    {
      this.currency=currency,
      this.amount=amount,
      this.decimals=decimals
    }

}


 class Product  {
   
    id;
    title;
    price; 
    picture;
    condition;
    free_shipping;
    sold_quantity;
    description;
    location;

  constructor(id,
    title,
    price,
    picture,
    condition,
    free_shipping,
    sold_quantity,
    description,
    location, ){

      this.id=id;
      this.title=title;
      this.price=price;
      this.picture=picture;
      this.condition=condition;
      this.free_shipping=free_shipping;
      this.sold_quantity=sold_quantity;
      this.description=description;
      this.location=location

  }
    

}


class ProductReturn{

  author;
  item;

  constructor(
    author,
    item)
    {
      this.author=author;
      this.item=item
    }

}


 class ProductListReturn{

    author;
    categories;
    items;

    constructor(
      author,
      categories,
      items)
      {
        this.author=author;
        this.categories=categories;
        this.items=items
      }

}


/**/ 




const app = express();
const port = 3000;
const author = new Author("XAVIER SANTIAGO", "AVILA")


const getItem = async (id) => {
  try {
  const url = `https://api.mercadolibre.com/items/${id}`

 
    return await axios.get(url)
  } catch (error) {
    console.error(error)
  }
}

const getItemDescription = async (id) => {
    try {
    const url = `https://api.mercadolibre.com/items/${id}/description`
      return await axios.get(url)
    } catch (error) {
      console.error(error)
    }
  }



const getProducts = async (query,limit,offset) => {
    try {
    const url = `https://api.mercadolibre.com/sites/MLA/search?q=${query}&limit=${limit}&offset=${offset}`
      return await axios.get(url)
    } catch (error) {
      console.error(error)
    }
  }
  
const getCatData = async ()=>{

  

    try {
    const url = `https://api.mercadolibre.com/sites/MLA/categories`
      return await axios.get(url)
    } catch (error) {
      console.error(error)
    }
  
  
  
 
}



app.get("/items", async (req, res)=>
{
  const query = req.query.query
  const result = await getItem(query)

  
  const apiRes = result?.data

  const amount = apiRes.price.toString().indexOf(".")!==-1 ? parseInt(apiRes.price.toString().split(".")[0]) : apiRes.price
  const decimals = apiRes.price.toString().indexOf(".")!==-1 ? parseInt(apiRes.price.toString().split(".")[1]) : 0
  const shipping = apiRes.shipping.free_shipping
  const description = await getItemDescription(apiRes.id)
  const apiPrice = new Price (apiRes.currency_id,amount,decimals)
  const p = new Product(
          apiRes.id,
          apiRes.title,
          apiPrice,
          apiRes.thumbnail,
          apiRes.condition,
          shipping,
          apiRes.sold_quantity,
          description?.data?.plain_text,
          ""
        )

  const tr = new ProductReturn(author, p)
  

  
  
  res.status(result.status).send(tr) 


})
  
app.get("/search", async (req, res)=>
{
    const query = req.query.query
    const result = await getProducts(query, 4, 0)
   
    const products = [];
    const categories = [];
    
    if(result && result.status && result.status == 200)
    {
      const hanldeRes = result.data.results
     
      for(var i=0;i<hanldeRes.length;i++)
      {
        const apiRes = hanldeRes[i]


       
        
        const amount = apiRes.price.toString().indexOf(".")!==-1 ? parseInt(apiRes.price.toString().split(".")[0]) : apiRes.price
        const decimals = apiRes.price.toString().indexOf(".")!==-1 ? parseInt(apiRes.price.toString().split(".")[1]) : 0
        const shipping = apiRes.shipping.free_shipping
        const description = await getItemDescription(apiRes.id)
        const apiPrice = new Price (apiRes.currency_id,amount,decimals)
        const p = new Product(
          apiRes.id,
          apiRes.title,
          apiPrice,
          apiRes.thumbnail,
          apiRes.condition,
          shipping,
          apiRes.sold_quantity,
          description?.data?.plain_text,
          apiRes.address.state_name

        )
        products.push(p)
        categories.push(apiRes.category_id)
      }
      

      
    }
    
    /*GET CATEGORY INFORMATION */
    var uniqueCats = [...new Set(categories)]
    if(realCategories.length!==null)
    {
      const catNames = await getCatData(uniqueCats)

      if(catNames && catNames.status && catNames.status == 200)
      {
        let allCats = catNames.data
        realCategories=[...allCats]
      }
    }
    

    const finalCats=[]
    for(var c=0;c<categories.length;c++)
    {

      if(!finalCats.find((element)=>element==categories[c]))
      {

        
        const finalCat=realCategories.find((element)=>{
          element.id===categories[c] })


        if(typeof finalCat!=='undefined')
          finalCats.push(finalCat.name)
        else if(!finalCats.find((element)=>element==='Otras categorías'))
          finalCats.push("Otras categorías")
      }
        
    }
        

    

    const tr = new ProductListReturn(author, finalCats, products)
    
   
    res.status(result.status).send(tr) 
    
});




app.listen(port, ()=> {

    console.log("LISTENNING ON PORT", port)
})