const formatCurrency = (value: number) => {
  const formattedValue = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  return formattedValue;
}

export class Product{
  public id : number
  public name : string
  public description : string
  public picture?: string
  public sku?: string
  public category_id: number
  public price: number
  public price_formatted?: string

  constructor(props: Omit<Product, 'id'>, id?: number){
    Object.assign(this, props)
    if(id) this.id = id

    this.price_formatted = formatCurrency(this.price)
  }
}