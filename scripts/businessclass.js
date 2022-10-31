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
        // la nueva estructura no requiere manejo de dirty
        /*
        for(let i=INITIALMONTH;i<INITIALMONTH+MONTHTOSHOW;i++){
            if(this.mesProjStruct[i]!==undefined)
            this.mesProjStruct[i].forEach((el)=>{
                    el.equipo.forEach((mem)=>{
                        if(mem.dirty!==undefined)
                            if(mem.dirty==1){
                                mem.dirty=0;
                                console.log("cleanChanged",mem);
                            }
                                
                    });
                
            })        
        }*/
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
                    sumDedication += parseFloat(this.data[i].equipo[j].horasPlan);
                }
                return sumDedication;
            }
            
        }
        return -1;
    }
    setInStaffing(proj){
        for(let i=0;i<24;i++){
            this.mesProjStruct[i].forEach((el)=>{
                if(el.IDp!==undefined){
                    //console.log("improbable",el.IDp)
                    if(el.IDp==proj) el.improbable=0;
                }
            })
        }
       //console.log("setImprobable",proj,this.mesProjStruct);
    }
    setOutStaffing(proj){
        for(let i=0;i<24;i++){
            this.mesProjStruct[i].forEach((el)=>{
                if(el.IDp!==undefined){
                    //console.log("improbable",el.IDp)
                    if(el.IDp==proj) el.improbable=1;
                }
            })
        }
       //console.log("setImprobable",proj,this.mesProjStruct);
    }
    // este es el método que sustituye a setChngStruct. Maneja una estructura paralela mas simple
    setChangeStruct(IDp,year,mes,nb,horasPlan){
        
        let existe=false;
        if(mes>12)
            mes=mes-12;
        this.chngStruct.forEach((c)=>{
            console.log("en el loop",c,c.IDp,IDp,c.IDp==IDp,c.nb,nb,c.nb==nb)
            if(c.IDp==IDp && c.nb==nb && c.mes==mes && c.year==year){
                c.horasPlan=horasPlan;
                existe=true;
            }
        });
        if(!existe){
            let oChang={IDp:IDp,nb:nb,year:year,mes:mes,horasPlan:horasPlan};
            this.chngStruct.push(oChang);
        }
        console.log("setChangeStruct - nueva estructura",this.chngStruct)
    }
    setChngStruct(IDp,fase,mes,nb,horasPlan,inOnSite,obj){
        /*
        {IDp,nb,mes,horasPlan}
        */
        console.log("setChngStruct obj",obj,this.chngStruct);
        let wasChanged=false;
        for(let i in this.chngStruct){
            if(this.chngStruct[i].IDp==IDp && this.chngStruct[i].fase==fase && this.chngStruct[i].mes==mes){
                for(let j in this.data[i].equipo){ 
                    if(this.chngStruct[i].equipo[j].nombre==nb && parseInt(this.chngStruct[i].equipo[j].horasPlan)==parseInt(horasPlan) ){
                        wasChanged=true;
                    }
                }
            }
        }
        let existe=false;
        this.chngStruct.forEach((el)=>{
            if(JSON.stringify(el)===JSON.stringify(obj)){
                console.log("isEqual",el,obj)
                existe=true;
            }
        })
        if(!existe)    //si no existe se agregas
            this.chngStruct.push(obj) ; 
        console.log("ChngStruct",this.chngStruct);
    }
    setTeamInData(IDp,fase,mes,nb,horasPlan,inOnSite){
        console.log("setTeamInData caso existe",IDp,fase,mes,nb,this.mesProjStruct[mes]);
        var existe=false;
        let obj={}
        this.mesProjStruct[mes].forEach((el)=>{
            obj={nombre:nb,horasPlan:horasPlan,original:0,inOnSite:inOnSite,newDedi:'NaN',chg_dedi:'',dirty:1};
            if(el.IDp==IDp) {
                el.equipo.forEach((mem)=>{

                    if(mem.nombre==nb){
                        mem.horasPlan=horasPlan;
                        mem.inOnSite=inOnSite;
                        mem.dirty=1;
                        existe=true;
                        console.log("setTeamInData->setChngStruct")
                        //this.setChngStruct(IDp,fase,mes,nb,horasPlan,inOnSite,el);
                        this.setChangeStruct(IDp,el.year,mes,nb,horasPlan);
                        return 0;
                    }
                });
            }
        })
        if(!existe){
            console.log("setTeamInData - error inesperado se debe invocar en todo caso a addTeamToData(IDp,fase,mes,nb,horasPlan,inOnSite)")
            return -1;
        }
       
    }
    addTeamToData(IDp,fase,mes,nb,horasPlan,inOnSite){
        //console.log("addTeamToData in",mes,IDp,nb,this.mesProjStruct[mes]);
        let obj={}
        this.mesProjStruct[mes].forEach((el)=>{
            obj={nombre:nb,horasPlan:horasPlan,original:0,inOnSite:inOnSite,newDedi:'NaN',chg_dedi:'',dirty:1};
            if(el.IDp==IDp) {
                el.equipo.push(obj);
                console.log("addTeamToData->setChngStruct")
                //this.setChngStruct(IDp,fase,mes,nb,horasPlan,inOnSite,el);
                this.setChangeStruct(IDp,el.year,mes,nb,horasPlan);
            }
        })
        
        //console.log("addTeamToData out",mes,IDp,nb,this.mesProjStruct[mes]);

    }    

    createMesProjStruct(){
        //console.log("createMesProjStruct-data",this.data)
        this.mesProjStruct=this.data;

    }
    updateMesProjStruct(m){
        //console.log("updateMesProjStruct")
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
            
            if(monthTemp[i].IDp==idp ){
                return monthTemp[i].equipo
            }
        }
    }    
    createMesStruct(){
        for(let i in this.mesProjStruct){
            var people = new Map();
            var dat=this.mesProjStruct[i];
            //console.log("createMesStruct var dat",dat)
            dat.forEach(element =>{
                if(element.equipo !== undefined)
                element.equipo.forEach(member=>{
                    if(people.has(member.nombre)){
                        var p=people.get(member.nombre);
                        let dedi=member.dedicacion==""?0.0:parseFloat(member.dedicacion)     
                        let hplan=member.horasPlan?parseFloat(member.horasPlan):0.0;    
                        let real=member.real?parseFloat(member.real):0.0;  
                        //horasReal                

                        let hreal=member.horasReal?parseFloat(member.horasReal):0.0;
                        p.horasPlan+=parseFloat(hplan);
                        p.horasPlan=Math.round(p.horasPlan);
                        p.horasReal+=Math.round(parseFloat(hreal));

                        people.set(member.nombre,p);
                    }else{
                        let hplan=member.horasPlan?parseFloat(member.horasPlan):0.0;
                        let hreal=member.horasReal?parseFloat(member.horasReal):0.0;  
                        people.set(member.nombre,{horasPlan:Math.round(hplan),horasReal:Math.round(hreal)})
                    }
                })
            });
            this.mesStruct[i]=people;
        }
        console.log("mesStruct",this.mesStruct);
    }
    updateMesProjStructByImprob(IDp){
        let meses=[];
        for(let i=0;i<25;i++){
            let dat=this.mesProjStruct[i];
            let existe=false;

            dat.forEach((el)=>{
               if(el.IDp==IDp) existe=true;
            });
            console.log("updateMesProjStructByImprob existe",i,IDp,existe);
            if(existe){
                meses.push(i);
                // el proyecto está en el mes
                var people = new Map();
                dat.forEach(element =>{
                    //console.log("updateMesProjStructByImprob update",element.IDp,element.improbable);

                    element.equipo.forEach(member=>{                
                        //console.log("updateMesStruct foreach equipo",member,people.has(member.nombre))
                        if(people.has(member.nombre)){
                            var p=people.get(member.nombre);
                            var hplan=member.horasPlan?parseFloat(member.horasPlan):0.0;      
                            var hreal=member.horasReal?parseFloat(member.horasReal):0.0;
                            if(element.improbable==1)     
                                console.log("es improbable- OutStaffing es 1 no sumar",element.improbable,element)
                            if(element.improbable==0){
                                p.horasPlan+=Math.round(parseFloat(hplan));
                                p.horasReal+=Math.round(parseFloat(hreal));
                            }
                            people.set(member.nombre,p);
                        }else{
                            if(element.improbable==0){
                                var planh=member.horasPlan?parseFloat(member.horasPlan):0.0;
                                var realh=member.horasReal?parseFloat(member.horasReal):0.0;
                            }else{
                                var planh=member.horasPlan=0
                                var realh=member.horasReal=0;
                            }
                            people.set(member.nombre,{horasPlan:Math.round(planh),horasReal:Math.round(realh)})
                        }
                    })
                });
                //console.log("updateMesProjStructByImprob in"+i,this.mesStruct[i],people);       
                this.mesStruct[i]=people; 
                //console.log("updateMesProjStructByImprob out"+i,this.mesStruct[i]);
            }
        }
        return meses;
    }
    updateMesStruct(m){
        var dat=this.mesProjStruct[m];
        //console.log("updateMesStruct dat",m,dat);
        var people = new Map();
        dat.forEach(element =>{
            //console.log("improbable update",element.IDp,element.improbable)
            element.equipo.forEach(member=>{                
                //console.log("updateMesStruct foreach equipo",member,people.has(member.nombre),member.horasPlan);
                if(people.has(member.nombre)){
                    var p=people.get(member.nombre);
                    var hplan=member.horasPlan?parseFloat(member.horasPlan):0.0;      
                    var hreal=member.horasReal?parseFloat(member.horasReal):0.0;
                    
                    p.horasPlan+=Math.round(parseFloat(hplan));
                    p.horasReal+=Math.round(parseFloat(hreal));
                    //console.log("updateMesStruct foreach equipo",member,people.has(member.nombre),member.horasPlan,hplan,p);
                    people.set(member.nombre,p);
                }else{
                    var hplan=member.horasPlan?parseFloat(member.horasPlan):0.0;
                    var hreal=member.horasReal?parseFloat(member.horasReal):0.0;
                    people.set(member.nombre,{horasPlan:Math.round(hplan),horasReal:Math.round(hreal)})
                }
            })
        });
        //console.log("updateMesStruct in"+m,this.mesStruct[m],people);       
        this.mesStruct[m]=people; 
        //console.log("updateMesStruct out"+m,this.mesStruct[m]);       
    }
    getAllMonStruct(){
        return this.mesStruct;
    }
    getMonStruct(nb,mes){
        console.log("getMonStruct",mes,nb);
        return this.mesStruct[mes].get(nb).horasPlan;
    }
    setAllStruct(IDp,fase,nb,horasPlan,mes,inOnSite){
        console.log("setAllStruct",IDp,fase,nb,horasPlan,mes,inOnSite);
        // se cambia la estructura mensual, luego el array de data y finalmente (y en ese orden) se cambia la estructura de proyecto
        //console.log("setAllStruct in",this.mesProjStruct);
        //console.log("setAllStruct in ",mes,this.mesStruct[mes])
        if(horasPlan && !isNaN(horasPlan)){
            if(this.mesStruct[mes].has(nb)){
                this.mesStruct[mes].get(nb).horasPlan = parseFloat(horasPlan);
                console.log("se encontro y se cambio",nb,this.mesStruct[mes].get(nb));
                // se cambia en el arreglo data y la estructura 
                // de proyectos
                if(this.setTeamInData(IDp,fase,mes,nb,horasPlan,inOnSite)==-1){
                    console.log("dio error porque no esta en el team y se pasa a agregar");
                    this.addTeamToData(IDp,fase,mes,nb,horasPlan,inOnSite);            // array data, almacena el cambio en chgStruct
                }
                this.updateMesStruct(mes);                     // actualiza la estructura de proyecto
            }else{
                console.log("No existe. Hay que agregarlo",nb,this.mesStruct[mes]);
                this.addTeamToData(IDp,fase,mes,nb,horasPlan,inOnSite);         // agrega la persona en el equipo, en caso que no exista y almacena el cambio
                //this.updateMesProjStruct(mes);                      // actualiza la estructua de proyecto
                this.updateMesStruct(mes);                          //se actualiza solo el mes 
            }
        }else confirm("Revise los datos que desea cambiar");
        //console.log("setAllStruct out",this.mesStruct[mes])
    }
    getStructByMonth(mon){
        return this.mesStruct[mon];  //return a map of people
    }

}
/**
 * {
  "data": [
    {
      "usr": "JUAN PALENZUELA",
      "idProy": 233,
      "nb_proyecto": "UepaTickets/UepaPay - Assessment de Technical Readiness",
      "tot_new_horas": 155,
      "tot_orig_horas": 0,
      "diferencia": -155,
      "Agregado": 1,
      "Modificado": null,
      "Cambios": "Incorporado"
    },
    {
      "usr": "Arleen Aponte",
      "idProy": 233,
      "nb_proyecto": "UepaTickets/UepaPay - Assessment de Technical Readiness",
      "tot_new_horas": 45.3,
      "tot_orig_horas": 200,
      "diferencia": 154.7,
      "Agregado": null,
      "Modificado": 1,
      "Cambios": "Quitar horas"
    },
 * 
 */
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
        let data= await this.util.asynGetFromDB(`https://staffing-func.azurewebsites.net/api/gethistchanges`,myToken,myTime);
        this.Hdata=data.data;
        console.log("update data",this.Hdata);
    }
}