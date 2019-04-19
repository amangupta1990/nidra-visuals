var storyBoard = [{
    tick:35,
    anim:function(){
        
        anime({
        targets: bloomParams,
        exposure: 1,
        bloomStrength: 1.5,
        bloomThreshold: 0,
        bloomRadius: 0,
        duration: metronome.quaterNoteLength*2,
        update: function (){
            bloomPass.bloomStrength = bloomParams.bloomStrength;
            renderer.toneMappingExposure = bloomParams.exposure
            bloomPass.bloomThreshold = bloomParams.bloomThreshold;
            bloomPass.bloomRadius = bloomParams.bloomRadius;
        }
    })
}
},

{
    tick:50,
    anim:function(){
        anime({
        
        targets: bloomParams,
        exposure: 2,
        bloomStrength: 3,
        bloomThreshold: 0,
        bloomRadius: 1,
        update: function (){
            bloomPass.bloomStrength = bloomParams.bloomStrength;
            renderer.toneMappingExposure = bloomParams.exposure
            bloomPass.bloomThreshold = bloomParams.bloomThreshold;
            bloomPass.bloomRadius = bloomParams.bloomRadius;
        }
    })
}
},


{
    tick:60,
    anim: function(){
        anime({
        targets: bloomParams,
        exposure: 1,
        bloomStrength: 0.2,
        bloomThreshold: 0.8,
        bloomRadius: 0,
        update: function (){
            bloomPass.bloomStrength = bloomParams.bloomStrength;
            renderer.toneMappingExposure = bloomParams.exposure
            bloomPass.bloomThreshold = bloomParams.bloomThreshold;
            bloomPass.bloomRadius = bloomParams.bloomRadius;
        }
    })
}
},

{
    tick:70,
    anim:function(){
        anime({
        targets: bloomParams,
        exposure: 0.1,
        bloomStrength: 0.4,
        bloomThreshold: 0.2,
        bloomRadius: 1,
        update: function (){
            bloomPass.bloomStrength = bloomParams.bloomStrength;
            renderer.toneMappingExposure = bloomParams.exposure
            bloomPass.bloomThreshold = bloomParams.bloomThreshold;
            bloomPass.bloomRadius = bloomParams.bloomRadius;
        }
    })
}
},

{
    tick:37,
    anim:function(){
        
        for (let flower of flowers)
        {

        
			flower.rgb1 = {
				r: 0,
				g: 0,
				b: 0,
				scale: 1
			};


        anime.timeline({
        rounds:4,
        duration: metronome.quaterNoteLength / 4,
        easing: 'cubicBezier(.5, .05, .1, .3)',

    }).add({
    
            targets: flower.rgb1,
            duration: metronome.quaterNoteLength / 8,
            easing: 'cubicBezier(.5, .05, .1, .3)',
            r: 0,
            g: 255,
            b: 255,
            scale: 1.2,
            update: function () {
                flower.material.color.setRGB(flower.rgb1.r, flower.rgb1.b, flower.rgb1.g)
                flower.scale.set(flower.rgb1.scale, flower.rgb1.scale, flower.rgb1.scale)
            }
        }).add({

            targets: flower.rgb1,
            duration: metronome.quaterNoteLength / 8,
            easing: 'cubicBezier(.5, .05, .1, .3)',
            r: 0,
            g: 0,
            b: 0,
            scale: 1,
            update: function () {
                flower.material.color.setRGB(flower.rgb1.r, flower.rgb1.b, flower.rgb1.g)
                flower.scale.set(flower.rgb1.scale, flower.rgb1.scale, flower.rgb1.scale)
            }
        })

    }

    }
},

{
    tick:44,
    anim: function(){
        anime.timeline({
            easing: 'cubicBezier(.5, .05, .1, .3)',
            duration: metronome.quaterNoteLength / 2,
            complete: function () {
    
                var tl2 = anime.timeline({
                    easing: 'cubicBezier(.5, .05, .1, .3)',
                    duraton: metronome.quaterNoteLength
                })
                    .add(({
                        targets: moonRingAnimParms,
                        scale: 1,
                        opacity: 0,
                        loop: false,
                        duration: metronome.quaterNoteLength,
    
                        update: function () {
    
                            moonRing.scale.set(moonRingAnimParms.scale, moonRingAnimParms.scale, moonRingAnimParms.scale)
                            moonRing.material.opacity = moonRingAnimParms.opacity;
    
                        }
                    }))
                    .add(({
                        targets: moonRingAnimParms,
                        scale: 0,
                        opacity: 1,
                        loop: false,
                        duration: 0,
                        update: function () {
    
                            moonRing.scale.set(moonRingAnimParms.scale, moonRingAnimParms.scale, moonRingAnimParms.scale)
                            moonRing.material.opacity = moonRingAnimParms.opacity;
    
                        }
                    }))
            }
        })
            .add({
                targets: moonRingAnimParms,
                moonScale: 1.5,
                duration: metronome.quaterNoteLength / 4,
                update: function () {
    
                    moon.scale.set(500 * moonRingAnimParms.moonScale, 500 * moonRingAnimParms.moonScale, 1);
                }
            })
            .add({
                targets: moonRingAnimParms,
                moonScale: 1,
                duration: metronome.quaterNoteLength / 4,
                update: function () {
    
                    moon.scale.set(500 * moonRingAnimParms.moonScale, 500 * moonRingAnimParms.moonScale, 1);
                }
            })
    }
}

]