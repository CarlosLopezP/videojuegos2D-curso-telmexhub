//algoritmo A* para seguir personajes

//--- declaracion de un componente
//primer argumento nombre, segundo argumento : opciones de inicializacion
Q.component("saltarin",{
	added:function(){
		//se ejecuta cuando este ompoinente se agrega a un sprite
		//NORMALMENTE UN COMPONENTE MODIFICA UN GAME LOOP DE SPRITE Y SUS PROPIEDADES
		//this.entity = es el sprite en el cual este componente se aplico
		this.entity.on("step",this,"saltar");
	},
	//es la funcion que vamos a ejecutar adicionamlmente al game loop
	saltar:function(){
		//checamos si su velocidad en el eje y es cero.. esta quieto
		if(this.entity.p.vy === 0){
			//agregamos una velocidad en el eje y para que salte la tortuga
			this.entity.p.vy = -400;
		}
	}
});

//crear el grupo de animaciones para la tortuga verde
Q.animations("animacionesTortugaVerde",{
	caminar: {
		frames:[0, 1],
		rate: 1 / 2,
		loop: true
	},
	enConchar: {
		frames: [2, 4],
		rate: 1 / 4,
		loop: false
	}
});

Q.Sprite.extend("TortugaVerde",{
	init: function(p){
		this._super(p,{
			sprite: "animacionesTortugaVerde",
			sheet: "tortugaVerde",
			frame: 0,
			vx:120,
			//DEFINIMOS NUESTRAS PROPIEDADES
			esConcha: false,
			enemigo:true,
			z:1
		});
		this.add("2d, aiBounce, animation, saltarin");
		this.play("caminar");
		//escucha el evento bump.top
		this.on("bump.top", this, "aConcha");
	},
	aConcha:function(colision){
		//Detectar si es mario el que le cayó encima
		if( colision.obj.isA("Jugador") ){
			//mario rebota
			colision.obj.p.vy = -500;
			//suena patada.mp3
			Q.audio.play("patada.mp3");
			
			//si la tortuga no es concha
			if( !this.p.esConcha ){
				//cambiar el sheet por el de enemigos bajos
				this.sheet("enemigosBajos", true);
				//activa la bandera esConcha
				this.p.esConcha = true;
			}
			
			//hacer que la tortuga se quede quieta cuando se esta moviendo
			if(this.p.vx != 0){
				this.p.vx = 0;
			}else{
			//hacer que la tortuga se mueva cuando esta quieta
				this.p.vx = 500;
			}
			
			
			//ejecutar la animacion enconchar
			this.play("enConchar");
		}
	},
	step: function(){
		//voltear cuando va a la derecha, vx+
		if(this.p.vx > 0){
			this.p.flip = "x";
		}
		
		//no voltear cuando va a la izquierda vx-
		if(this.p.vx < 0){
			this.p.flip = false;
		}
	}
});