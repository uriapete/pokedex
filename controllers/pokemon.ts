import exp from "constants";
import { Request,Response } from "express";
import { stat } from "fs";

const express = require("express");
const router = express.Router();
const {pokemon} = require("../models");

function sortPokemon():void {
    pokemon.sort((a:any,b:any)=>{
        if (parseInt(a.id)<parseInt(b.id)) {
            return -1;
        } else if(parseInt(a.id)>parseInt(b.id)){
            return 1;
        } else return 0;
    })
}

sortPokemon();


const amtMonPerIdxPage:number = 16;
let idxPg:number;

router.get("/",(req:Request,res:Response)=>{
    if (typeof req.query.page === "undefined"){idxPg = 0}
    else {idxPg = parseInt(req.query.page!.toString())}
    res.render("pokemon/index", {pokemon, page:idxPg, amtMonPerIdxPage})
})

router.get("/new",(req:Request,res:Response)=>{
    res.render("pokemon/new")
})

router.get("/:id",(req:Request,res:Response)=>{
    const id:string = req.params.id;
    let mon:any;
    for (let i = 0; i < pokemon.length; i++) {
        const element = pokemon[i];
        if(element.id===id){
            mon=element;
            for (let j = 0; (j*amtMonPerIdxPage) < pokemon.length; j++) {
                if(j*amtMonPerIdxPage>i){
                    j=(pokemon.length/amtMonPerIdxPage)+1;
                } else {
                    idxPg=j;
                }
            }
            i=pokemon.length;
        }
    }
    res.render("pokemon/show", {mon, idxPg})
})

router.get("/:id/edit",(req:Request,res:Response)=>{
    const id:string = req.params.id;
    let mon:any;
    for (let i = 0; i < pokemon.length; i++) {
        const element = pokemon[i];
        if(element.id===id){
            mon=element;
            i=pokemon.length;
        }
    }
    res.render("pokemon/edit", {mon, idxPg})
})

router.post("",(req:Request,res:Response)=>{
    const newMon = req.body;
    newMon.type = [newMon.type1];
    if(typeof newMon.type2 !== "undefined"){newMon.type.push(newMon.type2)}
    // const testarr:Array<any> = [];
    // testarr.push
    const stats: Object = {
        hp: newMon.hp,
        attack:newMon.attack,
        defense:newMon.defense,
        spattack:newMon.spattack,
        spdefense:newMon.spdefense,
        speed:newMon.speed,
    };
    newMon.stats=stats;
    // console.log(newMon);
    pokemon.push(newMon);
    sortPokemon();
    res.redirect(`/pokemon/${newMon.id}`);
})

router.put("/:id",(req:Request,res:Response)=>{
    const id:string = req.params.id;
    // let monToEdit:any;
    let oldArrIdx:number = 0;
    for (let i = 0; i < pokemon.length; i++) {
        const element = pokemon[i];
        if(element.id===id){
            oldArrIdx=i;
            // monToEdit=element;
            i=pokemon.length;
        }
    }

    const newMon = req.body;
    newMon.type = [newMon.type1];
    if(typeof newMon.type2 !== "undefined"){newMon.type.push(newMon.type2)}
    // const testarr:Array<any> = [];
    // testarr.push
    const stats: Object = {
        hp: newMon.hp,
        attack:newMon.attack,
        defense:newMon.defense,
        spattack:newMon.spattack,
        spdefense:newMon.spdefense,
        speed:newMon.speed,
    };
    newMon.stats=stats;
    // console.log(newMon);
    // pokemon.push(newMon);
    // monToEdit = newMon;
    pokemon[oldArrIdx] = newMon;
    // console.log(pokemon[oldArrIdx])
    sortPokemon();
    res.redirect(`/pokemon/${newMon.id}`);
})

router.get("/:id/delete",(req:Request,res:Response)=>{
    const id:string = req.params.id;
    let mon:any;
    for (let i = 0; i < pokemon.length; i++) {
        const element = pokemon[i];
        if(element.id===id){
            mon=element;
            for (let j = 0; (j*amtMonPerIdxPage) < pokemon.length; j++) {
                if(j*amtMonPerIdxPage>i){
                    j=(pokemon.length/amtMonPerIdxPage)+1;
                } else {
                    idxPg=j;
                }
            }
            i=pokemon.length;
        }
    }
    res.render("pokemon/delete", {mon, idxPg})
})

router.delete("/:id",(req:Request,res:Response)=>{
    const id:string = req.params.id;
    // let monToEdit:any;
    let oldArrIdx:number = 0;
    for (let i = 0; i < pokemon.length; i++) {
        const element = pokemon[i];
        if(element.id===id){
            oldArrIdx=i;
            // monToEdit=element;
            i=pokemon.length;
        }
    }
    
    pokemon.splice(oldArrIdx,1);

    sortPokemon();
    res.redirect(`/pokemon?page=${idxPg}`);
})

module.exports=router;