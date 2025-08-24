import { ApiConfig } from "../data/ApiConfig";
import { Api } from "./ApiService";
import { AuthenticationService } from "./AuthenticationService";

type CartItemType = {
  id: number;
  quantity: number;
  title: string;
  category_name: string;
  price: number;
  image_url: string;
};

export class CartService {
  public static cartItems: CartItemType[] = [];

  public static async updateCart(product: any, quantity: number) {
    console.log(product);

    var found = this.cartItems.find((ci) => ci.id == product.id);

    if (found) {
      this.cartItems = this.cartItems.map((ci) =>
        ci.id == product.id ? { ...ci, quantity } : ci
      );
    } else {
      this.cartItems.push({...product,quantity});
    }

    this.cartItems = this.cartItems.filter((ci) => ci.quantity > 0);


    await this.syncAllStorage();
  }

  public static async searchCart(): Promise<CartItemType[]> {
    if (await AuthenticationService.isAuthenticated()) {
      var items: CartItemType[] = await Api("cart/search");
      if (items) {
        this.cartItems = items;
        await this.syncCartWithLocalStorage();
        return items;
      }
      return [];
    } 

    return await this.searchLocalCart();


  }

  public static async searchLocalCart(){
    var localItems: any = localStorage.getItem(ApiConfig.CartLocalStorageKey);
      try {
        localItems = JSON.parse(localItems);
        if (Array.isArray(localItems)) {
          this.cartItems = localItems;
          return localItems;
        }
      } catch (error) {
        return [];
      }

      return [];
  }

  public static async getFromCart(product_id: number) {
    return this.cartItems.find((ci) => ci.id == product_id);
  }

  public static async syncAllStorage() {
        this.syncCartWithLocalStorage();
    await this.searchLocalCart();
    if (await AuthenticationService.isAuthenticated()) {
      await this.syncCartWithBackend();
    }
  }

  public static async syncCartWithBackend() {
    await Api("cart/sync", {
      cart_items: this.cartItems,
    });
  }

  public static async syncCartWithLocalStorage() {
    localStorage.setItem(
      ApiConfig.CartLocalStorageKey,
      JSON.stringify(this.cartItems)
    );
  }
}

/* 


async function syncCart(req,res){
await db.query('delete from cart where user_id=?',[req.user.id]);
for(var item of req.body.cart_items){
        await db.query('insert into cart set quantity=?,product_id=?,user_id=?',[item.quantity,item.product_id,req.user.id]);
}
res.send('success');
}

*/
