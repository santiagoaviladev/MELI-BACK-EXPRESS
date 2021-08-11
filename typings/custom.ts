
     
export class Author{

    name:String;
    lastname:String;

    constructor(name:String,lastname:String)
    {
        this.name=name;
        this.lastname=lastname;
    }
 }
  
  export class Price {
  
    currency: String;
    amount: Number;
    decimals:Number;
  
    constructor(
      currency: String,
      amount: Number,
      decimals:Number,)
      {
        this.currency=currency,
        this.amount=amount,
        this.decimals=decimals
      }
  
  }
  
  
  export class Product  {
     
      id: String;
      price: Price; 
      picture: String;
      condition: String;
      free_shipping: Boolean;
      sold_quantity: Number;
      description: String;
  
    constructor(id: String,
      price: Price,
      picture: String,
      condition: String,
      free_shipping: Boolean,
      sold_quantity: Number,
      description: String, ){
  
        this.id=id;
        this.price=price;
        this.picture=picture;
        this.condition=condition;
        this.free_shipping=free_shipping;
        this.sold_quantity=sold_quantity;
        this.description=description
  
    }
      
  
  }
  
  export class Category{
  
    name:String
  
    constructor(name:string)
    {
      this.name=name
    }
  
  }
  
  export class ProductReturn{
  
    author:Author;
    product:Product;
  
    constructor( author:Author,
      product:Product)
      {
        this.author=author
        this.product=product
      }
  
  }
  
  export class ProductListReturn{
  
      author:Author;
      categories:[Category];
      items:[Product]
  
      constructor(
        author:Author,
        categories:[Category],
        items:[Product])
        {
          this.author=author;
          this.categories=categories;
          this.items=items
        }
  
  }
  