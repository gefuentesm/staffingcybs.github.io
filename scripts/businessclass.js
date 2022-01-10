class ProjList{
    
    constructor(data){
        this.mesProjStruct=Array.from({length: 24}, function() { return []; });
        this.mesStruct=Array.from({length: 24}, function() { return []; });
        this.data=data.data;   
        //forma actual basada en array
        this.createMesProjStruct();
        this.createMesStruct();
        this.chngStruct=[];
    }
    getChanged(){
        return this.chngStruct;
    } 
    cleanChanged(){
        this.chngStruct=[];
    }   
    getData(){
        return this.data;
    }   
    getTeamDedication(IDp,fase,mes){
        //console.log("getTeamDedication",IDp,fase,mes);
        let sumDedication=0.0;
        var existe=false;
        for(let i in this.data){  
            if(this.data[i].IDp==IDp && this.data[i].fase==fase && this.data[i].mes==mes){
                for(let j in this.data[i].equipo){  
                    sumDedication += parseFloat(this.data[i].equipo[j].dedicacion);
                }
                return sumDedication;
            }
            
        }
        return -1;
    }
    setChngStruct(IDp,fase,mes,nb,dedicacion,inOnSite,obj){
        let wasChanged=false;
        for(let i in this.chngStruct){
            if(this.chngStruct[i].IDp==IDp && this.chngStruct[i].fase==fase && this.chngStruct[i].mes==mes){
                for(let j in this.data[i].equipo){ 
                    if(this.chngStruct[i].equipo[j].nombre==nb && this.chngStruct[i].equipo[j].dedicacion==dedicacion && this.chngStruct[i].equipo[j].inOnSite==inOnSite ){
                        wasChanged=true;
                    }
                }
            }
        }
        if(!wasChanged)
            this.chngStruct.push(obj) ; 
    }
    setTeamInData(IDp,fase,mes,nb,dedicacion,inOnSite){
        //console.log("setTeamInData",IDp,fase,mes,nb,dedicacion);
        var existe=false;
        for(let i in this.data){  
            if(this.data[i].IDp==IDp && this.data[i].fase==fase && this.data[i].mes==mes){
                this.data[i].dirty=1;
                for(let j in this.data[i].equipo){  
                    if(this.data[i].equipo[j].nombre==nb){
                        this.data[i].equipo[j].dedicacion=dedicacion;
                        this.data[i].equipo[j].inOnSite=inOnSite;
                        this.data[i].equipo[j].dirty=1;
                        existe=true;
                        //console.log("setTeamInData",this.data[i]);
                        //this.chngStruct.push(this.data[i]) ;            // almacena el cambio para enviar a la base de datos
                        this.setChngStruct(IDp,fase,mes,nb,dedicacion,inOnSite,this.data[i]);
                        return 0;
                    }
                }
                if(!existe){
                    this.data[i].equipo.push({nombre:nb,dedicacion:dedicacion,original:0,newDedi:"NaN",inOnSite:inOnSite,chg_dedi:0,dirty:1});
                    this.chngStruct.push(this.data[i]) ; 
                    //console.log("no existe, se agregó",this.data[i].equipo,this.chngStruct);
                    return 0;
                }
            }
            
        }
        return -1;
    }
    addTeamToData(IDp,fase,mes,nb,dedicacion,inOnSite){
        for(let i in this.data){  
            if(this.data[i].IDp==IDp && this.data[i].fase==fase && this.data[i].mes==mes){
                this.data[i].equipo.push({nombre:nb,dedicacion:dedicacion,original:0,inOnSite:inOnSite,newDedi:'NaN',chg_dedi:'',dirty:1});
                //console.log("addTeamToData",this.data[i]);
                //this.chngStruct.push(this.data[i]) ;                    // almacena el cambio para enviar en la base de datos
                this.setChngStruct(IDp,fase,mes,nb,dedicacion,inOnSite,this.data[i]);
                break;
            }
             
        }
    }    

    createMesProjStruct(){
        for(let i in this.data){         
            var arr=this.mesProjStruct[this.data[i].mes];
            if(typeof arr=="undefined"){
                arr=[];
                arr.push(this.data[i]);
            }else{
                arr.push(this.data[i]);
            }
            this.mesProjStruct[this.data[i].mes]=arr;  // data[i] is a project objet with team objet 
        }
        //console.log("this.mesProjStruct",this.mesProjStruct);
    }
    updateMesProjStruct(m){
        var arr=[];
        for(let i in this.data){
            if(this.data[i].mes==m){
                arr.push(this.data[i]);
            }
        }
        this.mesProjStruct[m]=arr;
        //console.log("this.updateMesProjStruct-"+m,this.mesProjStruct[m]);
    }    
    getProjectByMonth(mon){
        return this.mesProjStruct[mon];
    }
    getTeamByProjectMonthFase(idp,mon,fase){
        let monthTemp= this.mesProjStruct[mon];
        for(let i in monthTemp){
            if(monthTemp[i].idp==idp && monthTemp[i].fase==fase){
                return monthTemp[i].equipo
            }
        }
    }    
    createMesStruct(){
        for(let i in this.mesProjStruct){
            var people = new Map();
            var dat=this.mesProjStruct[i];
            dat.forEach(element =>{
                element.equipo.forEach(member=>{
                    if(people.has(member.nombre)){
                        var p=people.get(member.nombre);
                        var dedi=member.dedicacion==""?0.0:parseFloat(member.dedicacion)                        
                        p.dedicacion+=parseFloat(dedi);
                        people.set(member.nombre,p);
                    }else{
                        var ded=member.dedicacion==""?0:parseFloat(member.dedicacion);
                        people.set(member.nombre,{dedicacion:ded})
                    }
                })
            });
            this.mesStruct[i]=people;
        }
        //console.log("mesStruct",this.mesStruct);
    }
    updateMesStruct(m){
        var dat=this.mesProjStruct[m];
        var people = new Map();
        dat.forEach(element =>{
            element.equipo.forEach(member=>{
                if(people.has(member.nombre)){
                    var p=people.get(member.nombre);
                    var dedi=member.dedicacion==""?0.0:parseFloat(member.dedicacion)                        
                    p.dedicacion+=parseFloat(dedi);
                    people.set(member.nombre,p);
                }else{
                    var ded=member.dedicacion==""?0:parseFloat(member.dedicacion);
                    people.set(member.nombre,{dedicacion:ded})
                }
            })
        });
        this.mesStruct[m]=people; 
        //console.log("updateMesStruct"+m,this.mesStruct[m]);       
    }
    getAllMonStruct(){
        return this.mesStruct;
    }
    getMonStruct(nb,mes){
        return this.mesStruct[mes].get(nb).dedicacion;
    }
    setAllStruct(IDp,fase,nb,dedica,mes,inOnSite){
        //console.log("setAllStruct",IDp,fase,nb,dedica,mes)
        // se cambia la estructura mensual, luego el array de data y finalmente (y en ese orden) se cambia la estructura de proyecto
        if(dedica && !isNaN(dedica)){
            if(this.mesStruct[mes].has(nb)){
                this.mesStruct[mes].get(nb).dedicacion = parseFloat(dedica);
                //console.log("se cambio",this.mesStruct[mes].get(nb));
                // se cambia en el arreglo data y la estructura 
                // de proyectos
                this.setTeamInData(IDp,fase,mes,nb,dedica,inOnSite);         // array data, almacena el cambio en chgStruct
                this.updateMesProjStruct(mes);                      // actualiza la estructura de proyecto
            }else{
                //console.log("No existe. Hay que agregarlo",nb);
                this.addTeamToData(IDp,fase,mes,nb,dedica,inOnSite);         // agrega la persona en el equipo, en caso que no exista y almacena el cambio
                this.updateMesProjStruct(mes);                      // actualiza la estructua de proyecto
                this.updateMesStruct(mes);                          //se actualiza solo el mes 
            }
        }else confirm("Revise los datos que desea cambiar");
    }
    getStructByMonth(mon){
        return this.mesStruct[mon];  //return a map of people
    }

}
class HistoricChanges{
    constructor(){
        this.util=new Util();
        this.Hdata=[];
        this.updateData();
        
    }
    getData(){
        return this.Hdata;
    }
    async updateData(){
        let data= await this.util.asynGetFromDB(`https://gethistchanges.azurewebsites.net/api/gethistchanges`);
        this.Hdata=data.data;
        console.log("update data",this.Hdata);
    }
}