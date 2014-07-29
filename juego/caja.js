Q.Sprite.extend("HongoVida", {
	init : function(p) {
		this._super(p, {
			sheet : "objetos",
			frame : 1,
			vx: 150,
			//desabilitamos temporalmentelas colisiones
			sensor: true,
			z:1
		});
		this.add("animation,tween,aiBounce");
		
		//colisionar por todos lados... hit
		this.on("hit", function(colision) {
			//si el objeto que le pego al hongo es el jugador
			if (colision.obj.isA("Jugador")) {
				//destruimos a este hongo
				this.destroy();
			}
		});

	}
}); 


Q.animations("animacionCaja", {
	brillar : {
		frames : [2, 3, 4],
		rate : 1 / 3,
		loop : true
	},
	apagado : {
		frames : [5],
		rate : 1 / 2,
		loop : false
	}
});

Q.Sprite.extend("Caja", {
	init : function(p) {
		this._super(p, {
			sprite : "animacionCaja",
			sheet : "objetos",
			frame : 3,
			//DESHABILITAMOS LA GRAVEDAD
			gravity : 0,
			//ordenar una capa encima de la otra que tenga un valor de z menor
			z:10
		});
		this.add("2d,animation");

		this.play("brillar");

		this.on("bump.bottom", function(colision) {

			if (colision.obj.isA("Jugador")) {
				this.play("apagado");
				//insertamos al hongo de vida en el escenario
				var hongo = new Q.HongoVida({
					//es la cordenada en x de la caja
					x:this.p.x,
					y:this.p.y
				});
				//this.stage == al escenario en que vive este objeto
				this.stage.insert(hongo);
				//una vez que insertamos al hongo hacemos una animacion tween
				hongo.animate({
					//anima este hongo en la coordenada y de la caja 
					y:this.p.y  -35					
				},0.5,{
					//escuchar argumento cuando el hongo salio por completo
					callback:function(){
						//regresamos al hongo 2d para que detecte colisiones
						//desabilitamos la propiedad sento
						this.p.sensor = false;
						this.add("2d");
					}
				});
			}

		});

	}
}); 