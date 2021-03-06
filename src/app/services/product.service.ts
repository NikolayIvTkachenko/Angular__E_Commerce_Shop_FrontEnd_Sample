import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../common/product';

import {map} from 'rxjs/operators';
import { ProductCategory } from '../common/product-category';

@Injectable({
  providedIn: 'root'
})
export class ProductService {


  private baseUrl = 'http://localhost:8080/api/products';
  //private baseUrl = 'http://localhost:8080/api/products?size=100';

  private categoryUrl = 'http://localhost:8080/api/product-category';

  constructor(private httpClient: HttpClient) { }

  getProductList(theCategoryId: number): Observable<Product[]>{

    //@TODO: need to build based on category id
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`;

    return this.getProducts(searchUrl);
    //return this.httpClient.get<GetResponse>(this.baseUrl).pipe(
    //   return this.httpClient.get<GetResponseProduct>(searchUrl).pipe(
    //   map(response => response._embedded.products)
    // );
  }

  getProductCategories(): Observable<ProductCategory[]> {
    return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(
      map(response => response._embedded.productCategory)
    );
  }

  searchProducts(theKeyword: string) : Observable<Product[]> {
    //keyword
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`;
    return this.getProducts(searchUrl);
  }

  private getProducts(searchUrl: string): Observable<Product[]> {
    return this.httpClient.get<GetResponseProduct>(searchUrl).pipe(
      map(response => response._embedded.products)
    );
  }

  getProduct(theProductId: number) : Observable<Product> {
    const productUrl = `${this.baseUrl}/${theProductId}`;

    return this.httpClient.get<Product>(productUrl);
  }

  getProductListPaginate(thePage: number, 
                         thePageSize: number, 
                         theCategoryId: number) : Observable<GetResponseProduct>{

    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`
          +`&page=${thePage}&size=${thePageSize}`;

    return this.httpClient.get<GetResponseProduct>(searchUrl);
  }


}

interface GetResponseProduct {
  _embedded:{
    products: Product[];
  },
  page: {
    size: number,
    totalElements: number,
    totalPages: number,
    number: number
  }
}

interface GetResponseProductCategory {
  _embedded:{
    productCategory: ProductCategory[];
  }
}
