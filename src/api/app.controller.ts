import { Controller, Get } from "@nestjs/common";

@Controller()
export class AppController {
    constructor(){}

  @Get("/")
  start(){
     return 'Assalomu alaykum';
  }  
}