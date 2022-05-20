import { Injectable } from '@angular/core';
import { HttpInterceptor } from '@angular/common/http';
import { HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpHandler } from '@angular/common/http';
import { HttpEvent } from '@angular/common/http';
import { GlobalService } from './global.service';
@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {
  
  constructor(private global:GlobalService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url.includes("auth")) {
      return next.handle(req);
    }else{
      const tokenizedReq = req.clone({ headers: req.headers.set('Token', this.global.token) });
      return next.handle(tokenizedReq);
    }
  }

}